from datetime import datetime
from .database import db
from .models import *
from sqlalchemy.orm import * # type: ignore VER!!!

def insert_patient(dni, first_name, last_name, encrypted_password, email, phone_number, date_birth,nationality, province, locality, postal_code, address, gender):
    date_birth_obj = datetime.strptime(date_birth, "%Y-%m-%d").date()

    new_patient = Patient(
        dni=dni,
        first_name=first_name,
        last_name=last_name,
        password=encrypted_password,
        email=email,
        phone_number=phone_number,
        date_birth=date_birth_obj,
        age= calculate_age(date_birth),
        nationality=nationality,
        province=province,
        locality=locality,
        postal_code=postal_code,
        address=address,
        gender=gender,
        image_patient=None
    )
    db.session.add(new_patient)
    db.session.commit()


def delete_patient(db, dni):
    patient = Patient.query.filter_by(dni=dni).first()
    
    if patient:
        db.session.delete(patient)
        db.session.commit()
        print(f"Patient with DNI {dni} successfully removed")
    else:
        print(f"Patient with DNI {dni} not found")

#Faltaria arreglar que si se elimina un paciente se deberian eliminar sus diagnosticos correspondientes
#Ya esta hecho con la foreign key!!


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

def modify_patient(dni, firstName, lastName, email, phoneNumber, dateBirth, nationality, province, locality, postalCode, address, gender, imagePatient=None):
    patient = Patient.query.filter_by(dni=dni).first()
    
    if patient:
        patient.first_name = firstName
        patient.last_name = lastName
        patient.email = email
        patient.phone_number = phoneNumber
        patient.date_birth = dateBirth
        patient.age = calculate_age(dateBirth)
        patient.nationality = nationality
        patient.province = province
        patient.locality = locality
        patient.postal_code = postalCode
        patient.address = address
        patient.gender = gender
        patient.image_patient = imagePatient
        
        db.session.commit()

def get_password(dni):
    patient = Patient.query.filter_by(dni=dni).first()
    if patient:
        return patient.password
    return None  # Return None if no patient is found with the given DNI


def calculate_age(dateBirth):
    today = datetime.today()
    birth_date = datetime.strptime(dateBirth, "%Y-%m-%d")
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age


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
    #testing = current_app.config.get('TESTING', False)
    
    diagnostics = Diagnostic.query.filter_by(dni=dni).all()
    return diagnostics

def get_diagnostics_by_code(cod):
    #testing = current_app.config.get('TESTING', False)
    
    diagnostics = Diagnostic.query.filter_by(cod=cod).all()
    return diagnostics

def get_diagnostics_by_result(dni, result):
    #testing = current_app.config.get('TESTING', False)

    diagnostics = Diagnostic.query.filter_by(dni=dni, result=result).all()
    return diagnostics

def get_diagnostics_by_description(dni, description):
     #testing = current_app.config.get('TESTING', False)

    diagnostics = Diagnostic.query.filter_by(dni=dni, description=description).all()
    return diagnostics
#-------------------------------------------- Doctor Table functions --------------------------------------------
def insert_doctor(dni,speciality, firstName, lastName, email, phoneNumber, dateBirth, gender):
     
    # Convertir la fecha de nacimiento de cadena a objeto datetime.date
    date_birth = datetime.strptime(dateBirth, '%Y-%m-%d').date()

    new_doctor = Doctor(
        dni=dni,
        speciality=speciality,
        first_name=firstName,
        last_name=lastName,
        email=email,
        phone_number=phoneNumber,
        date_birth=date_birth,  # Usar el objeto de fecha
        age=calculate_age(dateBirth),
        gender=gender,
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

def modify_doctor(dni,speciality, firstName, lastName, email, phoneNumber, dateBirth, gender):
    doctor = Doctor.query.filter_by(dni=dni).first()
    
    if doctor:
        doctor.speciality = speciality
        doctor.first_name = firstName
        doctor.last_name = lastName
        doctor.email = email
        doctor.phone_number = phoneNumber
        doctor.date_birth = dateBirth
        doctor.age = calculate_age(dateBirth)
        doctor.gender = gender
        
        db.session.commit()

def get_doctors():
    #testing = current_app.config.get('TESTING', False)
    
    doctors = Doctor.query.all()
    return doctors

def get_doctors_by_speciality(doctor_speciality):
    #testing = current_app.config.get('TESTING', False)
    
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

#-------------------------------------------- Clinic Table functions --------------------------------------------
def insert_clinic(name, phoneNumber, province, city, postalCode, address):
    new_clinic = Clinic(
        name=name,
        phone_number=phoneNumber,
        province=province,
        city=city,
        postal_code=postalCode,
        address=address,
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

def modify_clinic(name, phoneNumber, province, city, postalCode, address):
    clinic = Clinic.query.filter_by(name=name).first()
    
    if clinic:
        clinic.name = name
        clinic.phone_number = phoneNumber
        clinic.province = province
        clinic.city = city
        clinic.postal_code = postalCode
        clinic.address = address

        db.session.commit()

def get_all_clinics():
   #testing = current_app.config.get('TESTING', False)
    
    doctors = Doctor.query.all()
    return doctors   

def get_clinics_by_city(cityname):
   #testing = current_app.config.get('TESTING', False)
    
    doctors = Doctor.query.filter_by(name=cityname).all()
    return doctors
 


#-------------------------------------------- WorksAt Table functions --------------------------------------------
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
