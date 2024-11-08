import React, { useState, useEffect } from 'react';
import "../assets/css/Alert.css";
import alertData from "../assets/components-data/alertData.json";

const Alert = ({ setView, language }) => {
    const [content, setContent] = useState(alertData[language]);

  useEffect(() => {
    setContent(alertData[language]);
  }, [language]);

  return (
    <div className="modal-overlay">
    <div className="modal-content">
        <h1>{content.alertMessage}</h1>
        <div className="modal-buttons">
            <button className="login-button" onClick={() => setView('login')}>{content.loginMessage}</button>
            <button className="back-button" onClick={() => setView('home')}>{content.backMessage}</button>
        </div>
    </div>
    </div>
  );
};

export default Alert;