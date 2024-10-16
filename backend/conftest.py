import pytest
from app import app, db
from db.models import *
from db.functions_db import *
# database configuration for test

@pytest.fixture
def client():
   app.config['TESTING'] = True
   app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
   app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

   with app.test_client() as testing_client:
      with app.app_context():
         db.create_all()

         patient_data = {
            'dni': '12345678',
            'first_name': 'Carlos',
            'last_name': 'Perez',
            'encrypted_password': 'testpass',
            'email': 'carlos@gmail.com',
            'phone_number': '3385009900',
            'date_birth': '1980-05-15', 
            'nationality': 'Argentina',
            'province': 'Cordoba',
            'locality': 'Rio Cuarto',
            'postal_code': '5800',
            'address': 'Rivadavia 1030',
            'gender': 'Male'
         }

         ## INSERTA en la BD de produccion, hay que corregirlo 

         insert_patient(**patient_data);

         inserted_patient = Patient.query.filter_by(dni=patient_data['dni']).first()
         if inserted_patient:
            print(f"Paciente insertado: {inserted_patient.first_name} {inserted_patient.last_name}, Password: {inserted_patient.encrypted_password}")
         else:
            print("No se pudo encontrar el paciente insertado.")

      yield testing_client

      with app.app_context():
         db.drop_all()
