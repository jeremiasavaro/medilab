from flask import request, send_file, jsonify, make_response
from utils import *
from .__init__ import *
from db.functions_db import get_patient, insert_diagnostic, get_diagnostics_by_code
from diagnosis.functions import load_image, preprocess_image_svm, preprocess_image_h5, create_diagnosis_pdf
from _datetime import datetime
import tensorflow as tf
from tensorflow.keras.utils import get_custom_objects
from dotenv import load_dotenv
from huggingface_hub import hf_hub_download
import joblib

load_dotenv()

# Load models at startup to avoid loading them with each request
# Dictionary containing model information and paths
repo_id = "MatiasPellizzari/Xray"
models_info = {
    "pneumonia": ("Xray/modelo_vgg16_finetuned_neumonia.h5", "keras"),
    "pneumonia_2": ("Xray/trained_model_svm_pneumonia.pkl", "svm"),
    # "covid": "Xray/modelo_vgg16_finetuned_covid.keras", NOT WORKING
    # "tuberculosis": "Xray/modelo_vgg16_finetuned_tuberculosis.keras" NOT WORKING
}

# Function to load models based on their type (Keras or SVM)
def load_model(filename, model_type):
    try:
        # Download model from Hugging Face
        local_model_path = hf_hub_download(repo_id=repo_id, filename=filename)
        
        # Load SVM model
        if model_type == 'svm':
            model = joblib.load(local_model_path)
        # Load Keras model with custom objects if needed
        elif model_type == 'keras':
            model = tf.keras.models.load_model(local_model_path, custom_objects=get_custom_objects())
        return model
    except Exception as e:
        raise RuntimeError(f"Error loading model '{filename}': {e}")    

# Load all models at application startup to be available for requests
try:
    models = {
        name: load_model(path, model_type) for name, (path, model_type) in models_info.items()
    }
    print("Models loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")

# Function to predict image diagnosis and get probabilities based on model type
def predict_image(model, image, model_type):
    if model_type == "svm":
        # SVM prediction: decision function for probabilities
        probas = model.decision_function(image)
        disease_percentage = max(0, min(probas[0], 1)) * 100  # Ensure values are within 0-100%
        normal_percentage = 100 - disease_percentage
    elif model_type == "keras":
        # Keras model prediction: obtain probabilities for each class
        classes = model.predict(image)
        disease_percentage = classes[0][0] * 100
        normal_percentage = classes[0][1] * 100
    else:
        raise ValueError(f"Model type '{model_type}' not supported.")        

    print(f"Disease Percentage: {disease_percentage}, Normal Percentage: {normal_percentage}")
    return disease_percentage, normal_percentage



# Endpoint to generate diagnosis report from uploaded image
@xray.route('/xray_diagnosis', methods=['POST'])
def xray_diagnosis():
    # Ensure 'image_url' is provided in the form data
    if 'image_url' not in request.form:
        return make_response({'error': 'No image_url provided'}, 400)
    
    # Define the model type to use; change to "pneumonia_2" for the .pkl SVM model. Or "pneumonia" for the .h5 VGG16 model.
    model_type = "pneumonia"

    # Select the appropriate model and preprocessing function
    model = models[model_type]
    preprocess_function = preprocess_image_svm if models_info[model_type][1] == "svm" else preprocess_image_h5
    
    # Load and preprocess the image from the provided URL
    image_url = request.form['image_url']
    image = load_image(image_url)
    processed_image = preprocess_function(image)

    # Get diagnosis probabilities
    disease_percentage, normal_percentage = predict_image(model, processed_image, models_info[model_type][1])

    # Decode the user token and check patient information
    encoded_token = request.headers.get('Authorization')
    decoded_token, error_response = decode_token(encoded_token)
    if error_response:
        return error_response

    dni = decoded_token.get('dni')
    patient = get_patient(dni)
    if not patient:
        return make_response({'error': 'User not found'}, 404)

    patient_name = f"{patient.first_name} {patient.last_name}"
    diagnosis_date = datetime.today()

    # Create the PDF report with diagnosis information and probabilities
    if disease_percentage > normal_percentage:
        diag = f"PNEUMONIA: {disease_percentage:.2f}%"
        pdf_buffer = create_diagnosis_pdf(patient_name, diagnosis_date, "pneumonia", disease_percentage, normal_percentage)
    else:
        diag = f"NORMAL: {normal_percentage:.2f}%"
        pdf_buffer = create_diagnosis_pdf(patient_name, diagnosis_date, "healthy", disease_percentage, normal_percentage)

    des = f"PNEUMONIA: {disease_percentage:.2f}%, NORMAL: {normal_percentage:.2f}%"
    # Uncomment and use to insert diagnosis in the database
    # code_diag = insert_diagnostic(diag, des, image_url, dni)

    # Set the file name based on patient details and diagnosis date
    file_name = f"{dni}-{diagnosis_date}-{patient}.pdf"
    return send_file(pdf_buffer, as_attachment=True, download_name=file_name, mimetype='application/pdf')