import React, { useState, useEffect } from 'react';
import "../assets/css/confirmModifications.css"
import confirmModData from '../assets/components-data/confirmModificationsData.json';

const ConfirmModifications = ({ firstName, lastName, address, email, dni, phone, birthDate,
    nationality, province, locality, postalCode, gender, confirmed, notConfirmed, setConfirmModifications, language }) => {

    // State variables for form input and messages
    const [currentPassword, setCurrentPassword] = useState('');
    const [message, setMessage] = useState('');
    // State to hold the content based on the selected language
    const [content, setContent] = useState(confirmModData[language]);

    // Update content when language changes
    useEffect(() => {
        setContent(confirmModData[language]);
    }, [language]);

    // Return null if modifications are not confirmed
    if (!notConfirmed) return null;

    // Handle form submission for confirming modifications
    const handleConfirmModifications = async (e) => {
      e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:5000/user/account', {
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
                setTimeout(() => confirmed(), 2000); // Confirm modifications after 2 seconds
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage('Error in data modification');
        }
    };

    return (
      <div className="modal-overlay-confirmModifications">
        <div className="modal-content-confirmModifications">
          <form onSubmit={handleConfirmModifications}>
            <div className="form-group">
              <label htmlFor="currentPassword" className="changes">{content.confirmChanges}</label>
              <br></br>
                  <input
                    type="password"
                    id="currentPassword"
                    placeholder={content.currentPassword}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
            </div>
            <div className="modal-buttons">
                <button type="button" onClick={confirmed}>{content.cancel}</button>
                <button type="submit">{content.confirm}</button>
            </div>
            {message && <p className = "message">{message}</p>}
          </form>
        </div>
      </div>
    );
  };

  export default ConfirmModifications;