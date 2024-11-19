import React, { useState, useEffect } from 'react';
import "../assets/css/changePassword.css"
import changePasswordData from "../assets/components-data/changePasswordData.json";
import {useJwt} from "react-jwt";
import { useToken } from '../hooks/useToken';

// Password input component
function PasswordInput({id, content, value, handleChange}) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{content}</label>
      <input
        type="password"
        id={id}
        value={value}
        onChange={handleChange}
        required
      />
    </div>
  );
}

const ChangePassword = ({ isOpen, onClose, setChangePasswordModalOpen, language }) => {
  // State variables for form inputs and messages
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repNewPassword, setRepNewPassword] = useState('');
  const [message, setMessage] = useState('');

  // Get token and decode it
  const {token, messageToken} = useToken();
  const {decodedToken, isExpired } = useJwt(token || '');

  // State to hold the content based on the selected language
  const [content, setContent] = useState(changePasswordData[language]);
  
  useEffect(() => {
    setContent(changePasswordData[language]);
  }, [language]);

  // Return null if modal is not open
  if (!isOpen) return null;

  // Handle password change form submission
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (token && decodedToken) {
      try {
        const response = await fetch('http://127.0.0.1:5000/user/change_password', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          body: JSON.stringify({currentPassword, newPassword, repNewPassword}),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(data.message);
          setTimeout(() => onClose(), 1000); // Close the modal after 1 second to allow the message to be read
        } else {
          setMessage(data.error);
        }
      } catch (error) {
        setMessage('Error changing password');
      }
    }
  };

  return (
    <div className="modal-overlay-changePassword">
      <div className="modal-content-changePassword">
        <h1 className='h1-changePassword'><b>{content.title}</b></h1>
        <br></br>
        <form onSubmit={handleChangePassword}>
          <PasswordInput id={"currentPassword"} content={content.currentPassword} value={currentPassword} handleChange={(e) => setCurrentPassword(e.target.value)}/>
          <PasswordInput id={"newPassword"} content={content.newPassword} value={newPassword} handleChange={(e) => setNewPassword(e.target.value)}/>
          <PasswordInput id={"repNewPassword"} content={content.confirmPassword} value={repNewPassword} handleChange={(e) => setRepNewPassword(e.target.value)}/>
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>{content.cancel}</button>
            <button type="submit">{content.changePassword}</button>
          </div>
          {message && <p className="message-changePassword">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;