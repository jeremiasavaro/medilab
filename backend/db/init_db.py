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

    c.execute('''
        CREATE TABLE IF NOT EXISTS patient (
            dni INTEGER PRIMARY KEY check (dni > 0),
            firstName TEXT NOT NULL, 
            lastName TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL,
            phoneNumber INTEGER NOT NULL check (phoneNumber > 0),
            dateBirth DATE NOT NULL check (dateBirth > 0 and dateBirth < CURRENT_DATE),
            age INTEGER NOT NULL check (age > 0),
            nationality TEXT NOT NULL,
            province TEXT NOT NULL,
            locality TEXT NOT NULL,
            postalCode INTEGER NOT NULL,
            address TEXT NOT NULL,
            gender TEXT NOT NULL
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS diagnostic (
            cod INTEGER PRIMARY KEY,
            result TEXT NOT NULL,
            description TEXT NOT NULL,
            dateResult DATE NOT NULL,
            imageDiagnostic TEXT NOT NULL,
            dni INTEGER NOT NULL,
            CONSTRAINT fk_dni FOREIGN KEY (dni) REFERENCES patient (dni) ON DELETE CASCADE
        )
    ''')

    c.execute('''
        CREATE TRIGGER IF NOT EXISTS triggerDateResult
            BEFORE INSERT ON diagnostic FOR EACH ROW 
        BEGIN
            SELECT NEW.dateResult = CURRENT_TIMESTAMP;
        END;        
    ''')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    connection = connect()
    create_tables(connection)