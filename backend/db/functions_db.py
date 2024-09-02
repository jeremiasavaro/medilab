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
                   locality, postalCode, address, gender):
    conn = connect()
    cursor = conn.cursor()
    
    cursor.execute("""INSERT INTO patient (dni, firstName, lastName, password, email, phoneNumber, dateBirth, age, nationality, province, 
                   locality, postalCode, address, gender) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                   (dni, firstName, lastName, password, email, phoneNumber, dateBirth, calculate_age(dateBirth), nationality, province,
                   locality, postalCode, address, gender))

    conn.commit()
    conn.close()


def get_patient(dni):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM patient WHERE dni = (?)", (dni,))
    patient_data = cursor.fetchone()

    conn.close()
    return patient_data


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

#Faltaria modificar paciente
# def modify_patient():

def insert_diagnostic(cod, result, description, imageDiagnostic, dni):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("""INSERT INTO patient (cod, result, description, imageDiagnostic, dni) VALUES 
                  (?,?,?,?, ?)""", (cod, result, description, imageDiagnostic, dni))

    conn.commit()
    conn.close()


def get_diagnostics(dni):
    
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM diagnostic WHERE dni = ?", (dni))

    conn.commit()
    conn.close()

#Faltaria tener otras funciones que permitan obtener diagnosticos que tengan x descrpicion, x resultado o x codigo.