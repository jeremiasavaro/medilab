from flask import jsonify, request
from utils import *
from db.models import *
from .__init__ import inquiries

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
    diagnoses = Diagnostic.query.all()  
    diagnoses_list = [{
        'image_diagnostic': diagnostic.image_diagnostic,
        'date_result': diagnostic.date_result,
        'dni': diagnostic.dni
    } for diagnostic in diagnoses]
    
    return jsonify(diagnoses_list)