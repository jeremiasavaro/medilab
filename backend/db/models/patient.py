from ..init_db import db
from datetime import date

class Patient(db.Model):
    __tablename__ = 'patient'
    dni = db.Column(db.Integer, primary_key=True, nullable=False, check=db.CheckConstraint('dni > 0'))
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, check=db.CheckConstraint("email LIKE '%_@__%.__%'"))
    phone_number = db.Column(db.Integer, nullable=False, check=db.CheckConstraint('phone_number > 0'))
    date_birth = db.Column(db.Date, nullable=False, check=db.CheckConstraint('date_birth > 0 AND date_birth < CURRENT_DATE'))
    age = db.Column(db.Integer, nullable=False, check=db.CheckConstraint('age > 0'))
    nationality = db.Column(db.String(100), nullable=False)
    province = db.Column(db.String(100), nullable=False)
    locality = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String(255), nullable=False)
    gender = db.Column(db.String(10), nullable=False, check=db.CheckConstraint("gender IN ('Male', 'Female', 'Other')"))
    image_patient = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f'<Patient {self.first_name} {self.last_name}>'