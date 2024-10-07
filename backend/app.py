from flask import Flask, request, jsonify, session
from flask_cors import CORS, cross_origin
from flask_session import Session
import bcrypt
import cloudinary
import cloudinary.uploader
import tensorflow as tf
from datetime import datetime
from tensorflow.keras.models import load_model
from db.functions_db import (
    get_patient, get_password, insert_patient, modify_patient,
    modify_image_patient, modify_password, delete_patient
)
from functions import ( load_image, preprocess_image, create_diagnosis_pdf )

tf.get_logger().setLevel('ERROR')

app = Flask(__name__)

# Configure the secret key and session type
app.config['SECRET_KEY'] = 'xrai'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = './flask_sessions/'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
Session(app)

# Load the model
model = load_model('modelo_vgg16_finetuned.h5')

# Configure CORS to allow credentials and resources from frontend
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configure Cloudinary
cloudinary.config(
    cloud_name="djlg5dfjj",
    api_key="945298983164966",
    api_secret="CRjZQ4M5w6Dp-eYdBzjZZQISgKI"
)

@app.route('/obtainData', methods=['GET'])
def obtain_user_data():
    dni = session.get('dni')  # Get user information from session
    if not dni:
        return make_response(jsonify({'error': 'No se encontró el usuario en la sesión'}), 401)

    patient_data = get_patient(dni)

    if not patient_data:
        return make_response(jsonify({'error': 'No se encontró el usuario'}), 404)

    return make_response(jsonify({
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
    }), 200)

# Preflight response in order to avoid CORS blocking
@app.before_request
def handle_options_requests():
    if request.method == 'OPTIONS':
        return make_response(jsonify({'message': 'Preflight Request'}), 200)

def make_response(json_message, status_code):
    response = json_message
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.status_code = status_code
    return response


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    dni = data.get('dni')
    password = data.get('password')

    if not dni or not password:
        return make_response(jsonify({'error': 'Faltan datos'}), 400)

    user = get_patient(dni)
    if user is None:
        return make_response(jsonify({'error': 'No hay un usuario registrado con ese DNI'}), 401)

    user_password = bytes(get_password(dni))
    if bcrypt.checkpw(password.encode('utf-8'), user_password):
        session.clear()
        session['dni'] = dni  # Establecer información del usuario en la sesión
        print(f'Session set: {session["dni"]}')  # Debug print
        return make_response(jsonify({'message': 'Login exitoso'}), 200)
    else:
        return make_response(jsonify({'error': 'Credenciales incorrectas'}), 401)


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('dni', None)  # Remove user information from session
    session.clear()
    return make_response(jsonify({'message': 'Logout exitoso'}), 200)


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
        return make_response(jsonify({'error': 'Las contraseñas no son iguales'}), 400)

    if (not first_name or not last_name or not non_encrypted_password or not rep_password or not address or not email or not dni or not phone
        or not birth_date or not nationality or not province or not locality or not postal_code or not gender):
        return make_response(jsonify({'error': 'Faltan datos'}), 400)

    user = get_patient(dni)

    if user:
        return make_response(jsonify({'error': 'El usuario ya existe'}), 409)
    else:
        encoded_password = non_encrypted_password.encode('utf-8')
        password_salt = bcrypt.gensalt()
        encrypted_password = bcrypt.hashpw(encoded_password, password_salt)
        insert_patient(dni, first_name, last_name, encrypted_password, email, phone, birth_date, nationality, province,
                       locality, postal_code, address, gender)
        return make_response(jsonify({'message': 'Registro completado correctamente'}), 200)


@app.route('/contact', methods = ['POST'])
def contact():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('userMessage')

    print(f'Recibido: name = {name}, email = {email}, subject = {subject}, message = {message}')
    # we should save this data in the database and think what are we going to do with it after
    return jsonify({'status': 'success', 'message': 'Data received successfully'}), 200

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
        return make_response(jsonify({'message': 'La contraseña actual no es correcta, por lo tanto los datos no fueron modificados'}), 200)

    print(f'Recibido: firstname = {new_first_name}, lastname = {new_last_name}, '
          f' address = {new_address}, email = {new_email}, phone = {new_phone}, birthDate = {new_birth_date}, '
          f' nationality = {new_nationality}, province = {new_province}, locality = {new_locality}, postalCode = {new_postal_code}, gender = {new_gender}')

    if (not new_first_name or not new_last_name or not new_address or not new_email or not new_dni or not new_phone or not new_birth_date
        or not new_nationality or not new_province or not new_locality or not new_postal_code or not new_gender):
        return make_response(jsonify({'error': 'Faltan datos'}), 400)

    if user:
        modify_patient(new_dni, new_first_name, new_last_name, new_email, new_phone, new_birth_date,
                       new_nationality, new_province, new_locality, new_postal_code, new_address, new_gender)
        return make_response(jsonify({'message': 'Datos modificados correctamente'}), 200)


