import React from 'react';
import '../assets/css/Spinner.css';

const Spinner = () => (
  <div className="spinner-overlay">
    <div className="spinner-container">
      <div className="spinner-header">Scanning...</div>
      <div className="spinner"></div>
    </div>
  </div>
);

export default Spinner;
