from ..init_db import db

class Clinic(db.Model):
    __tablename__ = 'clinic'
    clinic_number = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    phone_number = db.Column(db.Integer, nullable=False, check=db.CheckConstraint('phone_number > 0'))
    province = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f'<Clinic {self.name}>'