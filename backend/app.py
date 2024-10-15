from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from io import BytesIO
import bcrypt
import cloudinary
import cloudinary.uploader
import jwt
import tensorflow as tf
import os
from dotenv import load_dotenv
from datetime import datetime
from tensorflow.keras.models import load_model
from db.database import db, migrate
from db.functions_db import *
from db.models import *

from functions import load_image, preprocess_image, create_diagnosis_pdf

tf.get_logger().setLevel('ERROR')

app = Flask(__name__)
# Configure CORS with support for credentials and allow all origins
CORS(app, supports_credentials=True, origins=['*'])

# Load environment variables
load_dotenv()
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

db.init_app(app)
migrate.init_app(app, db)

# Load AI model
#model = load_model(os.getenv('MODEL_PATH'))

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

# Global token variable
token = "token"


# Preflight response in order to avoid CORS blocking
@app.before_request
def handle_options_requests():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight Request'})
        response.status_code = 200
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        return response


# Method used for making the response with the proper headers
def make_response(json_message, status_code):
    response = jsonify(json_message)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.status_code = status_code
    return response


# Method used for decoding the token
def decode_token(encoded_token):
    if not encoded_token:
        return None, make_response({'error': 'Token not found'}, 401)
    try:
        decoded_token = jwt.decode(encoded_token, app.config['SECRET_KEY'], algorithms=[os.getenv('DECODIFICATION_ALGORITHM')])
        return decoded_token, None
    except jwt.ExpiredSignatureError:
        return None, make_response({'error': 'Token expired'}, 401)
    except jwt.InvalidTokenError:
        return None, make_response({'error': 'Invalid token'}, 401)


# Endpoint used for obtaining the token
@app.route('/obtainToken', methods=['GET'])
def obtain_token():
    global token
    return make_response({'token': token}, 200)


# Endpoint used for obtaining the user data
@app.route('/obtainData', methods=['GET'])
def obtain_user_data():
    encoded_token = request.headers.get('Authorization')
    decoded_token, error_response = decode_token(encoded_token)
    if error_response:
        return error_response

    dni = decoded_token.get('dni')
    patient_data = get_patient(dni)
    if not patient_data:
        return make_response({'error': 'Usuario no encontrado'}, 404)

    return make_response({
        'dni': patient_data.dni,
        'firstName': patient_data.first_name,
        'lastName': patient_data.last_name,
        'email': patient_data.email,
        'phone': patient_data.phone_number,
        'birthDate': patient_data.date_birth,
        'nationality': patient_data.nationality,
        'province': patient_data.province,
        'locality': patient_data.locality,
        'postalCode': patient_data.postal_code,
        'address': patient_data.address,
        'gender': patient_data.gender,
        'imagePatient': patient_data.image_patient
    }, 200)


# Endpoint used for logging in
@app.route('/login', methods=['POST'])
def login():
    global token
    data = request.json
    dni = data.get('dni')
    password = data.get('password')

    if not dni or not password:
        return make_response({'error': 'Data missing'}, 400)

    user = get_patient(dni)
    if not user:
        return make_response({'error': 'No user registered with that DNI'}, 401)

    user_password = bytes(get_password(dni))
    if bcrypt.checkpw(password.encode('utf-8'), user_password):
        token = jwt.encode({'dni': dni}, app.config['SECRET_KEY'])
        return make_response({'message': 'Successful login', 'token': token}, 200)
    else:
        return make_response({'error': 'Incorrect credentials'}, 401)

      
# Endpoint used for registering a new user
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    required_fields = [
        'firstName', 'lastName', 'password', 'repPassword', 'address',
        'email', 'dni', 'phone', 'birthDate', 'nationality', 'province',
        'locality', 'postalCode', 'gender'
    ]
    for field in required_fields:
        if not data.get(field):
            return make_response({'error': 'Data missing'}, 400)

    if data['password'] != data['repPassword']:
        return make_response({'error': 'Passwords don\'t match'}, 400)

    if get_patient(data['dni']):
        return make_response({'error': 'User already exists'}, 409)

    encoded_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    insert_patient(
        data['dni'], data['firstName'], data['lastName'], encoded_password,
        data['email'], data['phone'], data['birthDate'], data['nationality'],
        data['province'], data['locality'], data['postalCode'], data['address'],
        data['gender']
    )
    return make_response({'message': 'Register completed successfully'}, 200)


# Endpoint used for sending a contact message
@app.route('/contact', methods=['POST'])
def contact():
    data = request.json
    required_fields = ['name', 'email', 'subject', 'userMessage']
    for field in required_fields:
        if not data.get(field):
            return make_response({'error': 'Data missing'}, 400)

    # Save contact data to the database
    # TODO: Implement database saving logic
    return make_response({'message': 'Contact message sent successfully'}, 200)


