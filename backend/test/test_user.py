#test/test_user.py
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

# tests for endpoint obtainData
def test_obtain_data(client):
    client.post('/auth/register', json=register_data)
    
    login_data = {
        'dni': '12345678',
        'password': 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    token = login_response.get_json().get('token')  
    headers = {"Authorization": token}

    response = client.get('/user/obtainData', headers=headers)

    data = response.get_json()
    
    assert response.status_code == 200
    assert data['dni'] == 12345678


def test_obtain_data_invalid_token(client):
    client.post('/auth/register', json=register_data)
    
    login_data = {
        'dni': '12345678',
        'password': 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    response = client.get('/user/obtainData')
    
    assert response.status_code == 401
    assert response.get_json() == {"error": "Token not found"}
    

# tests for  endpoint account
def test_account(client):
    client.post('/auth/register', json=register_data)

    login_data = {
        'dni' : '12345678',
        'password' : 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    token = login_response.get_json().get('token')
    headers = {'Authorization' : token}

    new_data = {
        'firstName': 'Paul',
        'lastName': 'Doe',
        'address': '123 Main St',
        'email': 'newuser@example.com',
        'dni': '12345678',
        'phone': '1234567890',
        'birthDate': '1980-01-01',
        'nationality': 'American',
        'province': 'California',
        'locality': 'Los Angeles',
        'postalCode': '90001',
        'gender': 'Male',
        'currentPassword' : 'secure_password'
    }

    response = client.post('/user/account', headers=headers, json=new_data)

    assert response.status_code == 200
    assert response.json == {'message' : 'Data modified successfully'}


def test_account_missing_data(client):
    client.post('/auth/register', json=register_data)

    login_data = {
        'dni' : '12345678',
        'password' : 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    token = login_response.get_json().get('token')
    headers = {'Authorization' : token}

    new_data = {      
        'firstName': 'Paul',
        'lastName': 'Doe',
        'address': '123 Main St',
        'email': 'newuser@example.com',
        'dni': '12345678',
        'phone': '1234567890',
        'birthDate': '1980-01-01',
        'nationality': 'American',
        'province': 'California',
        'locality': 'Los Angeles',
        'postalCode': '90001',
        'gender': 'Male',
        'currentPassword' : 'incorrect_password'
    }

    response = client.post('/user/account', headers=headers, json=new_data)

    assert response.status_code == 400
    assert response.json == {'error' : 'Actual password isn\'t correct'}


def test_account_incorrect_password(client):
    client.post('/auth/register', json=register_data)

    login_data = {
        'dni' : '12345678',
        'password' : 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    token = login_response.get_json().get('token')
    headers = {'Authorization' : token}

    new_data = {
        'lastName': 'Doe',
        'address': '123 Main St',
        'email': 'newuser@example.com',
        'dni': '12345678',
        'phone': '1234567890',
        'birthDate': '1980-01-01',
        'nationality': 'American',
        'province': 'California',
        'locality': 'Los Angeles',
        'postalCode': '90001',
        'gender': 'Male',
        'currentPassword' : 'secure_password'
    }

    response = client.post('/user/account', headers=headers, json=new_data)

    assert response.status_code == 400
    assert response.json == {'error' : 'Data missing'}


# tests of endpoint change_password 
def test_change_password(client):
    client.post('/auth/register', json=register_data)

    login_data = {
        'dni' : '12345678',
        'password' : 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    token = login_response.get_json().get('token')

    headers = {'Authorization' : token}

    change_password_data = {
        'currentPassword' : 'secure_password',
        'newPassword' : 'new_secure_password',
        'repNewPassword' : 'new_secure_password'
    }

    response = client.post('/user/change_password', headers=headers, json=change_password_data)

    assert response.status_code == 200
    assert response.json == {'message' : 'Password updated successfully'}


def test_change_password_missing_data(client):
    client.post('/auth/register', json=register_data)

    login_data = {
        'dni' : '12345678',
        'password' : 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    token = login_response.get_json().get('token')

    headers = {'Authorization' : token}

    change_password_data = {
        'currentPassword' : 'secure_password',
        'newPassword' : 'new_secure_password',
    }

    response = client.post('/user/change_password', headers=headers, json=change_password_data)

    assert response.status_code == 400
    assert response.json == {'error': 'Data missing'}


def test_change_password_invalid_token(client):
    client.post('/auth/register', json=register_data)

    login_data = {
        'dni' : '12345678',
        'password' : 'secure_password'
    }

    client.post('/auth/login', json=login_data)

    change_password_data = {
        'currentPassword' : 'secure_password',
        'newPassword' : 'new_secure_password',
        'repNewPassword' : 'new_secure_password'
    }

    response = client.post('/user/change_password', json=change_password_data)

    assert response.status_code == 401
    assert response.get_json() == {"error": "Token not found"}


def test_change_password_dont_match(client):
    client.post('/auth/register', json=register_data)

    login_data = {
        'dni' : '12345678',
        'password' : 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    token = login_response.get_json().get('token')

    headers = {'Authorization' : token}

    change_password_data = {
        'currentPassword' : 'secure_password',
        'newPassword' : 'new_secure_password',
        'repNewPassword' : 'old_secure_password'
    }

    response = client.post('/user/change_password', headers=headers, json=change_password_data)

    assert response.status_code == 400
    assert response.json == {'error': 'Passwords don\'t match'}


def test_change_password_incorrect(client):
    client.post('/auth/register', json=register_data)

    login_data = {
        'dni' : '12345678',
        'password' : 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    token = login_response.get_json().get('token')

    headers = {'Authorization' : token}

    change_password_data = {
        'currentPassword' : 'incorrect_password',
        'newPassword' : 'new_secure_password',
        'repNewPassword' : 'new_secure_password'
    }

    response = client.post('/user/change_password', headers=headers, json=change_password_data)

    assert response.status_code == 400
    assert response.json == {'error' : 'Actual password entered isn\'t correct'}


# tests for endpoint deleteAccount
def test_delete_account(client):
    client.post('/auth/register', json=register_data)

    login_data = {
        'dni' : '12345678',
        'password' : 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    token = login_response.get_json().get('token')

    headers = {'Authorization' : token}  

    delete_account_data = {
        'currentPassword' : 'secure_password'
    }

    response = client.post('/user/deleteAccount', headers=headers, json=delete_account_data)

    assert response.status_code == 200
    assert response.json == {'message' : 'Account deleted successfully'}


def test_delete_account_missing_password(client):
    client.post('/auth/register', json=register_data)

    login_data = {
        'dni' : '12345678',
        'password' : 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    token = login_response.get_json().get('token')

    headers = {'Authorization' : token}  

    delete_account_data = {}

    response = client.post('/user/deleteAccount', headers=headers, json=delete_account_data)

    assert response.status_code == 400
    assert response.json == {'error' : 'Data missing'}    


def test_delete_account_incorrect_password(client):
    client.post('/auth/register', json=register_data)

    login_data = {
        'dni' : '12345678',
        'password' : 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    token = login_response.get_json().get('token')

    headers = {'Authorization' : token}  

    delete_account_data = {
        'currentPassword' : 'incorrect_password'
    }

    response = client.post('/user/deleteAccount', headers=headers, json=delete_account_data)

    assert response.status_code == 400
    assert response.json == {'error' : 'Actual password entered isn\'t correct'}


def test_delete_account_invalid_token(client):
    client.post('/auth/register', json=register_data)

    login_data = {
        'dni' : '12345678',
        'password' : 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data) 

    delete_account_data = {
        'currentPassword' : 'secure_password'
    }

    response = client.post('/user/deleteAccount', json=delete_account_data)

    assert response.status_code == 401
    assert response.get_json() == {"error": "Token not found"}

