from flask import request
import bcrypt
from .__init__ import *
from utils import *
from datetime import datetime
from db.functions_db import get_patient, modify_patient, get_password, modify_password, delete_patient

# Endpoint used for obtaining the user data
@user.route('/obtainData', methods=['GET'])
def obtain_user_data():
    encoded_token = request.headers.get('Authorization')
    decoded_token, error_response = decode_token(encoded_token)
    if error_response:
        return error_response

    dni = decoded_token.get('dni')
    patient_data = get_patient(dni)
    if not patient_data:
        return make_response({'error': 'Usuario no encontrado'}, 404)

    print(patient_data.date_birth)

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

# Endpoint used for modifying the user account
@user.route('/account', methods=['POST'])
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

    patient_data = {
        'dni': data['dni'],
        'firstName': data['firstName'],
        'lastName': data['lastName'],
        'email': data['email'],
        'phone': data['phone'],
        'birthDate': data['birthDate'],
        'nationality': data['nationality'],
        'province': data['province'],
        'locality': data['locality'],
        'postalCode': data['postalCode'],
        'address': data['address'],
        'gender': data['gender']
    }


    modify_patient(patient_data)
    return make_response({'message': 'Data modified successfully'}, 200)

# Endpoint used for changing the password
@user.route('/change_password', methods=['POST'])
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
@user.route('/deleteAccount', methods=['POST'])
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

    delete_patient(dni=dni)
    return make_response({'message': 'Account deleted successfully'}, 200)