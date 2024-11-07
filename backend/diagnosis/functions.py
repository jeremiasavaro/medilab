import requests
import numpy as np
import base64
import json
from PIL import Image
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from io import BytesIO


def load_image(image_url):
    response = requests.get(image_url)
    image = Image.open(BytesIO(response.content))
    return image


def preprocess_image_h5(image):
    # Resize the image to 224x224 (or the resolution required by the model)
    image = image.resize((224, 224))

    # Convert the image to a NumPy array
    image_array = np.array(image)

    # Check if the image has only one channel (grayscale) and expand it to 3 channels (RGB)
    if image_array.ndim == 2:
        image_array = np.stack((image_array,) * 3, axis=-1)

    # Ensure it has the shape (224, 224, 3)
    assert image_array.shape == (224, 224, 3), f"Image does not have the correct shape: {image_array.shape}"

    # Normalize the image to have values between 0 and 1
    image_array = image_array / 255.0

    # Expand dimensions to include batch size (1, 224, 224, 3)
    image_array = np.expand_dims(image_array, axis=0)

    return image_array

def preprocess_image_svm(image):
    # Define image size
    IMG_SIZE = (512, 512)
    # Resize the image and convert it to grayscale
    img = image.convert('L')
    img = img.resize((IMG_SIZE))  # Ensure this size matches the one used during training
    img_array = np.array(img).flatten()  # Flatten the image to a 1D vector
    return img_array.reshape(1, -1)  # Reshape for prediction (1, number_of_features)

def encode_image_to_base64(image):
    # Encode the image to base64 format
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

def create_diagnosis_pdf(patient_name, diagnosis_date, diagnosis, disease_prob, normal_prob):
     # Load the JSON file containing diagnosis data
    with open('diagnosis_data.json', 'r') as f:
        diagnosis_data = json.load(f)

    pdf_buffer = BytesIO()
    pdf = SimpleDocTemplate(pdf_buffer, pagesize=A4)
    elements = []

    styles = getSampleStyleSheet()
    title_style = styles['Title']
    body_style = ParagraphStyle('BodyText', fontName='Helvetica', fontSize=12, spaceAfter=12)
    subtitle_style = ParagraphStyle('Subtitle', fontName='Helvetica-Bold', fontSize=14, textColor=colors.darkblue, spaceAfter=12)

    # Report title
    elements.append(Paragraph("Medical Diagnosis Report", title_style))
    elements.append(Spacer(1, 12))

    # Patient and date information
    elements.append(Paragraph(f"Patient: {patient_name}", body_style))
    elements.append(Paragraph(f"Diagnosis Date: {diagnosis_date}", body_style))
    elements.append(Spacer(1, 12))

    # Retrieve diagnosis information from JSON file
    diagnosis_info = diagnosis_data.get(diagnosis, diagnosis_data["healthy"])

    # Add title, description, and treatment
    elements.append(Paragraph(diagnosis_info["title"], subtitle_style))
    elements.append(Paragraph(diagnosis_info["description"], body_style))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph(diagnosis_info["treatment"], body_style))
    elements.append(Spacer(1, 12))

    # Conclusion with both probabilities
    if diagnosis == "healthy":
        conclusion = f"The patient, {patient_name}, is healthy with a {normal_prob:.2f}% probability."
    else:
        conclusion = f"The patient, {patient_name}, has a {disease_prob:.2f}% likelihood of having {diagnosis} and a {normal_prob:.2f}% likelihood of being healthy."
    elements.append(Paragraph(conclusion, body_style))
    elements.append(Spacer(1, 12))

    # Build and return the PDF
    pdf.build(elements)
    pdf_buffer.seek(0)

    return pdf_buffer

