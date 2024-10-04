from ..init_db import db
from datetime import datetime

class Diagnostic(db.Model):
    __tablename__ = 'diagnostic'
    cod = db.Column(db.Integer, primary_key=True, autoincrement=True)
    res = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    date_result = db.Column(db.Date, default=datetime.utcnow)
    image_diagnostic = db.Column(db.String(255), nullable=False)
    dni = db.Column(db.Integer, db.ForeignKey('patient.dni'), nullable=False)

    patient = db.relationship('Patient', backref=db.backref('diagnostics', lazy=True))

    def __repr__(self):
        return f'<Diagnostic cod={self.cod} res={self.res}>'