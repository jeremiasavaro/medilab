from flask import Flask, request, jsonify
from flask_cors import CORS
from db.functions_db import get_patient, insert_patient, get_password

app = Flask(__name__)
CORS(app)

@app.route('/login', methods = ['POST'])
def login():
    data = request.json
    dni = data.get('dni')
    password = data.get('password')

    print(f'Recibido: dni = {dni}, password = {password}')

    if not dni or not password:
        return jsonify({'error': 'Faltan datos'}), 400
    user = get_patient(dni)
    if user is None:
        return jsonify({'error': 'No hay un usuario registrado con ese DNI'}), 401
    if password != get_password(dni):
        return jsonify({'error': 'Credenciales incorrectas'}), 401
    else:
        return jsonify({'message': 'Login exitoso'}), 200


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    password = data.get('password')
    repPassword = data.get('repPassword')
    address = data.get('address')
    email = data.get('email')
    dni = data.get('dni')
    phone = data.get('phone')
    birthDate = data.get('birthDate')
    nationality = data.get('nationality')
    province = data.get('province')
    locality = data.get('locality')
    postalCode = data.get('postalCode')
    gender = data.get('gender')

    print(f'Recibido: firstName = {firstName}, lastName = {lastName}, password = {password}, repPassword = {repPassword}, '
          f'address = {address}, email = {email}, dni = {dni}, phone = {phone}, birthDate = {birthDate}, nationality = {nationality}, '
          f'province = {province}, locality = {locality}, postalCode = {postalCode}, gender = {gender}')

    if password != repPassword:
        return jsonify({'error': 'Las contraseñas no son iguales'}), 400
    if (not firstName or not lastName or not password or not repPassword or not address or not email or not dni or not phone
        or not birthDate or not nationality or not province or not locality or not postalCode or not gender):
        return jsonify({'error': 'Faltan datos'}), 400
    user = get_patient(dni)
    if user:
        return jsonify({'error': 'El usuario ya existe'}), 409
    else:
        insert_patient(dni, firstName, lastName, password, email, phone, birthDate, nationality, province,
                       locality, postalCode, address, gender)
        return jsonify({'message': 'Registro completado correctamente'}), 200


@app.route('/contact', methods = ['POST'])
def contact():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('userMessage')

    print(f'Recibido: name = {name}, email = {email}, subject = {subject}, message = {message}')
    # we should save this data in the database and think what are we going to do with it after


if __name__ == '__main__':
    app.run(debug=False)