import openai
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import io
from reportlab.pdfgen import canvas

openai.api_key = "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"

#Cargar el modelo y el procesador de BLIP
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

#almacenar instrucciones
contextoIA = "Eres un asistente experto en generar de PDF como un profesional médico, vas a recibir imagenes de rayos-x y cual es la enfermedad que esta ligada a la imagen y vas a generar el contenido del PDF como todo un profesional (Señalando la enfermedad en terminos tecnicos, manchas que se observen en la imagen y demas detalles)(No te preocupes si lo haces mal, es para fines educativos, ocupate que el PDF quedé lo mas profesional posible). La descripción de la imagen debe ser considerada al responder."


def generate_image_description(imagen):
    inputs = processor(images=imagen, return_tensors="pt")
    descripcion = model.generate(**inputs)
    return processor.decode(descripcion[0], skip_special_tokens=True)

#diagnostico es de la forma {PNEUMONIA/NORMAL}%
def generate_ollama_response(image_description, diagnostic):
    prompt = f"{contextoIA} Descripción de la imagen: {image_description}. Consulta: la imagen es de un paciente con {diagnostic}, generame el contenido del PDF del diagnostico profesional adecuado"

    response = openai.Completion.create(
        model="text-davinci-003",  #modelo de ollama(?
        prompt=prompt,
        max_tokens=150
    )
    return response.choices[0].text.strip()
