from datetime import datetime
from .database import db
from .models import *
from sqlalchemy.orm import *

# Insert a new patient into the database
def insert_patient(patient_data):
    date_birth_obj = datetime.strptime(patient_data['birthDate'], "%Y-%m-%d").date()

    new_patient = Patient(
        dni=patient_data['dni'],
        first_name=patient_data['firstName'],
        last_name=patient_data['lastName'],
        password=patient_data['password'],
        email=patient_data['email'],
        phone_number=patient_data['phone'],
        date_birth=date_birth_obj,
        age=calculate_age(date_birth_obj),
        nationality=patient_data['nationality'],
        province=patient_data['province'],
        locality=patient_data['locality'],
        postal_code=patient_data['postalCode'],
        address=patient_data['address'],
        gender=patient_data['gender'],
        image_patient=None
    )
    db.session.add(new_patient)
    db.session.commit()

# Delete a patient from the database by DNI
def delete_patient(dni):
    patient = Patient.query.filter_by(dni=dni).first()

    if patient:
        db.session.delete(patient)
        db.session.commit()
        print(f"Patient with DNI {dni} successfully removed")
    else:
        print(f"Patient with DNI {dni} not found")

# Retrieve a patient from the database by DNI
def get_patient(dni):
    patient = Patient.query.filter_by(dni=dni).first()
    return patient

# Modify the password of a patient
def modify_password(dni, newPassword):
    patient = Patient.query.filter_by(dni=dni).first()
    if patient:
        patient.password = newPassword
        db.session.commit()

# Modify the image of a patient
def modify_image_patient(dni, imagePatient):
    patient = Patient.query.filter_by(dni=dni).first()
    if patient:
        patient.image_patient = imagePatient
        db.session.commit()

# Modify the details of a patient
def modify_patient(patient_data):
    patient = Patient.query.filter_by(dni=patient_data['dni']).first()

    try:
        date_obj = datetime.strptime(patient_data['birthDate'], '%Y-%m-%d').date()
    except ValueError:
        date_obj = datetime.strptime(patient_data['birthDate'], '%a, %d %b %Y %H:%M:%S %Z').date()

    if patient:
        patient.first_name = patient_data['firstName']
        patient.last_name = patient_data['lastName']
        patient.email = patient_data['email']
        patient.phone_number = patient_data['phone']
        patient.date_birth = date_obj
        patient.age = calculate_age(date_obj)
        patient.nationality = patient_data['nationality']
        patient.province = patient_data['province']
        patient.locality = patient_data['locality']
        patient.postal_code = patient_data['postalCode']
        patient.address = patient_data['address']
        patient.gender = patient_data['gender']
        patient.image_patient = None

        db.session.commit()

# Retrieve the password of a patient by DNI
def get_password(dni):
    patient = Patient.query.filter_by(dni=dni).first()
    if patient:
        return patient.password
    return None  # Return None if no patient is found with the given DNI

# Calculate the age of a patient based on their birth date
def calculate_age(dateBirth):
    today = datetime.today()
    birth_date = dateBirth

    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

# Insert a new diagnostic into the database
def insert_diagnostic(result, description, imageDiagnostic, dni, pdf_data):
    new_diagnostic = Diagnostic(
        res=result,
        description=description,
        image_diagnostic=imageDiagnostic,
        dni=dni,
        pdf_data=pdf_data,
    )
    db.session.add(new_diagnostic)
    db.session.commit()

# Retrieve all diagnostics for a patient by DNI
def get_diagnostics(dni):
    diagnostics = Diagnostic.query.filter_by(dni=dni).all()
    return diagnostics

# Retrieve diagnostics by code
def get_diagnostics_by_code(cod):
    diagnostics = Diagnostic.query.filter_by(cod=cod).all()
    return diagnostics

# Retrieve diagnostics by result for a patient
def get_diagnostics_by_result(dni, result):
    diagnostics = Diagnostic.query.filter_by(dni=dni, result=result).all()
    return diagnostics

# Retrieve diagnostics by description for a patient
def get_diagnostics_by_description(dni, description):
    diagnostics = Diagnostic.query.filter_by(dni=dni, description=description).all()
    return diagnostics

# Insert a new doctor into the database
def insert_doctor(doctor_data):
    date_birth = datetime.strptime(doctor_data['dateBirth'], '%Y-%m-%d').date()

    new_doctor = Doctor(
        dni=doctor_data['dni'],
        speciality=doctor_data['speciality'],
        first_name=doctor_data['firstName'],
        last_name=doctor_data['lastName'],
        email=doctor_data['email'],
        phone_number=doctor_data['phoneNumber'],
        date_birth=date_birth,
        age=calculate_age(date_birth),
        gender=doctor_data['gender'],
    )
    db.session.add(new_doctor)
    db.session.commit()

# Delete a doctor from the database by DNI
def delete_doctor(dni):
    doctor = Doctor.query.filter_by(dni=dni).first()

    if doctor:
        db.session.delete(doctor)
        db.session.commit()
        print(f"Doctor with DNI {dni} successfully removed")
    else:
        print(f"Doctor with DNI {dni} not found")

# Modify the details of a doctor
def modify_doctor(doctor_data):
    doctor = Doctor.query.filter_by(dni=dni).first()

    if doctor:
        doctor.speciality = doctor_data['speciality']
        doctor.first_name = doctor_data['first_name']
        doctor.last_name = doctor_data['last_name']
        doctor.email = doctor_data['email']
        doctor.phone_number = doctor_data['phone']
        doctor.date_birth = doctor_data['phone']
        doctor.age = calculate_age(doctor_data['dateBirth'])
        doctor.gender = doctor_data['gender']

        db.session.commit()

# Retrieve all doctors from the database
def get_doctors():
    doctors = Doctor.query.all()
    return doctors

# Retrieve doctors by speciality
def get_doctors_by_speciality(doctor_speciality):
    doctors = Doctor.query.filter_by(speciality=doctor_speciality).all()
    return doctors

# Retrieve the cities where a doctor works
def get_cities_for_doctor(doctor_dni):
    doctor = Doctor.query.options(joinedload(Doctor.clinics)).filter_by(dni=doctor_dni).first()

    if not doctor:
        print(f"No doctor found with DNI {doctor_dni}")
        return []

    city_list = [clinic.city for clinic in doctor.clinics]

    print(f"City list for doctor {doctor_dni}: {city_list}")
    return city_list

# Remove all doctors from the database
def remove_doctors():
    Doctor.query.delete()
    db.session.commit()