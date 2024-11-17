import React, { useState, useEffect } from 'react';
import "../assets/css/changePassword.css"
import changePasswordData from "../assets/components-data/changePasswordData.json";
import {useJwt} from "react-jwt";
import { useToken } from '../hooks/useToken';

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

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repNewPassword, setRepNewPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const {token, messageToken} = useToken();
  const {decodedToken, isExpired } = useJwt(token || '');
  
  // Usados para cambiar el idioma del contenido
  const [content, setContent] = useState(changePasswordData[language]);

  if (!isOpen) return null;

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
          setTimeout(() => onClose(), 1000); // Cierra el modal después de 1 segundo para permitir que el mensaje se lea
        } else {
          setMessage(data.error);
        }
      } catch (error) {
        setMessage('Error en el cambio de contraseña');
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