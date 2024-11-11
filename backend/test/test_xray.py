#test/test_xray.py
from conftest import *

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