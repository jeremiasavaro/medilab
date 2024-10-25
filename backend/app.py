#app.py
from flask import Flask, request, current_app, jsonify, send_file
from flask_cors import CORS
from io import BytesIO
import bcrypt
import jwt
import tensorflow as tf
import os
from utils import handle_options_requests, make_response, decode_token, token
from auth.__init__ import auth
from dotenv import load_dotenv
from datetime import datetime
from tensorflow.keras.models import load_model
from db.database import db, migrate
from db.functions_db import *
from db.models import *
from config.config import *
from functions import load_image, preprocess_image, create_diagnosis_pdf
from factory.__init__ import create_app

tf.get_logger().setLevel('ERROR')

#Create the app
app = create_app()

#Import the AI model
with app.app_context():
    # Save the model used to predict
    model = current_app.model


handle_options_requests(app)

# each blueprint is registered
app.register_blueprint(auth, url_prefix="/auth")


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

    patient_name = patient.first_name
  
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