import React, { useState } from 'react';
import "../assets/css/deleteAccount.css";

const DeleteAccount = ({ setIsLoged, setView, Delete, del }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [message, setMessage] = useState('');

    if (!Delete) return null;

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/user/deleteAccount', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setTimeout(() => {
                    del();
                    setView("home");
                    setIsLoged(false);
                }, 2000);
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage('Error en la eliminación de la cuenta');
        }
    };

    return (
        <div className="modal-overlay-deleteAccount">
            <div className="modal-content-deleteAccount">
                <form onSubmit={handleDeleteAccount}>
                    <div className="form-group">
                        <label htmlFor="currentPassword" className="changes">Confirm delete account</label>
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
                        <button type="button" onClick={del}>Cancel</button>
                        <button type="submit">Confirm</button>
                    </div>
                    {message && <p className="message">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default DeleteAccount;
