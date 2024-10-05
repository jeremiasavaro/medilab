import sqlite3
from datetime import datetime
from flask import current_app
from db.database import db
from db.models import patient, doctor, clinic, diagnostic, worksAt

def connect(testing=False):
    try:
        if testing:
            conn = sqlite3.connect(':memory:')
            print("Connection to in-memory database successful")
            return conn
        else:
            conn = sqlite3.connect('db/database.db')
            print("Connection successful")
            return conn
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def insert_patient(dni, first_name, last_name, encrypted_password, email, phone_number, date_birth,nationality, province, locality, postal_code, address, gender):
    new_patient = patient(
        dni=dni,
        first_name=first_name,
        last_name=last_name,
        password=encrypted_password,
        email=email,
        phone_numbere=phone_number,
        date_birth=date_birth,
        nationality=nationality,
        province=province,
        locality=locality,
        postal_code=postal_code,
        address=address,
        gender=gender
    )
    db.session.add(new_patient)
    db.session.commit()


def delete_patient(dni):
    patient = patient.query.filter_by(dni=dni).first()
    
    if patient:
        db.session.delete(patient)
        db.session.commit()
        print(f"Patient with DNI {dni} successfully removed")
    else:
        print(f"Patient with DNI {dni} not found")

#Faltaria arreglar que si se elimina un paciente se deberian eliminar sus diagnosticos correspondientes
#Ya esta hecho con la foreign key!!


def get_patient(dni):
    #testing = current_app.config.get('TESTING', False)
    
    patient = patient.query.filter_by(dni=dni).first()
    return patient


def modify_password(dni, newPassword):
    patient = patient.query.filter_by(dni=dni).first()
    if patient:
        patient.password = newPassword
        db.session.commit()

def modify_image_patient(dni, imagePatient):
    patient = patient.query.filter_by(dni=dni).first()
    if patient:
        patient.image_patient = imagePatient
        db.session.commit()

def modify_patient(dni, firstName, lastName, email, phoneNumber, dateBirth, nationality, province, locality, postalCode, address, gender, imagePatient=None):
    patient = patient.query.filter_by(dni=dni).first()
    
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
    patient = patient.query.filter_by(dni=dni).first()
    if patient:
        return patient.password
    return None  # Return None if no patient is found with the given DNI


def calculate_age(dateBirth):
    today = datetime.today()
    birth_date = datetime.strptime(dateBirth, "%Y-%m-%d")
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age


def insert_diagnostic(result, description, imageDiagnostic, dni):
     new_diagnostic = diagnostic(
        res=result,
        description=description,
        image_diagnostic=imageDiagnostic,
        dni=dni,
     )
     db.session.add(new_diagnostic)
     db.session.commit()


def get_diagnostics(dni):
    #testing = current_app.config.get('TESTING', False)
    
    diagnostics = diagnostic.query.filter_by(dni=dni).all()
    return diagnostics

def get_diagnostics_by_code(cod):
    #testing = current_app.config.get('TESTING', False)
    
    diagnostics = diagnostic.query.filter_by(cod=cod).all()
    return diagnostics

def get_diagnostics_by_result(dni, result):
    #testing = current_app.config.get('TESTING', False)

    diagnostics = diagnostic.query.filter_by(dni=dni, result=result).all()
    return diagnostics

def get_diagnostics_by_description(dni, description):
     #testing = current_app.config.get('TESTING', False)

    diagnostics = diagnostic.query.filter_by(dni=dni, description=description).all()
    return diagnostics
#-------------------------------------------- Doctor Table functions --------------------------------------------
def insert_doctor(dni,speciality, firstName, lastName, email, phoneNumber, dateBirth, gender, imageDoctor=None):
     new_doctor = doctor(
        dni=dni,
        speciality=speciality,
        first_name=firstName,
        last_name=lastName,
        email=email,
        phone_number=phoneNumber,
        date_birth=dateBirth,
        age=calculate_age(dateBirth),
        gender=gender,
        image_doctor=imageDoctor,
     )
     db.session.add(new_doctor)
     db.session.commit()


def delete_doctor(dni):
    doctor = doctor.query.filter_by(dni=dni).first()
    
    if patient:
        db.session.delete(doctor)
        db.session.commit()
        print(f"Doctor with DNI {dni} successfully removed")
    else:
        print(f"Doctor with DNI {dni} not found")

