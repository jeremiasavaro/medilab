# tests/test_routes.py
from conftest import *


def calculate_age(dateBirth):
    today = datetime.today()
    birth_date = datetime.strptime(dateBirth, "%Y-%m-%d")
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age

"""
def test_obtainToken(client):
    response = client.get('/obtainToken')

    assert response.status_code == 200
    assert response.is_json
    data = response.get_json()
    assert 'token' in data
    assert data['token'] == 'token'
"""

def test_login_failure_missing_data(client):
    invalid_data = {
        'dni': '12345678',
        'password': ''
    }
    
    response = client.post('/login', json=invalid_data)

    json_data = response.get_json()
    assert response.status_code == 400
    assert json_data['error'] == 'Faltan datos'

def test_contact(client):
    data = {
        'name' : 'testuser',
        'email' : 'testuser@gmail.com',
        'subject' : 'Congratulations',
        'message' : 'Congratulations for the app'
    }
    response = client.post('/contact', json=data)

    assert response.status_code == 200
    assert response.json == {'status': 'success', 'message': 'Data received successfully'} 



def test_login_failure_nonexistent_user(client):
    invalid_data = {
        'dni': '87654321',
        'password': 'newpassword'
    }
    
    response = client.post('/login', json=invalid_data)

    json_data = response.get_json()
    assert response.status_code == 401
    assert json_data['error'] == 'No hay un usuario registrado con ese DNI'

def test_login_success(client):
    valid_data = {
        'dni': '12345678',
        'password': 'testpass'
    }
    response = client.post('/login', json=valid_data)

    json_data = response.get_json()
    assert response.status_code == 200
    assert json_data['message']  == 'Login exitoso'
