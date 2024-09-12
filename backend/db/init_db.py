import sqlite3

def connect():
    try:
        conn = sqlite3.connect('database.db')
        print("Connection successful")
        return conn
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def create_tables(conn):
    if conn is None:
        print("No connection to the database.")
        return

    c = conn.cursor()

    # Patient Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS patient (
            dni INTEGER PRIMARY KEY check (dni > 0),
            firstName TEXT NOT NULL, 
            lastName TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL check (email LIKE '%_@__%.__%'), 
            phoneNumber INTEGER NOT NULL check (phoneNumber > 0),
            dateBirth DATE NOT NULL check (dateBirth > 0 and dateBirth < CURRENT_DATE),
            age INTEGER NOT NULL check (age > 0),
            nationality TEXT NOT NULL,
            province TEXT NOT NULL,
            locality TEXT NOT NULL,
            postalCode INTEGER NOT NULL,
            address TEXT NOT NULL,
            gender TEXT NOT NULL check (gender IN ('Male', 'Female', 'Other')),
            imagePatient TEXT
        );
    ''')

    # Doctor Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS doctor (
            dni INTEGER PRIMARY KEY check (dni > 0),
            matricule VARCHAR(50) UNIQUE,
            firstName TEXT NOT NULL, 
            lastName TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL check (email LIKE '%_@__%.__%'), 
            phoneNumber INTEGER NOT NULL check (phoneNumber > 0),
            dateBirth DATE NOT NULL check (dateBirth > 0 and dateBirth < CURRENT_DATE),
            age INTEGER NOT NULL check (age > 0),
            gender TEXT NOT NULL check (gender IN ('Male', 'Female', 'Other')),
            imageDoctor TEXT
        );
    ''')

    # Clinic Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS clinic (
            clinic_number INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT UNIQUE NOT NULL, 
            phoneNumber INTEGER NOT NULL check (phoneNumber > 0),
            province TEXT NOT NULL,
            city TEXT NOT NULL,
            postalCode INTEGER NOT NULL,
            address TEXT NOT NULL
        );
    ''')

     # WorksAt Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS WorksAt (
        clinic_number INTEGER,
        doctor_dni INTEGER,
        PRIMARY KEY (clinic_number, doctor_dni),
        CONSTRAINT fk_dni FOREIGN KEY (doctor_dni) REFERENCES doctor (dni) ON DELETE CASCADE,
        CONSTRAINT fk_clinic FOREIGN KEY (clinic_number) REFERENCES clinic (clinic_number) ON DELETE CASCADE
    );
    ''')

     # Diagnostics table
    c.execute('''
        CREATE TABLE IF NOT EXISTS diagnostic (
            cod INTEGER PRIMARY KEY,
            result TEXT NOT NULL,
            description TEXT NOT NULL,
            dateResult DATE NOT NULL,
            imageDiagnostic TEXT NOT NULL,
            dni INTEGER NOT NULL,
            CONSTRAINT fk_dni FOREIGN KEY (dni) REFERENCES patient (dni) ON DELETE CASCADE
        );
    ''')

     #Trigger to check the date on the insert
    c.execute('''
        CREATE TRIGGER IF NOT EXISTS triggerDateResult
        BEFORE INSERT ON diagnostic
        FOR EACH ROW
        BEGIN
            SELECT NEW.dateResult = CURRENT_TIMESTAMP;
        END;
    ''')

def view_tables():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables:", tables)

    conn.commit()
    conn.close()

if __name__ == '__main__':
    connection = connect()
    create_tables(connection)
    view_tables()