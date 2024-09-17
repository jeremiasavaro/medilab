from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import cloudinary
import cloudinary.uploader
import jwt
from db.functions_db import get_patient, insert_patient, get_password, modify_patient, modify_password, modify_image_patient, delete_patient, insert_diagnostic
# from pdfFunctions import *

app = Flask(__name__)
app.config['SECRET_KEY'] = 'xrai'

CORS(app)

#configuracion de cloudinary para guardar imagenes de los pacientes
cloudinary.config(
    cloud_name = "djlg5dfjj",
    api_key = "945298983164966",
    api_secret = "CRjZQ4M5w6Dp-eYdBzjZZQISgKI"
)

token = "token"

@app.route('/obtainToken', methods=['GET'])
def obtain_token():
    global token
    return jsonify({'token': token})


@app.route('/obtainData', methods=['GET'])
def obtain_user_data():
    token = request.headers.get('Authorization')
    
    if not token:
        return jsonify({'error': 'No se encontro el token'}), 401

    try:
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        dni = decoded_token.get('dni')

        patient_data = get_patient(dni)
        
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
            'gender' : patient_data[13],
            'imagePatient' : patient_data[14]
        }), 200
        
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'El token ya expiro'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Token invalido'}), 401


@app.route('/login', methods=['POST'])
def login():
    global token
    data = request.json
    dni = data.get('dni')
    password = data.get('password')

    print(f'Recibido: dni = {dni}, password = {password}')

    if not dni or not password:
        return jsonify({'error': 'Faltan datos'}), 400
    user = get_patient(dni)
    if user is None:
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
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    non_encrypted_password = data.get('password')
    rep_password = data.get('repPassword')
    address = data.get('address')
    email = data.get('email')
    dni = data.get('dni')
    phone = data.get('phone')
    birth_date = data.get('birthDate')
    nationality = data.get('nationality')
    province = data.get('province')
    locality = data.get('locality')
    postal_code = data.get('postalCode')
    gender = data.get('gender')

    print(f'Recibido: firstName = {first_name}, lastName = {last_name}, password = {non_encrypted_password}, repPassword = {rep_password}, '
          f'address = {address}, email = {email}, dni = {dni}, phone = {phone}, birthDate = {birth_date}, nationality = {nationality}, '
          f'province = {province}, locality = {locality}, postalCode = {postal_code}, gender = {gender}')

    if non_encrypted_password != rep_password:
        return jsonify({'error': 'Las contraseñas no son iguales'}), 400
    if (not first_name or not last_name or not non_encrypted_password or not rep_password or not address or not email or not dni or not phone
        or not birth_date or not nationality or not province or not locality or not postal_code or not gender):
        return jsonify({'error': 'Faltan datos'}), 400
    user = get_patient(dni)
    if user:
        return jsonify({'error': 'El usuario ya existe'}), 409
    else:
        encoded_password = non_encrypted_password.encode('utf-8')
        password_salt = bcrypt.gensalt()
        encrypted_password = bcrypt.hashpw(encoded_password, password_salt)
        insert_patient(dni, first_name, last_name, encrypted_password, email, phone, birth_date, nationality, province,
                       locality, postal_code, address, gender)
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
    new_first_name = data.get('firstName')
    new_last_name = data.get('lastName')
    new_address = data.get('address')
    new_email = data.get('email')
    new_dni = data.get('dni')
    new_phone = data.get('phone')
    new_birth_date = data.get('birthDate')
    new_nationality = data.get('nationality')
    new_province = data.get('province')
    new_locality = data.get('locality')
    new_postal_code = data.get('postalCode')
    new_gender = data.get('gender')
    current_password = data.get('currentPassword')

    user = get_patient(new_dni)
    pswd = get_password(new_dni)
    user_password = bytes(pswd)
    if not bcrypt.checkpw(current_password.encode('utf-8'), user_password):
        return jsonify({'message': 'La contraseña actual no es correcta, por lo tanto los datos no fueron modificados'}), 200


    print(f'Recibido: firstname = {new_first_name}, lastname = {new_last_name}, '
          f' address = {new_address}, email = {new_email}, phone = {new_phone}, birthDate = {new_birth_date}, '
          f' nationality = {new_nationality}, province = {new_province}, locality = {new_locality}, postalCode = {new_postal_code}, gender = {new_gender}')

    if (not new_first_name or not new_last_name or not new_address or not new_email or not new_dni or not new_phone or not new_birth_date
        or not new_nationality or not new_province or not new_locality or not new_postal_code or not new_gender):
        return jsonify({'error': 'Faltan datos'}), 400

    if user:
        modify_patient(new_dni, new_first_name, new_last_name, new_email, new_phone, new_birth_date,
                       new_nationality, new_province, new_locality, new_postal_code, new_address, new_gender)
        return jsonify({'message': 'Datos modificados correctamente'}), 200
    