# Endpoint used for modifying the user account
@app.route('/account', methods=['POST'])
def account():
    data = request.json
    required_fields = [
        'firstName', 'lastName', 'address', 'email', 'dni', 'phone',
        'birthDate', 'nationality', 'province', 'locality', 'postalCode',
        'gender', 'currentPassword'
    ]
    for field in required_fields:
        if not data.get(field):
            return make_response({'error': 'Data missing'}, 400)

    user = get_patient(data['dni'])
    if not user or not bcrypt.checkpw(data['currentPassword'].encode('utf-8'), bytes(get_password(data['dni']))):
        return make_response({'error': 'Actual password isn\'t correct'}, 400)

    modify_patient(
        data['dni'], data['firstName'], data['lastName'], data['email'],
        data['phone'], data['birthDate'], data['nationality'], data['province'],
        data['locality'], data['postalCode'], data['address'], data['gender']
    )
    return make_response({'message': 'Data modified successfully'}, 200)


# Endpoint used for uploading an image
@app.route('/upload_image', methods=['POST'])
@app.route('/upload_xray_photo', methods=['POST'])
def image_upload():
    if 'file' not in request.files or not request.files['file'].filename:
        return make_response({'error': 'File not found'}, 400)

    file = request.files['file']
    upload_result = cloudinary.uploader.upload(file)
    image_url = upload_result.get('url')

    encoded_token = request.headers.get('Authorization')
    decoded_token, error_response = decode_token(encoded_token)
    if error_response:
        return error_response

    dni = decoded_token.get('dni')
    if not get_patient(dni):
        return make_response({'error': 'User not found'}, 404)

    if request.path == '/upload_image':
        modify_image_patient(dni, image_url)
    return make_response({'image_url': image_url}, 200)


# Endpoint used for changing the password
@app.route('/change_password', methods=['POST'])
def change_password():
    data = request.json
    required_fields = ['currentPassword', 'newPassword', 'repNewPassword']
    for field in required_fields:
        if not data.get(field):
            return make_response({'error': 'Data missing'}, 400)

    if data['newPassword'] != data['repNewPassword']:
        return make_response({'error': 'Passwords don\'t match'}, 400)

    encoded_token = request.headers.get('Authorization')
    decoded_token, error_response = decode_token(encoded_token)
    if error_response:
        return error_response

    dni = decoded_token.get('dni')
    if not get_patient(dni) or not bcrypt.checkpw(data['currentPassword'].encode('utf-8'), bytes(get_password(dni))):
        return make_response({'error': 'Actual password entered isn\'t correct'}, 400)

    encoded_password = bcrypt.hashpw(data['newPassword'].encode('utf-8'), bcrypt.gensalt())
    modify_password(dni, encoded_password)
    return make_response({'message': 'Password updated successfully'}, 200)


# Endpoint used for deleting the user's account
@app.route('/deleteAccount', methods=['POST'])
def delete_account():
    data = request.json
    if not data.get('currentPassword'):
        return make_response({'error': 'Data missing'}, 400)

    encoded_token = request.headers.get('Authorization')
    decoded_token, error_response = decode_token(encoded_token)
    if error_response:
        return error_response

    dni = decoded_token.get('dni')
    if not get_patient(dni) or not bcrypt.checkpw(data['currentPassword'].encode('utf-8'), bytes(get_password(dni))):
        return make_response({'error': 'Actual password entered isn\'t correct'}, 400)

    delete_patient(dni)
    return make_response({'message': 'Account deleted successfully'}, 200)


# Endpoint used for obtaining the diagnostic for the uploaded image
@app.route('/xray_diagnosis', methods=['POST'])
def xray_diagnosis():
    if 'image_url' not in request.form:
        return make_response({'error': 'No image_url provided'}, 400)

    image_url = request.form['image_url']
    image = load_image(image_url)
    processed_image = preprocess_image(image)

    classes = model.predict(processed_image)
    pneumonia_percentage = classes[0][0] * 100
    normal_percentage = classes[0][1] * 100

    encoded_token = request.headers.get('Authorization')
    decoded_token, error_response = decode_token(encoded_token)
    if error_response:
        return error_response

    dni = decoded_token.get('dni')
    patient = get_patient(dni)
    if not patient:
        return make_response({'error': 'User not found'}, 404)

    patient_name = patient[0]
    diagnosis_date = datetime.today()

    if pneumonia_percentage > normal_percentage:
        diag = f"PNEUMONIA: {pneumonia_percentage:.2f}%"
        pdf_buffer = create_diagnosis_pdf(patient_name, diagnosis_date, "pneumonia", pneumonia_percentage)
    else:
        diag = f"NORMAL: {normal_percentage:.2f}%"
        pdf_buffer = create_diagnosis_pdf(patient_name, diagnosis_date, "normal", normal_percentage)

    des = f"PNEUMONIA: {pneumonia_percentage:.2f}%, NORMAL: {normal_percentage:.2f}%"
    # code_diag = insert_diagnostic(diag, des, image_url, dni)

    file_name = f"{dni}-{diagnosis_date}-{patient}.pdf"
    return send_file(pdf_buffer, as_attachment=True, download_name=file_name, mimetype='application/pdf')


if __name__ == '__main__':
    app.run(debug=False)