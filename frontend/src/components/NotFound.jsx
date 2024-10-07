import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "../assets/css/NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Oops! Page not found</h2>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <Link to="/" className="home-button">
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