def modify_doctor(dni,speciality, firstName, lastName, email, phoneNumber, dateBirth, gender, imageDoctor=None):
    doctor = doctor.query.filter_by(dni=dni).first()
    
    if doctor:
        doctor.speciality = speciality
        doctor.first_name = firstName
        doctor.last_name = lastName
        doctor.email = email
        doctor.phone_number = phoneNumber
        doctor.date_birth = dateBirth
        doctor.age = calculate_age(dateBirth)
        doctor.gender = gender
        doctor.image_doctor = imageDoctor
        
        db.session.commit()

def get_doctors():
    #testing = current_app.config.get('TESTING', False)
    
    doctors = doctor.query.all()
    return doctors

def get_doctors_by_speciality(doctor_speciality):
    #testing = current_app.config.get('TESTING', False)
    
    doctors = doctor.query.filter_by(speciality=doctor_speciality).all()
    return doctors

    conn.close()

def get_cities_for_doctor(doctor_dni):
    conn = connect()
    cursor = conn.cursor()

    # SQL query to get cities where the doctor works
    query = """
        SELECT clinic.city 
        FROM WorksAt 
        JOIN clinic ON WorksAt.clinic_number = clinic.clinic_number 
        WHERE WorksAt.doctor_dni = ?
    """
    
    cursor.execute(query, (doctor_dni,))
    cities = cursor.fetchall()

    # Print the fetched cities to verify if any data is returned
    print(f"Cities fetched for doctor {doctor_dni}: {cities}")

    conn.close()

    # If no cities are found, return a message
    if not cities:
        print(f"No clinics found for doctor with DNI {doctor_dni}")
        return []

    # Extracting city names from the fetched data
    city_list = [city[0] for city in cities]
    
    # Print the final list of cities
    print(f"City list for doctor {doctor_dni}: {city_list}")
    
    return city_list

#-------------------------------------------- Clinic Table functions --------------------------------------------
def insert_clinic(name, phoneNumber, province, city, postalCode, address):
    new_clinic = clinic(
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
    clinic = clinic.query.filter_by(name=name).first()
    
    if patient:
        db.session.delete(clinic)
        db.session.commit()
        print(f"Clinic with name {name} successfully removed")
    else:
        print(f"Clinic with name {name} not found")   

def modify_clinic(name, phoneNumber, province, city, postalCode, address):
    clinic = clinic.query.filter_by(name=name).first()
    
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
    
    doctors = doctor.query.all()
    return doctors   

def get_clinics_by_city(cityname):
   #testing = current_app.config.get('TESTING', False)
    
    doctors = doctor.query.filter_by(name=cityname).all()
    return doctors
 


#-------------------------------------------- WorksAt Table functions --------------------------------------------
def insert_WorksAt(doctordni, clinicname):
    conn = connect()
    cursor = conn.cursor()

    # Find the clinic number based on the name
    find_query = "SELECT clinic_number FROM clinic WHERE name = ?"
    cursor.execute(find_query, (clinicname,))
    clinic_number = cursor.fetchone()

    if clinic_number is None:
        print("Clinic not found.")
        return

    # clinic_number is a tuple, so access the first element
    clinic_number = clinic_number[0]

    # Insert into WorksAt table
    cursor.execute("""INSERT INTO WorksAt (clinic_number, doctor_dni) 
                      VALUES (?, ?)""",
                   (clinic_number, doctordni))

    conn.commit()
    conn.close()
    print(f"Doctor {doctordni} is now assigned to clinic '{clinicname}'.")

def delete_working_doctor(doctordni, clinicname):
    conn = connect() 
    cursor = conn.cursor()

    # Find the clinic number based on the name
    find_query = "SELECT clinic_number FROM clinic WHERE name = ?"
    cursor.execute(find_query, (clinicname,))
    clinic_number = cursor.fetchone()

    if clinic_number is None:
        print(f"Clinic '{clinicname}' not found.")
        conn.close()
        return

    # clinic_number is a tuple, so access the first element
    clinic_number = clinic_number[0]

    # Delete from WorksAt table
    delete_query = """
    DELETE FROM WorksAt 
    WHERE doctor_dni = ? AND clinic_number = ?;
    """
    cursor.execute(delete_query, (doctordni, clinic_number))

    # Commit the transaction
    conn.commit()
    conn.close()

    print(f"Doctor {doctordni} successfully removed from clinic '{clinicname}'.")