import React from 'react';
import '../assets/css/Spinner.css';

const Spinner = ({ content }) => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        {/* Display the scanning message */}
        <div className="spinner-header">{content.scanning}</div>
        {/* Spinner animation */}
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default Spinner;