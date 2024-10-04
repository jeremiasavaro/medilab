from ..database import db

class Clinic(db.Model):
    __tablename__ = 'clinic'
    clinic_number = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    phone_number = db.Column(db.Integer, nullable=False)
    province = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String(255), nullable=False)

    __table_args__ = (
        db.CheckConstraint('phone_number > 0', name='phone_number_positive'),
    )

    def __repr__(self):
        return f'<Clinic {self.name}>'