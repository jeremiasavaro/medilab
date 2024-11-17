#backend\diagnosis\functions.py
import requests
import numpy as np
import base64
import json
from PIL import Image
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from io import BytesIO
from reportlab.lib.units import inch
from reportlab.platypus import Image
from PIL import Image as PilImage
import os


def load_image(image_url):
    response = requests.get(image_url)
    image = PilImage.open(BytesIO(response.content))
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

def create_diagnosis_pdf(patient_name, diagnosis_date, diseases_accepted):
    pdf_buffer = BytesIO()
    pdf = SimpleDocTemplate(pdf_buffer, pagesize=A4)
    elements = []

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'Title', fontName='Helvetica-Bold', fontSize=18,
        textColor=colors.HexColor("#2E86C1"), spaceAfter=20
    )
    header_style = ParagraphStyle(
        'Header', fontName='Helvetica-Bold', fontSize=16,
        textColor=colors.HexColor("#2C3E50"), spaceAfter=14
    )
    body_style = ParagraphStyle(
        'BodyText', fontName='Helvetica', fontSize=12,
        spaceAfter=12
    )
    small_style = ParagraphStyle(
        'SmallText', fontName='Helvetica', fontSize=10,
        textColor=colors.gray
    )

    # Insert logo in the PDF document
    # Define the path of the logo relative to the current file's location
    base_dir = os.path.dirname(os.path.abspath(__file__))
    logo_path = os.path.join(base_dir, '../../frontend/src/assets/img/medilab/medilag_logo1.png')

    # Check if the logo file exists
    if os.path.exists(logo_path):
        # Get the original dimensions of the image
        with PilImage.open(logo_path) as img:
            width, height = img.size

        # Define the desired width or height while maintaining aspect ratio
        desired_width = 2 * inch
        aspect_ratio = height / width
        scaled_height = desired_width * aspect_ratio  # Adjust height based on the width

        # Create the Image object with the adjusted dimensions
        logo = Image(logo_path, width=desired_width, height=scaled_height)
        logo.hAlign = 'CENTER'

        # Add the logo and a spacer to the elements list
        elements.append(logo)
        elements.append(Spacer(1, 20))
    else:
        print(f"Logo path does not exist: {logo_path}")
    # End logo in PDF module

    # Report title
    elements.append(Paragraph("Medical Diagnosis Report", title_style))
    elements.append(Spacer(1, 20))

    # Patient and date information
    elements.append(Paragraph(f"Patient: {patient_name}", body_style))
    elements.append(Paragraph(f"Diagnosis Date: {diagnosis_date.strftime('%Y-%m-%d')}", body_style))
    elements.append(Spacer(1, 20))

    # Diagnostic Section
    elements.append(Paragraph("Diagnosis Summary", header_style))

    if diseases_accepted:
        # Table for detected diseases and their percentages
        data = [["Disease", "Detection Probability (%)"]]
        data += [[disease.capitalize(), f"{percentage:.2f}%"] for disease, percentage in diseases_accepted]

        table = Table(data, colWidths=[200, 150])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#AED6F1")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#D6EAF8")),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        elements.append(table)
    else:
        # If no diseases are detected
        elements.append(Paragraph("Diagnosis Result: Healthy", ParagraphStyle(
            'HealthyTitle', fontName='Helvetica-Bold', fontSize=18,
            textColor=colors.HexColor("#2ECC71"), spaceAfter=20
        )))
        elements.append(Spacer(1, 10))
        elements.append(Paragraph("No diseases were detected. The patient is healthy according to our reports.", body_style))

    # Additional warnings
    elements.append(Spacer(1, 30))
    elements.append(Paragraph("Note: This report is generated by MEDILAB’s AI system and does not replace a professional medical evaluation.", small_style))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph("For ongoing health, regular check-ups with healthcare providers are advised.", small_style))
    #elements.append(Paragraph("<hr/>", body_style))  # Línea divisoria

    # Build and return the PDF
    pdf.build(elements)
    pdf_buffer.seek(0)

    return pdf_buffer