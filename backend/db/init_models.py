from database import db  # Importar la conexión a la base de datos
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()  # Create the SQLAlchemy instance

def register_models(app):
    with app.app_context():
        db.create_all()  # Create all tables in the database
        print("Modelos registrados.")