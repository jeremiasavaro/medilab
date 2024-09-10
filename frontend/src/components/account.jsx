import React, { useState } from 'react';
import '../assets/css/Account.css';
import ChangePassword from './changePassword';

const Account = () => {

  const [name, setName] = useState('Mateo');
  const [lastName, setLastName] = useState('Cornejo');
  const [dni, setDni] = useState('45701678');
  const [email, setEmail] = useState('ccornejomateo@gmail.com');
  const [phone, setPhone] = useState('3586002557');
  const [address, setAddress] = useState('Pasaje Atenas 629');
  const [birthDate, setBirthDate] = useState('2004-06-08');
  const [nationality, setNationality] = useState('Argentina');
  const [province, setProvince] = useState('Cordoba');
  const [locality, setLocality] = useState('Rio Cuarto');
  const [postalCode, setPostalCode] = useState('X5800');
  const [gender, setGender] = useState('Male');

  // Estado para controlar la visibilidad del modal
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

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
      </div>
      <div className="account-container">
        <div className="account-content">
          <h1><b>Personal data</b></h1>
          <br />
          <div className="profile-section">
            <div className="profile-info">
              <img src="../assets/img/c.jpg" className="profile-pic" alt="Profile" />
              <h3>Mateo Cornejo</h3>
              <br />
            </div>
            <div className="account-form">
              {/* Campos del formulario */}
              <div className="form-group">
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
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