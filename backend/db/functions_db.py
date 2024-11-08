from datetime import datetime, date
from .database import db
from .models import *
from sqlalchemy.orm import *

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


def delete_patient(dni):
    patient = Patient.query.filter_by(dni=dni).first()

    if patient:
        db.session.delete(patient)
        db.session.commit()
        print(f"Patient with DNI {dni} successfully removed")
    else:
        print(f"Patient with DNI {dni} not found")



def get_patient(dni):
    patient = Patient.query.filter_by(dni=dni).first()
    return patient


def modify_password(dni, newPassword):
    patient = Patient.query.filter_by(dni=dni).first()
    if patient:
        patient.password = newPassword
        db.session.commit()


def modify_image_patient(dni, imagePatient):
    patient = Patient.query.filter_by(dni=dni).first()
    if patient:
        patient.image_patient = imagePatient
        db.session.commit()


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


def get_password(dni):
    patient = Patient.query.filter_by(dni=dni).first()
    if patient:
        return patient.password
    return None  # Return None if no patient is found with the given DNI


def calculate_age(dateBirth):
    today = datetime.today()
    birth_date = dateBirth

    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))


def insert_diagnostic(result, description, imageDiagnostic, dni):
    new_diagnostic = Diagnostic(
        res=result,
        description=description,
        image_diagnostic=imageDiagnostic,
        dni=dni,
    )
    db.session.add(new_diagnostic)
    db.session.commit()


def get_diagnostics(dni):
    # testing = current_app.config.get('TESTING', False)

    diagnostics = Diagnostic.query.filter_by(dni=dni).all()
    return diagnostics


def get_diagnostics_by_code(cod):
    # testing = current_app.config.get('TESTING', False)

    diagnostics = Diagnostic.query.filter_by(cod=cod).all()
    return diagnostics


def get_diagnostics_by_result(dni, result):
    # testing = current_app.config.get('TESTING', False)

    diagnostics = Diagnostic.query.filter_by(dni=dni, result=result).all()
    return diagnostics


def get_diagnostics_by_description(dni, description):
    # testing = current_app.config.get('TESTING', False)

    diagnostics = Diagnostic.query.filter_by(dni=dni, description=description).all()
    return diagnostics


# -------------------------------------------- Doctor Table functions --------------------------------------------
def insert_doctor(doctor_data):
    # Convertir la fecha de nacimiento de cadena a objeto datetime.date
    date_birth = datetime.strptime(doctor_data['dateBirth'], '%Y-%m-%d').date()

    new_doctor = Doctor(
        dni=doctor_data['dni'],
        speciality=doctor_data['speciality'],
        first_name=doctor_data['firstName'],
        last_name=doctor_data['lastName'],
        email=doctor_data['email'],
        phone_number=doctor_data['phoneNumber'],
        date_birth=date_birth,  # Usar el objeto de fecha
        age=calculate_age(doctor_data['dateBirth']),
        gender=doctor_data['gender'],
    )
    db.session.add(new_doctor)
    db.session.commit()


def delete_doctor(dni):
    doctor = Doctor.query.filter_by(dni=dni).first()

    if doctor:
        db.session.delete(doctor)
        db.session.commit()
        print(f"Doctor with DNI {dni} successfully removed")
    else:
        print(f"Doctor with DNI {dni} not found")


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


def get_doctors():
    # testing = current_app.config.get('TESTING', False)

    doctors = Doctor.query.all()
    return doctors


def get_doctors_by_speciality(doctor_speciality):
    # testing = current_app.config.get('TESTING', False)

    doctors = Doctor.query.filter_by(speciality=doctor_speciality).all()
    return doctors

    conn.close()


def get_cities_for_doctor(doctor_dni):
    # Query to fetch the cities where the doctor works
    doctor = Doctor.query.options(joinedload(Doctor.clinics)).filter_by(dni=doctor_dni).first()

    # I doctor not found, return an empty list
    if not doctor:
        print(f"No doctor found with DNI {doctor_dni}")
        return []

    # Extract city names from related clinics
    city_list = [clinic.city for clinic in doctor.clinics]

    # Print and return the list of cities
    print(f"City list for doctor {doctor_dni}: {city_list}")
    return city_list


def remove_doctors():
    Doctor.query.delete()
    db.session.commit()


# -------------------------------------------- Clinic Table functions --------------------------------------------
def insert_clinic(clinic_data):
    new_clinic = Clinic(
        name=clinic_data['name'],
        phone_number=clinic_data['phoneNumber'],
        province=clinic_data['province'],
        city=clinic_data['city'],
        postal_code=clinic_data['postalCode'],
        address=clinic_data['address'],
    )
    db.session.add(new_clinic)
    db.session.commit()


def delete_clinic(name):
    clinic = Clinic.query.filter_by(name=name).first()

    if clinic:
        db.session.delete(clinic)
        db.session.commit()
        print(f"Clinic with name {name} successfully removed")
    else:
        print(f"Clinic with name {name} not found")


def modify_clinic(clinic_data):
    clinic = Clinic.query.filter_by(name=clinic_data['name']).first()

    if clinic:
        clinic.name = clinic_data['name']
        clinic.phone_number = clinic_data['phoneNumber']
        clinic.province = clinic_data['province']
        clinic.city = clinic_data['city']
        clinic.postal_code = clinic_data['postalCode']
        clinic.address = clinic_data['address']

        db.session.commit()


def get_all_clinics():
    # testing = current_app.config.get('TESTING', False)

    doctors = Doctor.query.all()
    return doctors


def get_clinics_by_city(cityname):
    # testing = current_app.config.get('TESTING', False)

    doctors = Doctor.query.filter_by(name=cityname).all()
    return doctors


# -------------------------------------------- WorksAt Table functions --------------------------------------------
def insert_WorksAt(doctordni, clinicname):
    clinic = Clinic.query.filter_by(name=clinicname).first()

    if clinic is None:
        print("Clinic not found.")
        return

    new_worksat = WorksAt(clinic_number=clinic.clinic_number, doctor_dni=doctordni)
    db.session.add(new_worksat)
    db.session.commit()
    print(f"Doctor {doctordni} is now assigned to clinic '{clinicname}'.")


def delete_working_doctor(doctordni, clinicname):
    clinic = Clinic.query.filter_by(name=clinicname).first()

    if clinic is None:
        print(f"Clinic '{clinicname}' not found.")
        return

    worksat_entry = WorksAt.query.filter_by(doctor_dni=doctordni, clinic_number=clinic.clinic_number).first()

    if worksat_entry:
        db.session.delete(worksat_entry)
        db.session.commit()
        print(f"Doctor {doctordni} successfully removed from clinic '{clinicname}'.")