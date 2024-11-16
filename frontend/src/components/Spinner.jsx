import React, { useState, useEffect } from 'react';
import '../assets/css/Spinner.css';

const Spinner = ({ content }) => {

  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="spinner-header">{content.scanning}</div>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default Spinner;