@app.route('/upload_image', methods = ['POST'])
def image_upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No se encontró un archivo'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No es un archivo'}), 400

    #sube la imagen a Cloudinary
    upload_result = cloudinary.uploader.upload(file)
    image_url = upload_result.get('url')

    #obtengo el dni del paciente
    decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    dni = decoded_token.get('dni')

    #guarda la url de la imagen en la base de datos

    user = get_patient(dni)

    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    modify_image_patient(dni, image_url)

    return jsonify({'image_url': image_url}), 200


@app.route('/change_password', methods = ['POST'])
def change_password():
    data = request.json

    # obtengo el dni del paciente
    decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    dni = decoded_token.get('dni')

    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')
    new_rep_password = data.get('repNewPassword')

    print(f'dni = {dni}, current_password = {current_password}, new_password = {new_password}, new_rep_password = {new_rep_password}')

    if not dni or not current_password or not new_password or not new_rep_password:
        return jsonify({'error': 'Faltan datos'}), 400
    if new_password != new_rep_password:
        return jsonify({'error': 'Las contraseñas no son iguales'}), 400

    user = get_patient(dni)
    
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    password = bytes(get_password(dni)) 
    current_password_encoded = current_password.encode('utf-8')

    if not bcrypt.checkpw(current_password_encoded, password):
        return jsonify({'error': 'La contraseña actual ingresada no es correcta'}), 400

    password_salt = bcrypt.gensalt()
    encoded_password = bcrypt.hashpw(new_password.encode('utf-8'), password_salt)
    modify_password(dni, encoded_password)

    return jsonify({'message': 'Contraseña actualizada con éxito'}), 200

@app.route('/deleteAccount', methods = ['POST'])
def delete_account():
    data = request.json

    # obtengo el dni del paciente
    decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    dni = decoded_token.get('dni')

    current_password = data.get('currentPassword')
    print(f'dni = {dni}, current_password = {current_password}')

    if not dni or not current_password:
        return jsonify({'error': 'Faltan datos'}), 400
    
    password = bytes(get_password(dni)) 
    current_password_encoded = current_password.encode('utf-8')

    if not bcrypt.checkpw(current_password_encoded, password):
        return jsonify({'error': 'La contraseña actual ingresada no es correcta'}), 400

    delete_patient(dni)
    return jsonify({'message': 'Cuenta eliminada con exito'}), 200

@app.route('/upload_xray_photo', methods = ['POST'])
def upload_xray_photo():
    if 'file' not in request.files:
        return jsonify({'error': 'No se encontró un archivo'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No es un archivo'}), 400

    #sube la imagen a Cloudinary
    upload_result = cloudinary.uploader.upload(file)
    image_url = upload_result.get('url')

    #obtengo el dni del paciente
    decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    dni = decoded_token.get('dni')

    #compruebo que este logeado

    user = get_patient(dni)

    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    return jsonify({'image_url': image_url}), 200

@app.route('/xray_diagnosis', methods = ['POST'])
def xray_diagnosis():
    if 'image_url' not in request.form:
        return jsonify({'error': 'No image_url provided'}), 400

    image_url = request.form['image_url']

    #añadir codigo para recuperar URL de la foto (maxi)

    #todo esto se comenta, para su posterior implementación, luego de tener el modelo definido
    #classes = model.predict(x)
    #result = classes[0]
    #pneumonia_percentage = result[0] * 100
    #normal_percentage = result[1] * 100
    #if pneumonia_percentage > normal_percentage:
    #   diag = "PNEUMONIA" + pneumonia_percentage
    #else:
    #   diag = "NORMAL" + normal_percentage
    #des = {pneumonia_percentage:.2f}% PNEUMONIA, {normal_percentage:.2f}% NORMAL"
    #cod = ???


    #<CODIGO PARA GENERAR PDF USANDO OLLAMA>

    #if not imagen:
    #   return jsonify({"error": "Por favor, carga una imagen."}), 400

    #imagen_pil = Image.open(image_url)
    #description_imagen = generar_descripcion_imagen(imagen_pil)
    #response = generar_respuesta_con_ollama(description_imagen, diag)

    #buffer = io.BytesIO()
    #pdf = canvas.Canvas(buffer)
    #text = pdf.beginText(100, 750)
    #text.setFont("Helvetica", 12)
    #text.textLines(f"DIAGNOSTICO MEDICO:\n\n{response}")
    #pdf.drawText(text)
    #pdf.showPage()
    #pdf.save()

    #buffer.seek(0)

    ##Ver como hacer que el nombre del archivo contenga: dni-fecha-codigoDiag.pdf

    ##Guardamos en la base de datos
    ##Faltaría que la funcion en la base de datos guarde el path del pdf generado
    #insert_diagnostic(cod, diag, des, image_url, dni)

    #return send_file(buffer, as_attachment=True, download_name='nombre.pdf', mimetype='application/pdf')
    return True
if __name__ == '__main__':
    app.run(debug=False)