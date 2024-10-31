from flask import request, send_file
from utils import *
from .__init__ import *
from db.functions_db import get_patient, insert_diagnostic
from diagnosis.functions import load_image, preprocess_image, create_diagnosis_pdf
from _datetime import datetime
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import get_custom_objects
from dotenv import load_dotenv
from huggingface_hub import hf_hub_download


load_dotenv()

# Download and load the model outside the endpoint
# This will cause the model to be loaded once when the application starts and be ready for subsequent requests.
repo_id = "MatiasPellizzari/Xray"
models_info = {
    "general": "Xray/modelAI-Jere-v1.h5",
    "neumonia": "Xray/modelo_vgg16_finetuned_neumonia.h5",
    #"covid": "Xray/modelo_vgg16_finetuned_covid.keras", NOT WORKING
    #"tuberculosis": "Xray/modelo_vgg16_finetuned_tuberculosis.keras" NOT WORKING
}

def load_model(filename):
     try:
        # Download model from Hugging Face
        local_model_path = hf_hub_download(repo_id=repo_id, filename=filename)
        # Load model with custom objects if needed, without compilation
        model = tf.keras.models.load_model(local_model_path, custom_objects=get_custom_objects())
        return model
     except Exception as e:
        raise RuntimeError(f"Error loading model '{filename}': {e}")
    

models = {
    model_name: load_model(filename)
    for model_name, filename in models_info.items()
}

# Endpoint used for obtaining the diagnostic for the uploaded image
@xray.route('/xray_diagnosis', methods=['POST'])
def xray_diagnosis():
    if 'image_url' not in request.form:
        return make_response({'error': 'No image_url provided'}, 400)

    image_url = request.form['image_url']
    image = load_image(image_url)
    processed_image = preprocess_image(image)

    #Now the model needs to be selected, as in model['sickness']
    classes = models['general'].predict(processed_image)
    pneumonia_percentage = classes[0][0] * 100
    normal_percentage = classes[0][1] * 100

    encoded_token = request.headers.get('Authorization')
    decoded_token, error_response = decode_token(encoded_token)
    if error_response:
        return error_response

    dni = decoded_token.get('dni')
    patient = get_patient(dni)
    if not patient:
        return make_response({'error': 'User not found'}, 404)

    patient_name = patient.first_name + " " + patient.last_name
    diagnosis_date = datetime.today()

    if pneumonia_percentage > normal_percentage:
        diag = f"PNEUMONIA: {pneumonia_percentage:.2f}%"
        pdf_buffer = create_diagnosis_pdf(patient_name, diagnosis_date, "pneumonia", pneumonia_percentage)
    else:
        diag = f"NORMAL: {normal_percentage:.2f}%"
        pdf_buffer = create_diagnosis_pdf(patient_name, diagnosis_date, "healthy", normal_percentage)

    des = f"PNEUMONIA: {pneumonia_percentage:.2f}%, NORMAL: {normal_percentage:.2f}%"
    # code_diag = insert_diagnostic(diag, des, image_url, dni)

    file_name = f"{dni}-{diagnosis_date}-{patient}.pdf"
    return send_file(pdf_buffer, as_attachment=True, download_name=file_name, mimetype='application/pdf')