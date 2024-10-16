import React, { useState } from 'react';
import "../assets/css/confirmModifications.css"

const ConfirmModifications = ({ firstName, lastName, address, email, dni, phone, birthDate,
    nationality, province, locality, postalCode, gender, confirmed, notConfirmed, setConfirmModifications }) => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [message, setMessage] = useState('');

    if (!notConfirmed) return null;


    const handleConfirmModifications = async (e) => {
      e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:5000/account', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({currentPassword, firstName, lastName, address, email, dni, phone, birthDate,
                nationality, province, locality, postalCode, gender,}),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMessage(data.message);
                setTimeout(() => confirmed(), 2000); 
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage('Error en la modificacion de datos');
        }
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <form onSubmit={handleConfirmModifications}>
            <div className="form-group">
              <label htmlFor="currentPassword" className = "changes">Confirm changes</label>
              <br></br>
                  <input
                    type="password"
                    id="currentPassword"
                    placeholder='Current password'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
            </div>
            <div className="modal-buttons">
                <button type="button" onClick={confirmed}>Cancel</button>
                <button type="submit">Confirm</button>
            </div>
            {message && <p className = "message">{message}</p>}
          </form>
        </div>
      </div>
    );
  };
  
  export default ConfirmModifications;