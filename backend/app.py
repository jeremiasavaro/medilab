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
from db.functions_db import (
    get_patient, insert_patient, get_password, modify_patient,
    modify_password, modify_image_patient, delete_patient,
    insert_diagnostic, get_doctors_by_speciality
)
from functions import load_image, preprocess_image, create_diagnosis_pdf

tf.get_logger().setLevel('ERROR')

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Load AI model
model = load_model(os.getenv('MODEL_PATH'))

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

# Global token variable
token = "token"

def decode_token(request):
    token = request.headers.get('Authorization')
    if not token:
        return None, jsonify({'error': 'No se encontro el token'}), 401
    try:
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=[os.getenv('DECODIFICATION_ALGORITHM')])
        return decoded_token, None, None
    except jwt.ExpiredSignatureError:
        return None, jsonify({'error': 'El token ya expiro'}), 401
    except jwt.InvalidTokenError:
        return None, jsonify({'error': 'Token invalido'}), 401

@app.route('/obtainToken', methods=['GET'])
def obtain_token():
    global token
    return jsonify({'token': token})

@app.route('/obtainData', methods=['GET'])
def obtain_user_data():
    decoded_token, error_response, status_code = decode_token(request)
    if error_response:
        return error_response, status_code

    dni = decoded_token.get('dni')
    patient_data = get_patient(dni)
    if not patient_data:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    return jsonify({
        'dni': patient_data[0],
        'firstName': patient_data[1],
        'lastName': patient_data[2],
        'email': patient_data[4],
        'phone': patient_data[5],
        'birthDate': patient_data[6],
        'nationality': patient_data[8],
        'province': patient_data[9],
        'locality': patient_data[10],
        'postalCode': patient_data[11],
        'address': patient_data[12],
        'gender': patient_data[13],
        'imagePatient': patient_data[14]
    }), 200

@app.route('/login', methods=['POST'])
def login():
    global token
    data = request.json
    dni = data.get('dni')
    password = data.get('password')

    if not dni or not password:
        return jsonify({'error': 'Faltan datos'}), 400

    user = get_patient(dni)
    if not user:
        return jsonify({'error': 'No hay un usuario registrado con ese DNI'}), 401

    user_password = bytes(get_password(dni))
    if bcrypt.checkpw(password.encode('utf-8'), user_password):
        token = jwt.encode({'dni': dni}, app.config['SECRET_KEY'])
        return jsonify({'message': 'Login exitoso', 'token': token}), 200
    else:
        return jsonify({'error': 'Credenciales incorrectas'}), 401

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
            return jsonify({'error': 'Faltan datos'}), 400

    if data['password'] != data['repPassword']:
        return jsonify({'error': 'Las contraseñas no son iguales'}), 400

    if get_patient(data['dni']):
        return jsonify({'error': 'El usuario ya existe'}), 409

    encoded_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    insert_patient(
        data['dni'], data['firstName'], data['lastName'], encoded_password,
        data['email'], data['phone'], data['birthDate'], data['nationality'],
        data['province'], data['locality'], data['postalCode'], data['address'],
        data['gender']
    )
    return jsonify({'message': 'Registro completado correctamente'}), 200

@app.route('/contact', methods=['POST'])
def contact():
    data = request.json
    required_fields = ['name', 'email', 'subject', 'userMessage']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': 'Faltan datos'}), 400

    # Save contact data to the database
    # TODO: Implement database saving logic
    return jsonify({'message': 'Contacto recibido correctamente'}), 200

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
            return jsonify({'error': 'Faltan datos'}), 400

    user = get_patient(data['dni'])
    if not user or not bcrypt.checkpw(data['currentPassword'].encode('utf-8'), bytes(get_password(data['dni']))):
        return jsonify({'error': 'La contraseña actual no es correcta'}), 400

    modify_patient(
        data['dni'], data['firstName'], data['lastName'], data['email'],
        data['phone'], data['birthDate'], data['nationality'], data['province'],
        data['locality'], data['postalCode'], data['address'], data['gender']
    )
    return jsonify({'message': 'Datos modificados correctamente'}), 200

@app.route('/upload_image', methods=['POST'])
@app.route('/upload_xray_photo', methods=['POST'])
def image_upload():
    if 'file' not in request.files or not request.files['file'].filename:
        return jsonify({'error': 'No se encontró un archivo'}), 400

    file = request.files['file']
    upload_result = cloudinary.uploader.upload(file)
    image_url = upload_result.get('url')

    decoded_token, error_response, status_code = decode_token(request)
    if error_response:
        return error_response, status_code

    dni = decoded_token.get('dni')
    if not get_patient(dni):
        return jsonify({'error': 'Usuario no encontrado'}), 404

    if request.path == '/upload_image':
        modify_image_patient(dni, image_url)
    return jsonify({'image_url': image_url}), 200

@app.route('/change_password', methods=['POST'])
def change_password():
    data = request.json
    required_fields = ['currentPassword', 'newPassword', 'repNewPassword']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': 'Faltan datos'}), 400

    if data['newPassword'] != data['repNewPassword']:
        return jsonify({'error': 'Las contraseñas no son iguales'}), 400

    decoded_token, error_response, status_code = decode_token(request)
    if error_response:
        return error_response, status_code

    dni = decoded_token.get('dni')
    if not get_patient(dni) or not bcrypt.checkpw(data['currentPassword'].encode('utf-8'), bytes(get_password(dni))):
        return jsonify({'error': 'La contraseña actual ingresada no es correcta'}), 400

    encoded_password = bcrypt.hashpw(data['newPassword'].encode('utf-8'), bcrypt.gensalt())
    modify_password(dni, encoded_password)
    return jsonify({'message': 'Contraseña actualizada con éxito'}), 200

@app.route('/deleteAccount', methods=['POST'])
def delete_account():
    data = request.json
    if not data.get('currentPassword'):
        return jsonify({'error': 'Faltan datos'}), 400

    decoded_token, error_response, status_code = decode_token(request)
    if error_response:
        return error_response, status_code

    dni = decoded_token.get('dni')
    if not get_patient(dni) or not bcrypt.checkpw(data['currentPassword'].encode('utf-8'), bytes(get_password(dni))):
        return jsonify({'error': 'La contraseña actual ingresada no es correcta'}), 400

    delete_patient(dni)
    return jsonify({'message': 'Cuenta eliminada con exito'}), 200

@app.route('/xray_diagnosis', methods=['POST'])
def xray_diagnosis():
    if 'image_url' not in request.form:
        return jsonify({'error': 'No image_url provided'}), 400

    image_url = request.form['image_url']
    image = load_image(image_url)
    processed_image = preprocess_image(image)

    classes = model.predict(processed_image)
    pneumonia_percentage = classes[0][0] * 100
    normal_percentage = classes[0][1] * 100

    decoded_token, error_response, status_code = decode_token(request)
    if error_response:
        return error_response, status_code

    dni = decoded_token.get('dni')
    patient = get_patient(dni)
    if not patient:
        return jsonify({'error': 'Usuario no encontrado'}), 404

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