import React from 'react';
import "../assets/css/Alert.css";

const Alert = ({ setView }) => {
  return (
    <div className="modal-overlay">
    <div className="modal-content">
        <h1>Sorry, you must be logged in to access this section.</h1>
        <div className="modal-buttons">
            <button className="login-button" onClick={() => setView('login')}>Go to log in</button>
            <button className="back-button" onClick={() => setView('home')}>Back to main page</button>
        </div>
    </div>
    </div>
  );
};

export default Alert;