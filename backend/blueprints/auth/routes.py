#medilab\backend\blueprints\auth\routes.py
from flask import request, current_app
import jwt
import bcrypt
from .__init__ import *
from db.functions_db import get_patient, get_password, insert_patient
from utils import make_response, token

# Endpoint used for obtaining the token
@auth.route('/obtainToken', methods=['GET'])
def obtain_token():
    global token
    return make_response({'token': token}, 200)

# Endpoint used for logging in
@auth.route('/login', methods=['POST'])
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
        token = jwt.encode({'dni': dni}, current_app.config['SECRET_KEY'])
        return make_response({'message': 'Successful login', 'token': token}, 200)
    else:
        return make_response({'error': 'Incorrect credentials'}, 401)


# Endpoint used for registering a new user
@auth.route('/register', methods=['POST'])
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
    patient_data = {
        'dni': data['dni'],
        'firstName': data['firstName'],
        'lastName': data['lastName'],
        'password': encoded_password,
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

    insert_patient(patient_data)
    
    return make_response({'message': 'Register completed successfully'}, 200)