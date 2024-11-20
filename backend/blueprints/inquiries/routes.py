import os
from flask import jsonify, request
from utils import *
from dotenv import load_dotenv
from db.models import *
from .__init__ import inquiries
from db.functions_db import get_diagnostics
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import base64

load_dotenv()

# Endpoint used for sending a contact message
@inquiries.route('/contact', methods=['POST'])
def contact():
    data = request.json
    required_fields = ['firstName', 'lastName', 'email', 'subject', 'userMessage']
    for field in required_fields:
        if not data.get(field):
            return make_response({'error': 'Data missing'}, 400)

    # Format the email body
    email_body = f"Name: {data['firstName']} {data['lastName']}\n"
    email_body += f"Email: {data['email']}\n"
    email_body += f"Message: {data['userMessage']}\n"

    send_email(data['subject'], email_body, os.getenv('EMAIL_TO'))
    return make_response({'message': 'Contact message sent successfully'}, 200)


# Function used for sending an email
def send_email(subject, body, to):
    # Create the email message with the mail origin and destination
    msg = MIMEMultipart()
    msg['From'] = os.getenv('EMAIL_FROM')
    msg['To'] = to
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    # Send the email using the SMTP server
    with smtplib.SMTP(os.getenv('SMTP_SERVER'), int(os.getenv('SMTP_PORT'))) as server:
        server.starttls()
        server.login(os.getenv('SMTP_USERNAME'), os.getenv('SMTP_PASSWORD'))
        server.sendmail(os.getenv('EMAIL_FROM'), to, msg.as_string())


# Endpoint used for obtaining the doctors table
@inquiries.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.all()  
    doctors_list = [{
        'dni': doctor.dni,
        'first_name': doctor.first_name,
        'last_name': doctor.last_name,
        'speciality': doctor.speciality,
        'email': doctor.email,
        'gender': doctor.gender
    } for doctor in doctors]
    
    return jsonify(doctors_list)

# Endpoint used for obtain the diagnoses of the current user
@inquiries.route('/my_diagnoses', methods=['GET'])
def get_diagnoses():
    encoded_token = request.headers.get('Authorization')
    decoded_token, error_response = decode_token(encoded_token)
    if error_response:
        return error_response
    dni = decoded_token.get('dni')
    diagnoses = get_diagnostics(dni)
    diagnoses_sorted = sorted(diagnoses, key=lambda diagnostic: diagnostic.date_result, reverse=True)
    diagnoses_list = [{
        'image_diagnostic': diagnostic.image_diagnostic,
        'date_result': diagnostic.date_result,
        'dni': diagnostic.dni,
        'pdf_data': base64.b64encode(diagnostic.pdf_data).decode('utf-8') if diagnostic.pdf_data else None,
    } for diagnostic in diagnoses_sorted]
    
    return jsonify(diagnoses_list)