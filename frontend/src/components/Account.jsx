import React, { useState, useEffect } from 'react';
import '../assets/css/Account.css';
import ChangePassword from './ChangePassword';
import ConfirmModifications from './ConfirmModifications';
import DeleteAccount from './DeleteAccount' 
import { useJwt } from "react-jwt";
import accountData from '../assets/components-data/accountData.json';
import { useToken } from '../hooks/useToken';
import MyDiagnoses from './MyDiagnoses';
import { useObtainData } from "../hooks/useObtainData";

const Account = ({ setView, setIsLogged, language }) => {
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [image_url, setImage_url] = useState('');

  const {token, messageToken } = useToken();   // Usamos el hook de token para obtener el token
  const { decodedToken, isExpired } = useJwt(token || '');


  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [confirmModifications, setConfirmModifications] = useState(false);
  const [myDiagnoses, setMyDiagnoses] = useState(false);
  // Usados para cambiar el idioma del contenido
  const [content, setContent] = useState(accountData[language]);

  // Dependiendo del idioma, se muestra un texto u otro
  useEffect(() => {
    setContent(accountData[language]);
  }, [language]);

  useObtainData(token, decodedToken, isExpired, setFirstName, setLastName, setEmail, setDni, setPhone, setAddress, setBirthDate, setNationality, setProvince, setLocality, setPostalCode, setGender, setImage_url, setMessage);

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
        setImage_url(data.image_url);
      } catch (error) {
        console.error('Error uploading the image:', error);
      }
    }
  };


  const handleAccount = async (e) => {
    e.preventDefault();
  };

  const FormGroup = ({ label, value, onChange, type = "text", options }) => (
    <div className="form-group">
      <label>{label}</label>
      {type === "select" ? (
        <select value={value} onChange={onChange} required>
          <option value="">{label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} value={value} onChange={onChange} />
      )}
    </div>
  );

  const SidebarItem = ({ icon, label, onClick, className = "" }) => (
    <li onClick={onClick} className={className}>
      <i className={icon}></i> {label}
    </li>
  );

  return (
    <section id="account" className="contentAccount">
      <div className="sidebar">
        <div className="logo">{content.yourProfile}</div>
        <ul>
          <SidebarItem icon="fa-solid fa-notes-medical" label={content.myDiagnoses} onClick={() => setMyDiagnoses(true)} />
          <SidebarItem icon="fa-solid fa-key" label={content.changePassword} onClick={() => setChangePasswordModalOpen(true)} />
          <SidebarItem icon="fa-solid fa-trash" label={content.deleteAccount} onClick={() => setDeleteAccount(true)} className="delete" />
        </ul>
        <ul>
          <SidebarItem icon="fa-solid fa-right-to-bracket" label={content.mainPage} onClick={() => setView('home')} />
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
                {image_url && (
                    <div>
                      <br/>
                      <img
                          src={image_url}
                          className="profile-pic"
                          alt="Uploaded"
                          style={{maxWidth: '200px', borderRadius: '50%'}}
                      />
                    </div>
                )}
                {image_url && (
                  <label htmlFor="file-upload" className="custom-file-upload">
                    {content.changeImage}
                </label>
                )}
                {!image_url && (
                  <label htmlFor="file-upload" className="custom-file-upload">
                    {content.profileImage}
                </label>
                )}
              <br/>
            </div>
            </div>
            <br></br>
            <form className="horizontal-form" onSubmit={handleAccount}>
              <div className="account-form">
                <FormGroup label={content.name} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <FormGroup label={content.lastName} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <FormGroup label={content.id} value={dni} onChange={(e) => setDni(e.target.value)} />
                <FormGroup label={content.email} value={email} onChange={(e) => setEmail(e.target.value)} />
                <FormGroup label={content.phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
                <FormGroup label={content.address} value={address} onChange={(e) => setAddress(e.target.value)} />
                <FormGroup label={content.birthDate} type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                <FormGroup label={content.nationality} value={nationality} onChange={(e) => setNationality(e.target.value)} />
                <FormGroup label={content.province} value={province} onChange={(e) => setProvince(e.target.value)} />
                <FormGroup label={content.locality} value={locality} onChange={(e) => setLocality(e.target.value)} />
                <FormGroup label={content.postalCode} value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                <FormGroup
                  label={content.gender}
                  type="select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  options={[content.male, content.female, content.other]}
                />
                <button type="submit" className="submit-button" onClick={() => setConfirmModifications(true)}>
                  {content.saveChanges}
                </button>
              </div>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </div>

      {/* Modal components */}
      <ChangePassword language={language} isOpen={isChangePasswordModalOpen} onClose={() => setChangePasswordModalOpen(false)} />
      <ConfirmModifications
        notConfirmed={confirmModifications}
        confirmed={() => setConfirmModifications(false)}
        firstName={firstName}
        lastName={lastName}
        email={email}
        phone={phone}
        dni={dni}
        address={address}
        nationality={nationality}
        province={province}
        locality={locality}
        birthDate={birthDate}
        postalCode={postalCode}
        gender={gender}
        message={message}
        language={language}
      />
      <DeleteAccount setView={setView} setIsLogged={setIsLogged} Delete={deleteAccount} del={() => setDeleteAccount(false)} language={language} />
      <MyDiagnoses isOpen={myDiagnoses} onClose={() => setMyDiagnoses(false)} language={language} />
    </section>
  );
};

export default Account;