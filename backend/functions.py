import requests
import numpy as np
from io import BytesIO
from PIL import Image
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


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


def create_diagnosis_pdf(patient_name, diagnosis_date, pneumonia_prob, healthy_prob):
    # Crear el documento PDF en memoria
    pdf_buffer = BytesIO()
    pdf = SimpleDocTemplate(pdf_buffer, pagesize=A4)
    elements = []

    # Estilos
    styles = getSampleStyleSheet()
    title_style = styles['Title']
    body_style = styles['BodyText']

    # Título del informe
    elements.append(Paragraph("Informe de Diagnóstico", title_style))
    elements.append(Spacer(1, 12))

    # Datos del paciente
    elements.append(Paragraph(f"Paciente: {patient_name}", body_style))
    elements.append(Paragraph(f"Fecha del Diagnóstico: {diagnosis_date}", body_style))
    elements.append(Spacer(1, 12))

    # Diagnóstico detallado o simple
    if pneumonia_prob > healthy_prob:
        elements.append(Paragraph("**Diagnóstico: Neumonía**", title_style))
        elements.append(Spacer(1, 12))

        description = """La neumonía es una infección pulmonar que inflama los sacos aéreos ..."""
        elements.append(Paragraph(description, body_style))
        elements.append(Spacer(1, 12))

        effects = """Los síntomas comunes de la neumonía incluyen tos con flema ..."""
        elements.append(Paragraph(effects, body_style))
        elements.append(Spacer(1, 12))

        treatment = """El tratamiento de la neumonía incluye antibióticos, antivirales o antifúngicos ..."""
        elements.append(Paragraph(treatment, body_style))
        elements.append(Spacer(1, 12))

        conclusion = f"""El paciente {patient_name} tiene una probabilidad del {pneumonia_prob:.2f}% de tener neumonía."""
        elements.append(Paragraph(conclusion, body_style))
    else:
        elements.append(Paragraph("**Diagnóstico: Saludable**", title_style))
        elements.append(Spacer(1, 12))

        conclusion = f"""El paciente {patient_name} no presenta signos de neumonía ..."""
        elements.append(Paragraph(conclusion, body_style))

    # Construir el PDF
    pdf.build(elements)
    pdf_buffer.seek(0)

    # Regresar el buffer para ser enviado como archivo
    return pdf_buffer

