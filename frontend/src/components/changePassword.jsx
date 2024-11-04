import React, { useState, useEffect } from 'react';
import "../assets/css/changePassword.css"
import changePasswordData from "../assets/components-data/changePasswordData.json";
import {useJwt} from "react-jwt";

const ChangePassword = ({ isOpen, onClose, setChangePasswordModalOpen, language }) => {

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repNewPassword, setRepNewPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const [token, setToken] = useState('');
  const { decodedToken, isExpired } = useJwt(token);
  
  // Usados para cambiar el idioma del contenido
  const [content, setContent] = useState(changePasswordData[language]);

  // Dependiendo del idioma, se muestra un texto u otro
  useEffect(() => {
    setContent(changePasswordData[language]);
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
          <div className="form-group">
            <label htmlFor="currentPassword">{content.currentPassword}</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
              />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">{content.newPassword}</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
              />
          </div>
          <div className="form-group">
            <label htmlFor="repNewPassword">{content.confirmPassword}</label>
                <input
                  type="password"
                  id="repNewPassword"
                  value={repNewPassword}
                  onChange={(e) => setRepNewPassword(e.target.value)}
                  required
              />
          </div>
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