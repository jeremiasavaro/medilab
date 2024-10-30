from flask import request, current_app, jsonify
import jwt
import os

# Global token variable
token = "token"

# Preflight response in order to avoid CORS blockings
def handle_options_requests(app):
    @app.before_request
    def options_handler():
        if request.method == 'OPTIONS':
            response = jsonify({'message': 'Preflight Request'})
            response.status_code = 200
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            return response

# Method used for making the response with the proper headers
def make_response(json_message, status_code):
    response = jsonify(json_message)
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.status_code = status_code
    return response

# Method used for decoding the token
def decode_token(encoded_token):
    if not encoded_token:
        return None, make_response({'error': 'Token not found'}, 401)
    try:
        decoded_token = jwt.decode(encoded_token, current_app.config['SECRET_KEY'], algorithms=[os.getenv('DECODIFICATION_ALGORITHM')])
        return decoded_token, None
    except jwt.ExpiredSignatureError:
        return None, make_response({'error': 'Token expired'}, 401)
    except jwt.InvalidTokenError:
        return None, make_response({'error': 'Invalid token'}, 401)