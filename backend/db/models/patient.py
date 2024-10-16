from datetime import date
from ..database import db

class Patient(db.Model):
    __tablename__ = 'patient'
    dni = db.Column(db.Integer, primary_key=True, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone_number = db.Column(db.Integer, nullable=False)
    date_birth = db.Column(db.Date, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    nationality = db.Column(db.String(100), nullable=False)
    province = db.Column(db.String(100), nullable=False)
    locality = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String(255), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    image_patient = db.Column(db.String(255), nullable=True)

    __table_args__ = (
        db.CheckConstraint("email LIKE '%_@__%.__%'"),
        db.CheckConstraint('phone_number > 0'),
        db.CheckConstraint('date_birth > 0 AND date_birth < CURRENT_DATE'),
        db.CheckConstraint("gender IN ('Male', 'Female', 'Other')"),
    )

    def __repr__(self):
        return f'<Patient {self.first_name} {self.last_name}>'