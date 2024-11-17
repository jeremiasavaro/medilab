# tests/test_auth.py
from conftest import *

data = {
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

# tests for endpoint obtainToken
def test_obtain_token(client):
    response = client.get('/auth/obtainToken')

    assert response.status_code == 200
    assert 'token' in response.json


# tests for endpoint register
def test_user_registration(client):
    response = client.post('/auth/register', json=data)

    assert response.status_code == 200
    assert response.json == {'message': 'Register completed successfully'}


def test_user_registration_missing_data(client):
    missing_data = {
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
        'postalCode': '90001'
    }
    response = client.post('/auth/register', json=missing_data)

    assert response.status_code == 400
    assert response.json == {'error': 'Data missing'}


def test_user_registration_password_dont_match(client):
    invalid_data = {
        'firstName': 'John',
        'lastName': 'Doe',
        'password': 'secure_password',
        'repPassword': 'wrong_password',
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
    response = client.post('/auth/register', json=invalid_data)

    assert response.status_code == 400
    assert response.json == {'error': 'Passwords don\'t match'}


def test_user_registration_user_already_exists(client):
    response = client.post('/auth/register', json=data)
    response = client.post('/auth/register', json=data)

    assert response.status_code == 409
    assert response.json == {'error': 'User already exists'}


# tests for endpoint login
def test_user_login(client):
    client.post('/auth/register', json=data)

    # Now attempt to login
    login_data = {
        'dni': '12345678',
        'password': 'secure_password'
    }
    response = client.post('/auth/login', json=login_data)

    assert response.status_code == 200
    assert 'token' in response.json


def test_user_login_missing_credentials(client):
    invalid_data = {
        'dni': '12345678',
    }
    response = client.post('/auth/login', json=invalid_data)

    assert response.status_code == 400
    assert response.json == {'error': 'Data missing'}

def test_user_login_invalid_dni(client):
    client.post('/auth/register', json=data)
    valid_data = {
        'dni': '12345677',
        'password': 'secure_password'
    }
    response = client.post('/auth/login', json=valid_data)

    assert response.status_code == 401
    assert response.json == {'error': 'No user registered with that DNI'}


def test_user_login_incorrect_credentials(client):
    client.post('/auth/register', json=data)

    login_data = {
        'dni': '12345678',
        'password': 'wrong_password'
    }
    response = client.post('/auth/login', json=login_data)

    assert response.status_code == 401
    assert response.json == {'error': 'Incorrect credentials'}
