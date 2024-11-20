# tests/test_inquiries.py
from conftest import *

register_data = {
    'firstName': 'John',
    'lastName': 'Doe',
    'password': 'secure_password',
    'repPassword': 'secure_password',
    'address': '123 Main St',
    'email': 'newuser@example.com',
    'dni': '12345678',
    'phone': '1234567890',
    'birthDate': '1980-01-01',
    'nationality': 'American',
    'province': 'California',
    'locality': 'Los Angeles',
    'postalCode': '90001',
    'gender': 'Male'
}

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

# tests for endpoint my_diagnoses 
def test_my_diagnoses(client):
    client.post('/auth/register', json=register_data)
    
    login_data = {
        'dni': '12345678',
        'password': 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    token = login_response.get_json().get('token')  
    headers = {"Authorization": token}
    
    response = client.get('/inquiries/my_diagnoses', headers=headers)

    data = response.get_json()
    
    assert data[0]['dni'] == 12345678

  
def test_my_diagnoses_invalid_token(client):
    client.post('/auth/register', json=register_data)
    
    login_data = {
        'dni': '12345678',
        'password': 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    token = login_response.get_json().get('token')  
    headers = {"Authorization": token}
    
    response = client.get('/inquiries/my_diagnoses')