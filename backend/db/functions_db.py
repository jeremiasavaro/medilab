import sqlite3
from db.init_db import connect

def connect():
    try:
        conn = sqlite3.connect('app/db/database.db')
        return conn
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def insert_patient(dni, username, password, email, phoneNumber, dateBirth, age, nationality, province, department, 
                   locality, postalCode, address, imagePatient, gender):
    conn = connect()
    cursor = conn.cursor()
    
    cursor.execute("""INSERT INTO patient (dni, username, password, email, phoneNumber, dateBirth, age, nationality, province, department, 
                   locality, postalCode, address, imagePatient, gender) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                   (dni, username, password, email, phoneNumber, dateBirth, age, nationality, province, department, 
                   locality, postalCode, address, imagePatient, gender))

    conn.commit()
    conn.close()
    
def get_patient(dni):
    conn = connect()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM patient WHERE dni = ?", (dni))

    conn.commit()
    conn.close()

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