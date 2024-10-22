from ..database import db

class Doctor(db.Model):
    __tablename__ = 'doctor'
    dni = db.Column(db.Integer, primary_key=True, nullable=False)
    speciality = db.Column(db.String(50), nullable=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone_number = db.Column(db.Integer, nullable=False)
    date_birth = db.Column(db.Date, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)

    __table_args__ = (
        db.CheckConstraint('dni > 0'),
        db.CheckConstraint("email LIKE '%_@__%.__%'"),
        db.CheckConstraint('phone_number > 0'),
        db.CheckConstraint('date_birth > 0 AND date_birth < CURRENT_DATE'),
        db.CheckConstraint('age > 0'),
        db.CheckConstraint("gender IN ('Male', 'Female', 'Other')"),
    )

    def __repr__(self):
        return f'<Doctor {self.first_name} {self.last_name}>'