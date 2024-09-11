import React, { useState, useEffect } from 'react';
import '../assets/css/Account.css';
import ChangePassword from './changePassword';
import { useJwt } from "react-jwt";

const Account = ({ setView }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [nationality, setNationality] = useState('');
  const [province, setProvince] = useState('');
  const [locality, setLocality] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [gender, setGender] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const { decodedToken, isExpired } = useJwt(token);

  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/obtainToken', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) {
          setToken(data.token);
        } else {
          setMessage("No se pudo obtener el token");
        }
      } catch (error) {
        setMessage('Error al obtener el token');
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const setData = async () => {
      if (token && decodedToken) {
        try {
          const response = await fetch('http://127.0.0.1:5000/obtainData', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            },
          });

          const data = await response.json();
          if (response.ok) {
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setDni(data.dni);
            setEmail(data.email);
            setPhone(data.phone);
            setAddress(data.address);
            setBirthDate(data.birthDate);
            setNationality(data.nationality);
            setProvince(data.province);
            setLocality(data.locality);
            setPostalCode(data.postalCode);
            setGender(data.gender);
          } else {
            setMessage("No se pudo obtener los datos");
          }
        } catch (error) {
          setMessage('Error al obtener los datos');
        }
      }
    }

    setData();
  }, [token, decodedToken, isExpired]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/upload_image', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        setImageUrl(data.image_url); // Asumiendo que el backend devuelve 'image_url'

      } catch (error) {
        console.error('Error uploading the image:', error);
      }
    }
  };
  
  const handleAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName, lastName, address, email, dni, phone, birthDate,
          nationality, province, locality, postalCode, gender,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Los datos no pudieron modificarse');
    }
  };

  return (
    <section id="account">
      <div className="sidebar">
        <div className="logo">Your profile</div>
        <ul>
          <li><i className="fa-solid fa-notes-medical"></i> My diagnoses</li>
          <li onClick={() => setChangePasswordModalOpen(true)}>
            <i className="fa-solid fa-key"></i> Change password
          </li>
        </ul>
        <ul>
          <li onClick={() => setView('home')}><i className="fa-solid fa-right-to-bracket"></i>  Back to main page</li>
        </ul>
      </div>
      <div className="account-container">
        <div className="account-content">
          <h1><b>Personal data</b></h1>
          <br />
          <div className="profile-section">
            <div className="profile-info">
              <div>
                <input type="file" onChange={handleFileChange} />
                {imageUrl && (
                  <img src={imageUrl} className="profile-pic" alt="Uploaded" style={{ maxWidth: '200px', borderRadius: '50%' }}/>
                )}
              </div>
              <h3>{firstName} {lastName}</h3>
              <br/>
            </div>
            <form className="horizontal-form" onSubmit={handleAccount}>
              <div className="account-form">
                {/* Campos del formulario */}
                <div className="form-group">
                  <label>Name</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Last name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>DNI</label>
                  <input value={dni} onChange={(e) => setDni(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Birth date</label>
                  <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Nationality</label>
                  <input value={nationality} onChange={(e) => setNationality(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Province</label>
                  <input value={province} onChange={(e) => setProvince(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Locality</label>
                  <input value={locality} onChange={(e) => setLocality(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Postal code</label>
                  <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button type="submit" className="submit-button">Guardar cambios</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ChangePassword
        isOpen={isChangePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      />
    </section>
  );
};

export default Account;
