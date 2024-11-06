# tests/test_inquiries.py
from conftest import *

# tests for endpoint contact
def test_contact_valid_data(client):
    data = {
        'firstName' : 'user_name',
        'lastName' : 'user_lastname',
        'email' : 'testuser@gmail.com',
        'subject' : 'Congratulations',
        'userMessage' : 'Fraudulent app'
    }
    response = client.post('/inquiries/contact', json=data)

    assert response.status_code == 200
    assert response.json == {'message': 'Contact message sent successfully'} 

def test_contact_invalid_data(client):
    data = {
        'firstName' : 'user_name',
        'lastName' : 'user_lastname',
        'email' : 'testuser@gmail.com',
        'subject' : 'Congratulations',
    }

    response = client.post('/inquiries/contact', json=data)

    assert response.status_code == 400
    assert response.json == {'error': 'Data missing'} 


# tests for endpoint doctors
def test_doctors_table(client):
    response = client.get('/inquiries/doctors')

    assert response.status_code == 200

    doctors_list = response.get_json()
    
    assert isinstance(doctors_list, list)
    assert len(doctors_list) > 0
    
    first_doctor = doctors_list[0]

    assert first_doctor['dni'] == 12345678  
    assert first_doctor['first_name'] == "Jane"  
    assert first_doctor['last_name'] == "Doe"  
    assert first_doctor['speciality'] == "Cardiology" 
    assert first_doctor['email'] == "jane.doe@example.com"
