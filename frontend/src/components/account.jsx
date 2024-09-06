// src/components/Account.jsx
import React from 'react';
import '../assets/css/Account.css';

const Account = ({setView}) => {
  return (
    <section id = "account">
        <div className="sidebar">
        <div className="logo">Your profile</div>
        <ul>
          <li><i class="fa-solid fa-notes-medical"></i> My diagnoses</li>
          <li><i class="fa-solid fa-key"></i> Change password</li>
          <li><i class="fa-solid fa-gears"></i> Modify your data</li>
        </ul>
      </div>
        <div className="account-container">
        <div className="account-content">
        <h1><b>Personal data</b></h1>
        <br></br>
            <div className="profile-section">
            <div className="profile-info">
                <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="profile-pic"
                />
                <h3>Mateo Cornejo</h3>
                <br></br>
            </div>
            <div className="account-form">
                <div className="form-group">
                    <label>Name</label>
                    <p className="form-value">Mateo</p> {/* Texto no editable */}
                </div>
                <div className="form-group">
                    <label>Last name</label>
                    <p className="form-value">Cornejo</p> {/* Texto no editable */}
                </div>
                <div className="form-group">
                    <label>DNI</label>
                    <p className="form-value">45701678</p> {/* Texto no editable */}
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <p className="form-value">ccornejomateo@gmail.com</p> {/* Texto no editable */}
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <p className="form-value">3586002557</p> {/* Texto no editable */}
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <p className="form-value">Pje Atenas 629</p> {/* Texto no editable */}
                </div>
                <div className="form-group">
                    <label>Birth date</label>
                    <p className="form-value">08/06/2004</p> {/* Texto no editable */}
                </div>
                <div className="form-group">
                    <label>Nationality</label>
                    <p className="form-value">Argentina</p> {/* Texto no editable */}
                </div>
                <div className="form-group">
                    <label>Province</label>
                    <p className="form-value">Cordoba</p> {/* Texto no editable */}
                </div>
                <div className="form-group">
                    <label>Locality</label>
                    <p className="form-value">Rio Cuarto</p> {/* Texto no editable */}
                </div>
                <div className="form-group">
                    <label>Postal code</label>
                    <p className="form-value">X5800</p> {/* Texto no editable */}
                </div>
                <div className="form-group">
                    <label>Gender</label>
                    <p className="form-value">Male</p> {/* Texto no editable */}
                </div>
            </div>
            </div>
        </div>
        </div>
    </section>
  );
};

export default Account;