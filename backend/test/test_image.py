# test/test_image.py
import io 
from conftest import *
from unittest.mock import patch

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

def test_image_upload(client):
    client.post('/auth/register', json=register_data)
    
    login_data = {
        'dni': '12345678',
        'password': 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    token = login_response.get_json().get('token')
    headers = {'Authorization' : token}

    with patch('cloudinary.uploader.upload', return_value={'url': 'http://cloudinary.com/test_image_url'}):
        response = client.post(
            '/image/upload_image', 
            headers=headers, 
            data={'file': (io.BytesIO(b"image_data"), 'test_image.jpg')}
        )

    assert response.status_code == 200
    assert response.get_json() == {'image_url': 'http://cloudinary.com/test_image_url'}


def test_image_upload_missing_file(client):
    client.post('/auth/register', json=register_data)
    
    login_data = {
        'dni': '12345678',
        'password': 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    token = login_response.get_json().get('token')
    headers = {'Authorization' : token}

    response = client.post('/image/upload_image', headers=headers)

    assert response.status_code == 400
    assert response.json == {'error' : 'File not found'}


def test_image_upload_invalid_token(client):
    client.post('/auth/register', json=register_data)
    
    login_data = {
        'dni': '12345678',
        'password': 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)

    with patch('cloudinary.uploader.upload', return_value={'url': 'http://cloudinary.com/test_image_url'}):
        response = client.post(
            '/image/upload_image', 
            data={'file': (io.BytesIO(b"image_data"), 'test_image.jpg')}
        )

    assert response.status_code == 401
    assert response.json == {'error' : 'Token not found'}