@app.route('/upload_image', methods=['POST'])
def image_upload():
    if 'file' not in request.files:
        return make_response(jsonify({'error': 'No se encontró un archivo'}), 400)

    file = request.files['file']

    if file.filename == '':
        return make_response(jsonify({'error': 'No es un archivo'}), 400)

    # Sube la imagen a Cloudinary
    upload_result = cloudinary.uploader.upload(file)
    image_url = upload_result.get('url')

    # Obtengo el dni del paciente
    dni = session.get('dni')

    if not dni:
        return make_response(jsonify({'error': 'Usuario no encontrado en la sesión'}), 401)

    # Guarda la URL de la imagen en la base de datos
    user = get_patient(dni)

    if not user:
        return make_response(jsonify({'error': 'Usuario no encontrado'}), 404)

    modify_image_patient(dni, image_url)

    return make_response(jsonify({'image_url': image_url}), 200)


@app.route('/change_password', methods=['POST'])
def change_password():
    data = request.json

    # Obtengo el dni del paciente
    dni = session.get('dni')

    if not dni:
        return make_response(jsonify({'error': 'Usuario no encontrado en la sesión'}), 401)

    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')
    new_rep_password = data.get('repNewPassword')

    if not current_password or not new_password or not new_rep_password:
        return make_response(jsonify({'error': 'Faltan datos'}), 400)
    if new_password != new_rep_password:
        return make_response(jsonify({'error': 'Las contraseñas no son iguales'}), 400)

    user = get_patient(dni)

    if not user:
        return make_response(jsonify({'error': 'Usuario no encontrado'}), 404)

    password = bytes(get_password(dni))
    current_password_encoded = current_password.encode('utf-8')

    if not bcrypt.checkpw(current_password_encoded, password):
        return make_response(jsonify({'error': 'La contraseña actual ingresada no es correcta'}), 400)

    password_salt = bcrypt.gensalt()
    encoded_password = bcrypt.hashpw(new_password.encode('utf-8'), password_salt)
    modify_password(dni, encoded_password)

    return make_response(jsonify({'message': 'Contraseña actualizada con éxito'}), 200)


@app.route('/deleteAccount', methods=['POST'])
def delete_account():
    data = request.json

    # Obtengo el dni del paciente
    dni = session.get('dni')

    if not dni:
        return make_response(jsonify({'error': 'Usuario no encontrado en la sesión'}), 401)

    current_password = data.get('currentPassword')

    if not current_password:
        return make_response(jsonify({'error': 'Faltan datos'}), 400)

    password = bytes(get_password(dni))
    current_password_encoded = current_password.encode('utf-8')

    if not bcrypt.checkpw(current_password_encoded, password):
        return make_response(jsonify({'error': 'La contraseña actual ingresada no es correcta'}), 400)

    delete_patient(dni)
    return make_response(jsonify({'message': 'Cuenta eliminada con éxito'}), 200)


@app.route('/upload_xray_photo', methods=['POST'])
def upload_xray_photo():
    if 'file' not in request.files:
        return make_response(jsonify({'error': 'No se encontró un archivo'}), 400)

    file = request.files['file']

    if file.filename == '':
        return make_response(jsonify({'error': 'No es un archivo'}), 400)

    # Sube la imagen a Cloudinary
    upload_result = cloudinary.uploader.upload(file)
    image_url = upload_result.get('url')

    # Obtengo el dni del paciente
    dni = session.get('dni')

    if not dni:
        return make_response(jsonify({'error': 'Usuario no encontrado en la sesión'}), 401)

    # Compruebo que esté logeado
    user = get_patient(dni)

    if not user:
        return make_response(jsonify({'error': 'Usuario no encontrado'}), 404)

    return make_response(jsonify({'image_url': image_url}), 200)


@app.route('/xray_diagnosis', methods=['POST'])
def xray_diagnosis():
    if 'image_url' not in request.form:
        return make_response(jsonify({'error': 'No image_url provided'}), 400)

    # Procesamiento de imagen
    image_url = request.form['image_url']
    image = load_image(image_url)
    processed_image = preprocess_image(image)

    # Predicción de imagen
    classes = model.predict(processed_image)
    result = classes[0]
    pneumonia_percentage = result[0] * 100
    normal_percentage = result[1] * 100

    # Determinar el diagnóstico basado en probabilidades
    if pneumonia_percentage > normal_percentage:
        diag = f"PNEUMONIA: {pneumonia_percentage:.2f}%"
    else:
        diag = f"NORMAL: {normal_percentage:.2f}%"
    des = f"PNEUMONIA: {pneumonia_percentage:.2f}%, NORMAL: {normal_percentage:.2f}%"

    # Obtener datos del paciente
    dni = session.get('dni')

    if not dni:
        return make_response(jsonify({'error': 'Usuario no encontrado en la sesión'}), 401)

    patient = get_patient(dni)
    patient_name = patient[0]
    diagnosis_date = datetime.today()  # Formato de fecha adecuado para el archivo

    # Guardar el diagnóstico en la base de datos
    # code_diag = insert_diagnostic(diag, des, image_url, dni)

    # Generación del PDF
    pdf_buffer = create_diagnosis_pdf(patient_name, diagnosis_date, pneumonia_percentage, normal_percentage)

    file_name = f"{dni}-{diagnosis_date}-{patient}.pdf"

    return send_file(pdf_buffer, as_attachment=True, download_name=file_name, mimetype='application/pdf')


if __name__ == '__main__':
    app.run(debug=False)