#app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from io import BytesIO
import tensorflow as tf
from utils import handle_options_requests, make_response, decode_token
from datetime import datetime
from db.functions_db import *
from db.models import *
from config.config import *
from factory.__init__ import create_app

#Create the app
app = create_app()

#???
handle_options_requests(app)


# Endpoint used for sending a contact message
@app.route('/contact', methods=['POST'])
def contact():
    data = request.json
    required_fields = ['firstName', 'lastName', 'email', 'subject', 'userMessage']
    for field in required_fields:
        if not data.get(field):
            return make_response({'error': 'Data missing'}, 400)

    # Save contact data to the database
    # TODO: Implement database saving logic
    return make_response({'message': 'Contact message sent successfully'}, 200)

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


# Endpoint used for obtaining the doctors table
@app.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.all()  #Traemos todos los doctores de la tabla correspondiente
    doctors_list = [{
        'image_doctor': doctor.image_doctor,
        'dni': doctor.dni,
        'first_name': doctor.first_name,
        'last_name': doctor.last_name,
        'speciality': doctor.speciality,
        'email': doctor.email
    } for doctor in doctors]
    
    return jsonify(doctors_list)

if __name__ == '__main__':
    app.run(debug=False)