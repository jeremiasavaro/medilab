#medilab\backend\blueprints\image\routes.py
from flask import Flask, request
from flask_cors import CORS
from io import BytesIO
from utils import make_response, decode_token
from db.functions_db import get_patient, modify_image_patient
from db.models import *
from config.config import *
from .__init__ import *

# Endpoint used for uploading an image
@image.route('/upload_image', methods=['POST'])
@image.route('/upload_xray_photo', methods=['POST'])
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

    if request.path == '/image/upload_image':
        modify_image_patient(dni, image_url)
    return make_response({'image_url': image_url}, 200)
