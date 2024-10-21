from database import db  # Importar la conexión a la base de datos
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()  # Crear la instancia de SQLAlchemy

def register_models(app):
    with app.app_context():
        db.create_all()  # Crea todas las tablas en la base de datos
        print("Modelos registrados.")