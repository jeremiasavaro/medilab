import sys
import os
import pytest
from datetime import date

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from factory.__init__ import *
from config.config import TestingConfig  # Import the TestingConfig class

@pytest.fixture
def app():
    app = create_app(TestingConfig)
    
    with app.app_context():
        
        db.create_all()
    
        test_doctor = Doctor(
            dni=12345678,  
            speciality="Cardiology",  
            first_name="Jane",  
            last_name="Doe",  
            email="jane.doe@example.com",  
            phone_number=1234567890,  
            date_birth=date(1985, 5, 15),  
            age=39, 
            gender="Female"  
        )        
        
        db.session.add(test_doctor)
        db.session.commit()

    yield app

    with app.app_context():
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()