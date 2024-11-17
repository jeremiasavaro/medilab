from flask import jsonify, request
from utils import *
from db.models import *
from .__init__ import inquiries
from db.functions_db import get_diagnostics

# Endpoint used for sending a contact message
@inquiries.route('/contact', methods=['POST'])
def contact():
    data = request.json
    required_fields = ['firstName', 'lastName', 'email', 'subject', 'userMessage']
    for field in required_fields:
        if not data.get(field):
            return make_response({'error': 'Data missing'}, 400)

    # Save contact data to the database
    # TODO: Implement database saving logic
    return make_response({'message': 'Contact message sent successfully'}, 200)

# Endpoint used for obtaining the doctors table
@inquiries.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.all()  
    doctors_list = [{
        'dni': doctor.dni,
        'first_name': doctor.first_name,
        'last_name': doctor.last_name,
        'speciality': doctor.speciality,
        'email': doctor.email
    } for doctor in doctors]
    
    return jsonify(doctors_list)

# Endpoint used for obtain the diagnoses of the current user
@inquiries.route('/my_diagnoses', methods=['GET'])
def get_diagnoses():
    encoded_token = request.headers.get('Authorization')
    decoded_token, error_response = decode_token(encoded_token)
    if error_response:
        return error_response
    dni = decoded_token.get('dni')
    diagnoses = get_diagnostics(dni)
    diagnoses_list = [{
        'image_diagnostic': diagnostic.image_diagnostic,
        'date_result': diagnostic.date_result,
        'dni': diagnostic.dni
    } for diagnostic in diagnoses]
    
    print("Diagnoses List:", diagnoses_list)
    return jsonify(diagnoses_list)