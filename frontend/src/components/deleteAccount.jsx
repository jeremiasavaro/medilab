import React, { useState, useEffect } from 'react';
import "../assets/css/deleteAccount.css";
import deleteAccData from "../assets/components-data/deleteAccountData.json"
import {useJwt} from "react-jwt";
import {useToken} from "../hooks/useToken";

const DeleteAccount = ({ setIsLogged, setView, Delete, del, language  }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [message, setMessage] = useState('');
    // Usados para cambiar el idioma del contenido
    const [content, setContent] = useState(deleteAccData[language]);
    const {token, messageToken} = useToken();
    const {decodedToken, isExpired} = useJwt(token);

    // Dependiendo del idioma, se muestra un texto u otro
    useEffect(() => {
        setContent(deleteAccData[language]);
    }, [language]);

    if (!Delete) return null;

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        if (token && decodedToken) {
            try {
                const response = await fetch('http://127.0.0.1:5000/user/deleteAccount', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify({currentPassword}),
                });

                const data = await response.json();

                if (response.ok) {
                    setMessage(data.message);
                    setTimeout(() => {
                        del();
                        setView("home");
                        setIsLogged(false);
                    }, 2000);
                } else {
                    setMessage(data.error);
                }
            } catch (error) {
                setMessage('Error en la eliminación de la cuenta');
            }
        }
    };

    return (
        <div className="modal-overlay-deleteAccount">
            <div className="modal-content-deleteAccount">
                <form onSubmit={handleDeleteAccount}>
                    <div className="form-group">
                        <label htmlFor="currentPassword" className="changes">{content.confirmDelete}</label>
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
                        <button type="button" onClick={del}>{content.cancel}</button>
                        <button type="submit">{content.confirm}</button>
                    </div>
                    {message && <p className="message">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default DeleteAccount;
