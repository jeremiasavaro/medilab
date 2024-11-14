#test/test_xray.py
from conftest import *
from unittest.mock import patch
import requests


def test_xray_diagnosis_no_image_url(client): 
    # Log in to get the token
    login_data = {
        'dni': '12345678',
        'password': 'secure_password'
    }

    login_response = client.post('/auth/login', json=login_data)
    token = login_response.get_json().get('token')
    
    # Properly set the Authorization header
    headers = {"Authorization": token}

    # Make the POST request with the Authorization header
    response = client.post('/xray/xray_diagnosis', headers=headers)  # Use headers here
    
    # Check the response status and content
    assert response.status_code == 400
    assert response.json == {'error': 'No image_url provided'}

@patch('requests.get')
def test_xray_diagnosis_invalid_image_url(mock_get, client):
    # Mock the requests.get to raise a ConnectionError
    mock_get.side_effect = requests.exceptions.ConnectionError("Failed to resolve")

    # Log in to get the token
    login_data = {'dni': '12345678', 'password': 'secure_password'}
    login_response = client.post('/auth/login', json=login_data)
    token = login_response.get_json().get('token')

    # Set the Authorization header
    headers = {"Authorization": token}

    # Pass an invalid image URL
    data = {'image_url': 'https://invalid_url'}
    response = client.post('/xray/xray_diagnosis', headers=headers, data=data)

    # Assert that the response indicates an error
    assert response.status_code == 400
    assert response.json == {'error': 'Error when loading the image'}

def test_xray_diagnosis_missing_authorization(client):
    # Make the POST request without Authorization header
    data = {'image_url': 'https://valid-image-url.com/image.jpg'}
    response = client.post('/xray/xray_diagnosis', data=data)

    # Expect unauthorized (401) access due to missing Authorization header
    assert response.status_code == 401