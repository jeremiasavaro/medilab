import React, { useState, useEffect } from 'react';
import footerData from '../assets/components-data/footerData.json';

const Footer = ({ language }) => {
  // State to hold the content based on the selected language
  const [content, setContent] = useState(footerData[language]);

  // Update content when language changes
  useEffect(() => {
    setContent(footerData[language]);
  }, [language]);

  return (
    <footer id="footer" className="footer light-background">
      <div className="container copyright text-center mt-4">
        {/* Display university information */}
        <p>{content.universityName}, {content.postalCode} | <strong>{content.phone}:</strong> <span>{content.phoneNumber}</span> | <strong>Email:</strong> <span>{content.email}</span></p>
        {/* Social media links */}
        <div className="social-links d-flex justify-content-center mt-4">
          <a href="https://x.com/dcexaunrc"><i className="bi bi-twitter-x"></i></a>
          <a href="https://www.facebook.com/universidadriocuarto"><i className="bi bi-facebook"></i></a>
          <a href="https://www.instagram.com/universidadnacionalderiocuarto/"><i className="bi bi-instagram"></i></a>
        </div>
        <br></br>
        {/* Copyright information */}
        <p>© <span>Copyright</span><strong className="px-1 sitename">Medilab</strong><span>{content.copyrightInfo}</span></p>
      </div>
    </footer>
  );
};

export default Footer;