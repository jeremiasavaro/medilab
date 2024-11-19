import React, { useState, useEffect } from 'react';
import "../assets/css/Alert.css";
import alertData from "../assets/components-data/alertData.json";

const Alert = ({ setView, language, setIsTransitioning, isTransitioning }) => {
  // State to hold the content based on the selected language
  const [content, setContent] = useState(alertData[language]);

  // Function to handle the transition in effect
  const handleTransitionIn = (targetView) => {
    setIsTransitioning("in");
    setTimeout(() => {
      setIsTransitioning("out");
      setView(targetView);
    }, 1500);
  };

  // Effect to update the content when the language changes
  useEffect(() => {
    setContent(alertData[language]);
    setTimeout(() => {
      setIsTransitioning("null")
    }, 1500);
  }, [language]);

  return (
    <div className="modal-overlay">
      <div className={isTransitioning=="in" ? "transitionIn-activeAlt" : isTransitioning=="out" ? "transitionOut-activeAlt" : "modal-overlay"}>
        <div className="modal-content">
          <h1>{content.alertMessage}</h1>
          <div className="modal-buttons">
              <button className="login-button" onClick={() => handleTransitionIn('login')}>{content.loginMessage}</button>
              <button className="back-button" onClick={() => handleTransitionIn('home')}>{content.backMessage}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;