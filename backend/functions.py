import requests
import numpy as np
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
    pdf_buffer = BytesIO()
    pdf = SimpleDocTemplate(pdf_buffer, pagesize=A4)
    elements = []

    styles = getSampleStyleSheet()
    title_style = styles['Title']
    body_style = ParagraphStyle('BodyText', fontName='Helvetica', fontSize=12, spaceAfter=12)
    subtitle_style = ParagraphStyle('Subtitle', fontName='Helvetica-Bold', fontSize=14, textColor=colors.darkblue, spaceAfter=12)

    elements.append(Paragraph("Medical Diagnosis Report", title_style))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(f"Patient: {patient_name}", body_style))
    elements.append(Paragraph(f"Diagnosis Date: {diagnosis_date}", body_style))
    elements.append(Spacer(1, 12))

    if diagnosis == "pneumonia":
        elements.append(Paragraph("Diagnosis: Pneumonia", subtitle_style))
        elements.append(Spacer(1, 12))
        description = """Pneumonia is a serious lung infection that causes the air sacs in the lungs to become inflamed and filled with fluid or pus. 
                        This can lead to symptoms such as coughing with mucus, fever, difficulty breathing, and chest pain. Pneumonia can range from mild to life-threatening, 
                        especially in older adults, children, and individuals with weakened immune systems. The severity of the condition depends on the type of pneumonia and the patient's overall health."""
        treatment = """Treatment for pneumonia typically involves antibiotics, antivirals, or antifungals, depending on the underlying cause of the infection. 
                       In severe cases, hospitalization may be required to provide oxygen therapy or mechanical ventilation. Vaccination and preventive measures can reduce the risk of pneumonia."""
    elif diagnosis == "tuberculosis":
        elements.append(Paragraph("Diagnosis: Tuberculosis", subtitle_style))
        description = """Tuberculosis (TB) is an infectious disease caused by the bacterium Mycobacterium tuberculosis, primarily affecting the lungs. 
                         TB is spread through airborne droplets when an infected person coughs or sneezes. Early symptoms include a persistent cough, 
                         night sweats, fever, and weight loss. Without timely treatment, tuberculosis can be life-threatening and may spread to other parts of the body."""
        treatment = """The standard treatment for tuberculosis is a long-term course of antibiotics, often lasting six to nine months. 
                       Early detection and adherence to the full course of treatment are critical to prevent the development of drug-resistant strains of the bacterium."""
    elif diagnosis == "covid":
        elements.append(Paragraph("Diagnosis: COVID-19", subtitle_style))
        description = """COVID-19 is a viral respiratory illness caused by the SARS-CoV-2 virus. The severity of the disease can vary significantly, ranging from mild symptoms such as cough and fever 
                        to severe respiratory distress that may require hospitalization. The virus primarily spreads through respiratory droplets and close contact with infected individuals. 
                        It has had a global impact due to its highly contagious nature and potential for severe health outcomes."""
        treatment = """Treatment for COVID-19 varies depending on the severity of symptoms. Mild cases may only require rest and symptom management, 
                       while severe cases may necessitate hospitalization, oxygen therapy, and in critical cases, mechanical ventilation. Vaccination is the most effective way to prevent severe illness."""
    elif diagnosis == "pulmonia":
        elements.append(Paragraph("Diagnosis: Pneumonia", subtitle_style))
        description = """Pneumonia, also known as pulmonary infection, causes inflammation of the air sacs in one or both lungs. 
                         It can result in fluid accumulation, leading to difficulty breathing and a range of systemic symptoms. 
                         Pneumonia can result from bacterial, viral, or fungal infections, each requiring specific therapeutic approaches. 
                         Early diagnosis and intervention are key to reducing the risk of complications."""
        treatment = """The treatment for pneumonia involves addressing the underlying cause. Bacterial pneumonia is treated with antibiotics, 
                       viral pneumonia with antivirals, and in some cases, antifungal medications. 
                       Supportive care, including rest, fluids, and oxygen therapy, is crucial in managing symptoms."""
    elif diagnosis == "cancer":
        elements.append(Paragraph("Diagnosis: Lung Cancer", subtitle_style))
        description = """Lung cancer is a serious condition characterized by the uncontrolled growth of abnormal cells in the lungs. 
                         It is one of the most common and deadliest cancers worldwide, often caused by smoking, exposure to hazardous chemicals, or genetic factors. 
                         Symptoms of lung cancer include persistent cough, unexplained weight loss, shortness of breath, and chest pain. Early detection is crucial for improving outcomes."""
        treatment = """Lung cancer treatment depends on the stage of the disease. Options include surgery to remove tumors, chemotherapy, radiation therapy, 
                       and targeted therapies. Early-stage lung cancer may be curable with surgery, while advanced stages often require a combination of treatments to manage the disease."""
    else:
        elements.append(Paragraph("Diagnosis: Healthy", subtitle_style))
        description = """Based on the medical evaluation and imaging, the patient does not present signs of significant pulmonary disease. 
                         Regular monitoring and healthy lifestyle choices are recommended to maintain lung health and overall well-being."""
        treatment = """No medical intervention is necessary at this time. However, maintaining a healthy lifestyle, regular check-ups, and preventive care are essential for long-term health."""

    elements.append(Paragraph(description, body_style))
    elements.append(Spacer(1, 12))

    conclusion = f"The patient, {patient_name}, has a {diagnosis_prob:.2f}% likelihood of having {diagnosis}."
    elements.append(Paragraph(conclusion, body_style))
    elements.append(Spacer(1, 12))

    pdf.build(elements)
    pdf_buffer.seek(0)

    return pdf_buffer

