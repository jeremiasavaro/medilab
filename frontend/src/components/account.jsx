import React, { useState, useEffect } from 'react';
import '../assets/css/Account.css';
import ChangePassword from './changePassword';
import ConfirmModifications from './confirmModifications';
import DeleteAccount from './deleteAccount';

const Account = ({ setView, setIsLoged }) => {
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
  const [imageUrl, setImageUrl] = useState('');

  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [confirmModifications, setConfirmModifications] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/obtainData', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
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
          setMessage('Failed to fetch user data');
        }
      } catch (error) {
        setMessage('An error occurred while fetching user data');
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/upload_image', {
          method: 'POST',
          credentials: 'include',
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
        <div className="logo">Your profile</div>
        <ul>
          <li><i className="fa-solid fa-notes-medical"></i> My diagnoses</li>
          <li onClick={() => setChangePasswordModalOpen(true)}>
            <i className="fa-solid fa-key"></i> Change password
          </li>
          <li className= "delete" onClick={() => setDeleteAccount(true)}><i className="fa-solid fa-trash"></i> Delete account</li>
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
                <label htmlFor="file-upload" className="custom-file-upload">
                  Subir foto de perfil
                </label>
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
              </div>

              <br/>
            </div>
            <form className="horizontal-form" onSubmit={handleAccount}>
              <div className="account-form">
                {/* Campos del formulario */}
                <div className="form-group">
                  <label>Name</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                </div>
                <div className="form-group">
                  <label>Last name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>DNI</label>
                  <input value={dni}/>
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
                <button type="submit" className="submit-button" onClick={() => setConfirmModifications(true)}>Guardar cambios</button>
              </div>
            </form>
            {message && <p className = "message">{message}</p>}
          </div>
        </div>
      </div>
      <ChangePassword isOpen={isChangePasswordModalOpen} onClose={() => setChangePasswordModalOpen(false)}
      />
      <ConfirmModifications notConfirmed={confirmModifications} confirmed = {() => setConfirmModifications(false)} firstName = {firstName} lastName = {lastName} 
      email = {email} phone = {phone} dni = {dni} address = {address} nationality = {nationality} province = {province} locality = {locality} birthDate = {birthDate}
      postalCode = {postalCode} gender = {gender} message = {message} />
      <DeleteAccount setView = {setView} setIsLoged = {setIsLoged} Delete = {deleteAccount} del = {() => setDeleteAccount(false)} />
    </section>
  );
};

export default Account;
