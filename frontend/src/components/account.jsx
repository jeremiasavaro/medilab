import React, { useState, useEffect } from 'react';
import '../assets/css/Account.css';
import ChangePassword from './changePassword';
import ConfirmModifications from './confirmModifications';
import DeleteAccount from './deleteAccount' 
import { useJwt } from "react-jwt";
import accountData from '../assets/components-data/accountData.json';

const Account = ({ setView, setIsLoged, language }) => {
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
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [confirmModifications, setConfirmModifications] = useState(false);
  // Usados para cambiar el idioma del contenido
  const [content, setContent] = useState(accountData[language]);

  // Dependiendo del idioma, se muestra un texto u otro
  useEffect(() => {
    setContent(accountData[language]);
  }, [language]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/auth/obtainToken', {
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
          const response = await fetch('http://127.0.0.1:5000/user/obtainData', {
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
            setImageUrl(data.imagePatient);
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
        const response = await fetch('http://localhost:5000/image/upload_image', {
          method: 'POST',
          headers: {
            'Authorization': token,
          },
          body: formData,
        });

        const data = await response.json();
        setImageUrl(data.image_url);

      } catch (error) {
        console.error('Error uploading the image:', error);
      }
    }
  };

  const handleAccount = async (e) => {
    e.preventDefault();
  };

  return (
    <section id="account" className='contentAccount'>
      <div className="sidebar">
        <div className="logo">{content.yourProfile}</div>
        <ul>
          <li><i className="fa-solid fa-notes-medical"></i>{content.myDiagnoses}</li>
          <li onClick={() => setChangePasswordModalOpen(true)}>
            <i className="fa-solid fa-key"></i>{content.changePassword}
          </li>
          <li className= "delete" onClick={() => setDeleteAccount(true)}><i className="fa-solid fa-trash"></i>{content.deleteAccount}</li>
        </ul>
        <ul>
          <li onClick={() => setView('home')}><i className="fa-solid fa-right-to-bracket"></i>{content.mainPage}</li>
        </ul>
      </div>
      <div className="account-container">
        <div className="account-content">
          <h1><b>{content.personalData}</b></h1>
          <div className="profile-section">
            <div className="profile-info">
              <div>
                <input
                    id="file-upload"
                    type="file"
                    style={{display: 'none'}}
                    onChange={handleFileChange}
                />
                {imageUrl && (
                    <div>
                      <br/>
                      <img
                          src={imageUrl}
                          className="profile-pic"
                          alt="Uploaded"
                          style={{maxWidth: '200px', borderRadius: '50%'}}
                      />
                    </div>
                )}
                {imageUrl && (
                  <label htmlFor="file-upload" className="custom-file-upload">
                    {content.changeImage}
                </label>
                )}
                {!imageUrl && (
                  <label htmlFor="file-upload" className="custom-file-upload">
                    {content.profileImage}
                </label>
                )}
              </div>

              <br/>
            </div>
            <form className="horizontal-form" onSubmit={handleAccount}>
              <div className="account-form">
                {/* Campos del formulario */}
                <div className="form-group">
                  <label>{content.name}</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                </div>
                <div className="form-group">
                  <label>{content.lastName}</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{content.id}</label>
                  <input value={dni}/>
                </div>
                <div className="form-group">
                  <label>{content.email}</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{content.phone}</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{content.address}</label>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{content.birthDate}</label>
                  <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{content.nationality}</label>
                  <input value={nationality} onChange={(e) => setNationality(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{content.province}</label>
                  <input value={province} onChange={(e) => setProvince(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{content.locality}</label>
                  <input value={locality} onChange={(e) => setLocality(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{content.postalCode}</label>
                  <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{content.gender}</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">{content.select}</option>
                    <option value="Male">{content.male}</option>
                    <option value="Female">{content.female}</option>
                    <option value="Other">{content.other}</option>
                  </select>
                </div>
                <button type="submit" className="submit-button" onClick={() => setConfirmModifications(true)}>{content.saveChanges}</button>
              </div>
            </form>
            {message && <p className = "message">{message}</p>}
          </div>
        </div>
      </div>
      <ChangePassword language={language} isOpen={isChangePasswordModalOpen} onClose={() => setChangePasswordModalOpen(false)}
      />
      <ConfirmModifications notConfirmed={confirmModifications} confirmed = {() => setConfirmModifications(false)} firstName = {firstName} lastName = {lastName} 
      email = {email} phone = {phone} dni = {dni} address = {address} nationality = {nationality} province = {province} locality = {locality} birthDate = {birthDate}
      postalCode = {postalCode} gender = {gender} message = {message} language={language}/>
      <DeleteAccount setView = {setView} setIsLoged = {setIsLoged} Delete = {deleteAccount} del = {() => setDeleteAccount(false)} language={language}/>
    </section>
  );
};

export default Account;