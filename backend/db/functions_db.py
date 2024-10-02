import sqlite3
from datetime import datetime

def connect():
    try:
        conn = sqlite3.connect('db/database.db')
        
        return conn
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return None


def insert_patient(dni, firstName, lastName, password, email, phoneNumber, dateBirth, nationality, province,
                   locality, postalCode, address, gender, imagePatient=None):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("""INSERT INTO patient (dni, firstName, lastName, password, email, phoneNumber, dateBirth, age, nationality, province, 
                   locality, postalCode, address, gender, imagePatient) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                   (dni, firstName, lastName, password, email, phoneNumber, dateBirth, calculate_age(dateBirth),
                    nationality, province,
                    locality, postalCode, address, gender, imagePatient))

    conn.commit()
    conn.close()


def delete_patient(dni):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM patient WHERE dni = ?", (dni,))
    print(f"patient with DNI {dni} successfully removed")
    
    conn.commit()
    conn.close()

#Faltaria arreglar que si se elimina un paciente se deberian eliminar sus diagnosticos correspondientes
#Ya esta hecho con la foreign key!!


def get_patient(dni):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM patient WHERE dni = ?", (dni,))
    patient_data = cursor.fetchone()

    conn.close()
    return patient_data


def modify_password(dni, newPassword):
    conn = connect()
    cursor = conn.cursor()

    query = """UPDATE patient 
            SET password = ? 
            WHERE dni = ?"""
    cursor.execute(query, (newPassword, dni))

    conn.commit()
    conn.close()

def modify_image_patient(dni, imagePatient):
    conn = connect()
    cursor = conn.cursor()

    query = """UPDATE patient
            SET imagePatient = ?
            WHERE dni = ?"""
    cursor.execute(query, (imagePatient, dni))

    conn.commit()
    conn.close()

def modify_patient(dni, firstName, lastName, email, phoneNumber, dateBirth, nationality, province, locality, postalCode, address, gender, imagePatient=None):
    conn = connect()
    cursor = conn.cursor()
    query = """
        UPDATE patient 
        SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?, dateBirth = ?, 
            age = ?, nationality = ?, province = ?, locality = ?, postalCode = ?, address = ?, gender = ?, imagePatient = ?
        WHERE dni = ?
    """
    cursor.execute(query, (firstName, lastName, email, phoneNumber, dateBirth, calculate_age(dateBirth), nationality, province, locality, postalCode, address, gender, imagePatient, dni))

    conn.commit()
    conn.close()



def get_password(dni):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("SELECT password FROM patient WHERE dni = (?)", (dni,))
    password_data = cursor.fetchone()

    conn.close()
    return password_data[0]


def calculate_age(dateBirth):
    today = datetime.today()
    birth_date = datetime.strptime(dateBirth, "%Y-%m-%d")
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age


def insert_diagnostic(result, description, imageDiagnostic, dni):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO diagnostic (result, description, imageDiagnostic, dni) 
        VALUES (?,?,?,?)
    """, (result, description, imageDiagnostic, dni))

    # Obtengo el último ID
    cod = cursor.lastrowid

    conn.commit()
    conn.close()

    return cod


def get_diagnostics(dni):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM diagnostic WHERE dni = ?", (dni,))
    patient_data = cursor.fetchall()

    conn.close()
    return patient_data

def get_diagnostics_by_code(cod):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM diagnostic WHERE cod = ?", (cod,))
    patient_data = cursor.fetchall()

    conn.close()
    return patient_data

def get_diagnostics_by_result(dni, result):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM diagnostic WHERE (dni,result) = (?,?)", (dni, result))
    patient_data = cursor.fetchall()

    conn.close()
    return patient_data

def get_diagnostics_by_description(dni, description):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM diagnostic WHERE (dni,description) = (?,?) ", (dni, description))
    patient_data = cursor.fetchall()
    
    conn.close()
    return patient_data
