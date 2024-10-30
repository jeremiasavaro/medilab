import requests
import numpy as np
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


def preprocess_image(image):
    # Redimensiona la imagen a 224x224 (o la resolución que necesite tu modelo)
    image = image.resize((224, 224))

    # Convierte la imagen a un array de NumPy
    image_array = np.array(image)

    # Verifica si la imagen tiene solo un canal (blanco y negro) y expándelo a 3 canales (RGB)
    if image_array.ndim == 2:
        image_array = np.stack((image_array,) * 3, axis=-1)

    # Asegúrate de que tiene la forma (224, 224, 3)
    assert image_array.shape == (224, 224, 3), f"Imagen no tiene la forma correcta: {image_array.shape}"

    # Normaliza la imagen para que sus valores estén entre 0 y 1
    image_array = image_array / 255.0

    # Expande las dimensiones para incluir el batch size (1, 224, 224, 3)
    image_array = np.expand_dims(image_array, axis=0)

    return image_array



def create_diagnosis_pdf(patient_name, diagnosis_date, diagnosis, diagnosis_prob):
    
    with open('diagnosis_data.json', 'r') as f:
        diagnosis_data = json.load(f)

    pdf_buffer = BytesIO()
    pdf = SimpleDocTemplate(pdf_buffer, pagesize=A4)
    elements = []

    styles = getSampleStyleSheet()
    title_style = styles['Title']
    body_style = ParagraphStyle('BodyText', fontName='Helvetica', fontSize=12, spaceAfter=12)
    subtitle_style = ParagraphStyle('Subtitle', fontName='Helvetica-Bold', fontSize=14, textColor=colors.darkblue, spaceAfter=12)

    #
    elements.append(Paragraph("Medical Diagnosis Report", title_style))
    elements.append(Spacer(1, 12))

    # Información del paciente y fecha
    elements.append(Paragraph(f"Patient: {patient_name}", body_style))
    elements.append(Paragraph(f"Diagnosis Date: {diagnosis_date}", body_style))
    elements.append(Spacer(1, 12))

    # Obtener el diagnóstico del archivo JSON
    diagnosis_info = diagnosis_data.get(diagnosis, diagnosis_data["healthy"])

    #Añadir título, descripción y tratamiento
    elements.append(Paragraph(diagnosis_info["title"], subtitle_style))
    elements.append(Paragraph(diagnosis_info["description"], body_style))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph(diagnosis_info["treatment"], body_style))
    elements.append(Spacer(1, 12))

    #Conclusión con la probabilidad
    if diagnosis == "healthy":
        conclusion = f"The patient, {patient_name}, has a {diagnosis_prob:.2f}% likelihood of being {diagnosis}."
    else:
        conclusion = f"The patient, {patient_name}, has a {diagnosis_prob:.2f}% likelihood of having {diagnosis}."
    elements.append(Paragraph(conclusion, body_style))
    elements.append(Spacer(1, 12))

    #Construir y devolver el PDF
    pdf.build(elements)
    pdf_buffer.seek(0)

    return pdf_buffer

