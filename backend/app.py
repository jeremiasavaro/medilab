from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Simulación de base de datos de usuarios
users_db = {
    "testuser": {"password": "testpassword"}
}

@app.route('/login', methods = ['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    print(f'Recibido: username={username}, password={password}')

    if not username or not password:
        return jsonify({'error': 'Faltan datos'}), 400

    user = users_db.get(username)
    if user and user["password"] == password:
        return jsonify({'message': 'Login exitoso'}), 200
    else:
        return jsonify({'error': 'Credenciales incorrectas'}), 401


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    repPassword = data.get('repPassword')
    mail = data.get('mail')
    address = data.get('address')

    print(f'Recibido: username={username}, password={password}, repPassword = {repPassword}, mail = {mail}, address = {address}')

    if(password != repPassword):
        return jsonify({'error': 'Las contraseñas no son iguales'}), 400
    if not username or not password:
        return jsonify({'error': 'Faltan datos'}), 400
    user = users_db.get(username)
    if user:
        return jsonify({'error': 'El usuario ya existe'}), 409
    else:
        users_db[username] = {"password": password}
        return jsonify({'message': 'Registro completado correctamente'}), 200


if __name__ == '__main__':
    app.run(debug=False)