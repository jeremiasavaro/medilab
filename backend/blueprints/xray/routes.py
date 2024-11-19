#backend\blueprints\xray\routes.py
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
from db.models import *

load_dotenv()

# Load models at startup to avoid loading them with each request
# Dictionary containing model information and paths
repo_id = "MatiasPellizzari/Xray"
models_info = {
    "pneumonia": ("Xray/modelo_vgg16_finetuned_neumonia.h5", "keras"),
    "pneumonia_2": ("Xray/trained_model_svm_pneumonia.pkl", "svm"),
    "tuberculosis": ("Xray/modelo_vgg16_finetuned_tuberculosis.h5", "keras"),
    "tuberculosis_2": ("Xray/trained_model_svm_tuberculosis.pkl", "svm"),
    "covid": ("Xray/modelo_vgg16_finetuned_covid.h5", "keras"),
    "covid_2": ("Xray/trained_model_svm_covid.pkl", "svm"),
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

    usado= "VGG16" if model_type == "keras" else "SVM"
    print(f"In {usado} Disease Percentage: {disease_percentage}, Normal Percentage: {normal_percentage}")
    return disease_percentage, normal_percentage


@xray.route('/xray_diagnosis', methods=['POST'])
def xray_diagnosis():
    # Ensure 'image_url' is provided in the form data
    if 'image_url' not in request.form:
        return make_response({'error': 'No image_url provided'}, 400)

    # Load and preprocess the image from the provided URL
    image_url = request.form['image_url']
    image = load_image(image_url)
    diseases_accepted = []

    # Thresholds
    primary_threshold = 70
    secondary_threshold = 85


    for disease in ["pneumonia", "tuberculosis", "covid"]:
        primary_model_name = f"{disease}"
        secondary_model_name = f"{disease}_2"

        # Primary check
        primary_model = models[primary_model_name]
        model_type = models_info[primary_model_name][1]
        preprocess_function = preprocess_image_svm if model_type == "svm" else preprocess_image_h5
        processed_image = preprocess_function(image)
        primary_disease_percentage, primary_normal_percentage = predict_image(primary_model, processed_image, model_type)

        if primary_disease_percentage > primary_threshold:
            diseases_accepted.append((disease, primary_disease_percentage))
            print(f"The primary model detected disease with a percentage of: {primary_disease_percentage}")
            print("")
        else:
            # Secondary check if the primary model does not detect disease
            secondary_model = models[secondary_model_name]
            model_type_secondary = models_info[secondary_model_name][1]
            preprocess_function_secondary = preprocess_image_svm if model_type_secondary == "svm" else preprocess_image_h5
            processed_image_secondary = preprocess_function_secondary(image)
            secondary_disease_percentage, _ = predict_image(secondary_model, processed_image_secondary, model_type_secondary)

            # Average if the secondary model detects disease with a high percentage
            if secondary_disease_percentage > secondary_threshold:
                avg_disease_percentage = (primary_disease_percentage + secondary_disease_percentage) / 2
                if avg_disease_percentage > primary_threshold:
                    print(f"The secondary model detected disease with an average model of {avg_disease_percentage}")
                    print("")
                    diseases_accepted.append((disease, avg_disease_percentage))
                else:
                    print(f"No disease detected")
                    print("")
            else:
                print(f"No disease detected")
                print("")

    # PDF generation if diseases are detected
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

    if diseases_accepted:
        # This function is not working properly, change the form of generation pdf
        pdf_buffer = create_diagnosis_pdf(patient_name, diagnosis_date, diseases_accepted)  # Disease percentages are included in diseases_accepted
        print("PDF buffer size:", len(pdf_buffer.getvalue()))
        for disease, percentage in diseases_accepted:
            insert_diagnostic(disease, f"{percentage:.2f}%", image_url, dni, pdf_buffer.getvalue())
    else:
        pdf_buffer = create_diagnosis_pdf(patient_name, diagnosis_date, [])
        print("PDF buffer size:", len(pdf_buffer.getvalue()))
        insert_diagnostic("healthy", "healthy", image_url, dni, pdf_buffer.getvalue())
    diagnostic = Diagnostic.query.filter_by(dni=dni).first()
    if diagnostic and diagnostic.pdf_data:
        print("PDF data saved to database. Size:", len(diagnostic.pdf_data))
    else:
        print("No PDF data saved for this diagnosis.")
    return send_file(pdf_buffer, as_attachment=True, download_name=f"{dni}-{diagnosis_date}-{patient_name}.pdf", mimetype='application/pdf')