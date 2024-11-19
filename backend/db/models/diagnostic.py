from ..database import db
from datetime import datetime

class Diagnostic(db.Model):
    __tablename__ = 'diagnostic'
    cod = db.Column(db.Integer, primary_key=True, autoincrement=True)
    res = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    date_result = db.Column(db.Date, default=datetime.utcnow)
    image_diagnostic = db.Column(db.String(255), nullable=False)
    dni = db.Column(db.Integer, db.ForeignKey('patient.dni', ondelete="CASCADE"), nullable=False)
    pdf_data = db.Column(db.LargeBinary, nullable=True)

    patient = db.relationship(
        'Patient', 
        backref=db.backref('diagnostics', lazy=True, cascade="all, delete-orphan")
    )

    def __repr__(self):
        return f'<Diagnostic cod={self.cod} res={self.res} description={self.description}> image_diagnostic={self.image_diagnostic} dni={self.dni} date_result={self.date_result}'