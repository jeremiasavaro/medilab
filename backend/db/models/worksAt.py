from ..init_db import db

class WorksAt(db.Model):
    __tablename__ = 'works_at'
    clinic_number = db.Column(db.Integer, db.ForeignKey('clinic.clinic_number'), primary_key=True, nullable=False)
    doctor_dni = db.Column(db.Integer, db.ForeignKey('doctor.dni'), primary_key=True, nullable=False)

    clinic = db.relationship('Clinic', backref=db.backref('doctors', lazy=True))
    doctor = db.relationship('Doctor', backref=db.backref('clinics', lazy=True))

    def __repr__(self):
        return f'<WorksAt clinic_number={self.clinic_number} doctor_dni={self.doctor_dni}>'