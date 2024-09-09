// src/components/Account.jsx
import React from 'react';
import '../assets/css/Account.css';

const Account = ({setView}) => {

  return (
    <section id = "account">
        <div className="sidebar">
        <div className="logo">Your profile</div>
        <ul>
          <li><i className="fa-solid fa-notes-medical"></i> My diagnoses</li>
          <li><i className="fa-solid fa-key"></i> Change password</li>
          <li><i className="fa-solid fa-gears"></i> Modify your data</li>
        </ul>
      </div>
        <div className="account-container">
        <div className="account-content">
        <h1><b>Personal data</b></h1>
        <br></br>
            <div className="profile-section">
            <div className="profile-info">
                <img
                src= "../assets/img/c.jpg"
                className="profile-pic"
                />
                <h3>Mateo Cornejo</h3>
                <br></br>
            </div>
            <div className="account-form">
                <div className="form-group">
                    <label>Name</label>
                    <input value = "Mateo"></input>
                </div>
                <div className="form-group">
                    <label>Last name</label>
                    <input value = "Cornejo"></input>
                </div>
                <div className="form-group">
                    <label>DNI</label>
                    <input value = "45701678"></input>                
                    </div>
                <div className="form-group">
                    <label>Email</label>
                    <input value = "ccornejomateo@gmail.com"></input>
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input value = "3586002557"></input>                
                    </div>
                <div className="form-group">
                    <label>Address</label>
                    <input value = "Pasaje Atenas 629"></input>
                </div>
                <div className="form-group">
                    <label>Birth date</label>
                    <input value = "08/06/2004"></input>                
                    </div>
                <div className="form-group">
                    <label>Nationality</label>
                    <input value = "Argentina"></input>
                </div>
                <div className="form-group">
                    <label>Province</label>
                    <input value = "Cordoba"></input>               
                    </div>
                <div className="form-group">
                    <label>Locality</label>
                    <input value = "Rio Cuarto"></input>
                </div>
                <div className="form-group">
                    <label>Postal code</label>
                    <input value = "X5800"></input>                
                    </div>
                <div className="form-group">
                    <label>Gender</label>
                    <input value = "Male"></input>
                </div>
            </div>
            <button type="submit">Guardar cambios</button>
            </div>
        </div>
        </div>
    </section>
  );
};

export default Account;