#-------------------------------------------- Doctor Table functions --------------------------------------------
def insert_doctor(dni,matricule, firstName, lastName, email, phoneNumber, dateBirth, gender, imageDoctor=None):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("""INSERT INTO doctor (dni, speciality, firstName, lastName, email, phoneNumber, dateBirth, age, gender, imageDoctor) 
                  VALUES (?,?,?,?,?,?,?,?,?,?)""", 
               (dni, matricule, firstName, lastName, email, phoneNumber, dateBirth, calculate_age(dateBirth), gender, imageDoctor))

    conn.commit()
    conn.close()


def delete_doctor(dni):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM doctor WHERE dni = ?", (dni,))
    print(f"doctor with DNI {dni} successfully removed")
    
    conn.commit()
    conn.close()

def modify_doctor(dni,matricule, firstName, lastName, email, phoneNumber, dateBirth, gender, imageDoctor=None):
    conn = connect()
    cursor = conn.cursor()

    query = """
        UPDATE doctor 
        SET matricule = ?, firstName = ?, lastName = ?, email = ?, phoneNumber = ?, dateBirth = ?, 
            age = ?, gender = ?, imageDoctor = ?
        WHERE dni = ?
    """
    cursor.execute(query, (matricule,firstName, lastName, email, phoneNumber, dateBirth, calculate_age(dateBirth),gender, imageDoctor, dni))

    conn.commit()
    conn.close()

def get_doctors():
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM doctor")
    doctor_data = cursor.fetchall()

    # Print the result to check if the query returns any data
    print(f"Doctors fetched: {doctor_data}")

    conn.close()

    return doctor_data

def get_doctors_by_speciality(doctor_speciality):
    conn = connect()
    cursor = conn.cursor()

    # SQL query to get doctors by matricule
    cursor.execute("SELECT firstname, speciality FROM doctor WHERE speciality = ?", (doctor_speciality,))

    doctor_data = cursor.fetchall()

    print(f"Doctors fetched: {doctor_data}")

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
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("""INSERT INTO clinic (Name, phoneNumber, province, city, postalCode, address) 
                      VALUES (?, ?, ?, ?, ?, ?)""",
                   (name, phoneNumber, province, city, postalCode, address))

    conn.commit()
    conn.close()

def delete_clinic(name):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM clinic WHERE name = ?", (name,))
    print(f"clinic with name {name} successfully removed")
    
    conn.commit()
    conn.close()    

def modify_clinic(name, phoneNumber, province, city, postalCode, address):
    conn = connect()
    cursor = conn.cursor()

    #Find the clinic number based on the  name
    find_query = "SELECT clinic_number FROM clinic WHERE name = ?"
    cursor.execute(find_query, (name,))
    clinic_number = cursor.fetchone()

    if clinic_number is None:
        print("Clinic not found.")
        return

    #Update the clinic details using the clinic_number
    query = """
        UPDATE clinic 
        SET phoneNumber = ?, province = ?, city = ?, postalCode = ?, address = ? 
        WHERE clinic_number = ?
    """
    cursor.execute(query, (phoneNumber, province, city, postalCode, address, clinic_number[0]))

    conn.commit()
    conn.close()

    print(f"Clinic '{name}' has been updated successfully.")

def get_all_clinics():
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM clinic")
    clinic_data = cursor.fetchall()

    # Print the result to check if the query returns any data
    print(f"Clinics fetched: {clinic_data}")

    conn.close()

    return clinic_data    

def get_clinics_by_city(cityname):
    conn = connect()
    cursor = conn.cursor()

   # Find the clinic number based on the name
    find_query = "SELECT * FROM clinic WHERE city = ?"
    cursor.execute(find_query, (cityname,))

    clinic_data = cursor.fetchall()

    # Print the result to check if the query returns any data
    print(f"Clinics fetched: {clinic_data}")

    conn.close()

    return clinic_data  


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