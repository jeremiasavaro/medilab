from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import cloudinary
import cloudinary.uploader
from db.functions_db import get_patient, insert_patient, get_password, modify_patient, modify_password

app = Flask(__name__)
CORS(app)

#configuracion de cloudinary para guardar imagenes de los pacientes
cloudinary.config(
    cloud_name = "djlg5dfjj",
    api_key = "945298983164966",
    api_secret = "CRjZQ4M5w6Dp-eYdBzjZZQISgKI"
)


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
    userPassword = bytes(get_password(dni))
    if bcrypt.checkpw(password.encode('utf-8'), userPassword):
        return jsonify({'message': 'Login exitoso'}), 200
    else:
        return jsonify({'error': 'Credenciales incorrectas'}), 401


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    nonEncryptedPassword = data.get('password')
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

    print(f'Recibido: firstName = {firstName}, lastName = {lastName}, password = {nonEncryptedPassword}, repPassword = {repPassword}, '
          f'address = {address}, email = {email}, dni = {dni}, phone = {phone}, birthDate = {birthDate}, nationality = {nationality}, '
          f'province = {province}, locality = {locality}, postalCode = {postalCode}, gender = {gender}')

    if nonEncryptedPassword != repPassword:
        return jsonify({'error': 'Las contraseñas no son iguales'}), 400
    if (not firstName or not lastName or not nonEncryptedPassword or not repPassword or not address or not email or not dni or not phone
        or not birthDate or not nationality or not province or not locality or not postalCode or not gender):
        return jsonify({'error': 'Faltan datos'}), 400
    user = get_patient(dni)
    if user:
        return jsonify({'error': 'El usuario ya existe'}), 409
    else:
        encodedPassword = nonEncryptedPassword.encode('utf-8')
        passwordSalt = bcrypt.gensalt()
        encryptedPassword = bcrypt.hashpw(encodedPassword, passwordSalt)
        insert_patient(dni, firstName, lastName, encryptedPassword, email, phone, birthDate, nationality, province,
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


@app.route('/account', methods = ['POST'])
def account():
    data = request.json
    newFirstName = data.get('firstName')
    newLastName = data.get('lastName')
    newAddress = data.get('address')
    newEmail = data.get('email')
    newDni = data.get('dni')
    newPhone = data.get('phone')
    newBirthDate = data.get('birthDate')
    newAge = data.get('age')
    newNationality = data.get('nationality')
    newProvince = data.get('province')
    newLocality = data.get('locality')
    newPostalCode = data.get('postalCode')
    newGender = data.get('gender')


    print(f'Recibido: firstname = {newFirstName}, lastname = {newLastName}, '
          f' address = {newAddress}, email = {newEmail}, phone = {newPhone}, birthDate = {newBirthDate}, '
          f' nationality = {newNationality},province = {newProvince}, locality = {newLocality}, postalCode = {newPostalCode}, gender = {newGender}')

    if (not newFirstName or not newLastName or not newAddress or not newEmail or not newDni or not newPhone or not newBirthDate
        or not newNationality or not newProvince or not newLocality or not newPostalCode or not newGender):
        return jsonify({'error': 'Faltan datos'}), 400

    user = get_patient(newDni)

    if user:
        modify_patient(newDni, newFirstName, newLastName, newEmail, newPhone, newBirthDate, newAge,
                       newNationality, newProvince, newLocality, newPostalCode, newAddress, newGender)
        return jsonify({'message': 'Datos modificados correctamente'}), 200
    

#ruta para la carga de imagenes
@app.route('/upload_image', methods = ['POST'])
def image_upload():
    # Verifica que se haya recibido un archivo
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Sube la imagen a Cloudinary
    upload_result = cloudinary.uploader.upload(file)
    image_url = upload_result.get('url')

    return jsonify({'image_url': image_url}), 200


@app.route('/change_password', methods = ['POST'])
def change_password():
    data = request.json
    dni = 45  # Supongo que deberías recibir el DNI en el JSON de la petición
    currentPassword = data.get('currentPassword')
    newPassword = data.get('newPassword')
    newRepPassword = data.get('repNewPassword')

    print(f'dni = {dni}, currentPassword = {currentPassword}, newPassword = {newPassword}, newRepPassword = {newRepPassword}')

    if not dni or not currentPassword or not newPassword or not newRepPassword:
        return jsonify({'error': 'Faltan datos'}), 400
    if newPassword != newRepPassword:
        return jsonify({'error': 'Las contraseñas no son iguales'}), 400

    user = get_patient(dni)
    
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    password = bytes(get_password(dni)) 
    currentPasswordEncoded = currentPassword.encode('utf-8')

    if not bcrypt.checkpw(currentPasswordEncoded, password):
        return jsonify({'error': 'La contraseña actual ingresada no es correcta'}), 400

    passwordSalt = bcrypt.gensalt()
    encodedPassword = bcrypt.hashpw(newPassword.encode('utf-8'), passwordSalt)
    modify_password(dni, encodedPassword)

    return jsonify({'message': 'Contraseña actualizada con éxito'}), 200


if __name__ == '__main__':
    app.run(debug=False)