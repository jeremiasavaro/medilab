#app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from io import BytesIO
import tensorflow as tf
from utils import handle_options_requests, make_response, decode_token
from datetime import datetime
from db.functions_db import *
from db.models import *
from config.config import *
from factory.__init__ import create_app

#Create the app
app = create_app()

#???
handle_options_requests(app)

# Endpoint used for uploading an image
@app.route('/upload_image', methods=['POST'])
@app.route('/upload_xray_photo', methods=['POST'])
def image_upload():
    if 'file' not in request.files or not request.files['file'].filename:
        return make_response({'error': 'File not found'}, 400)

    file = request.files['file']
    upload_result = cloudinary.uploader.upload(file)
    image_url = upload_result.get('url')

    encoded_token = request.headers.get('Authorization')
    decoded_token, error_response = decode_token(encoded_token)
    if error_response:
        return error_response

    dni = decoded_token.get('dni')
    if not get_patient(dni):
        return make_response({'error': 'User not found'}, 404)

    if request.path == '/upload_image':
        modify_image_patient(dni, image_url)
    return make_response({'image_url': image_url}, 200)

if __name__ == '__main__':
    app.run(debug=False)