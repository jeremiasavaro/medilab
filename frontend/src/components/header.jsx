import React, { useState } from 'react';

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
      <header id="header" className="header sticky-top">
        <div className="topbar d-flex align-items-center">
          <div className="container d-flex justify-content-center justify-content-md-between">
            <div className="contact-info d-flex align-items-center">
              <i className="bi bi-envelope d-flex align-items-center">
                <a href="mailto:jeremiasavaro7@gmail.com">jeremiasavaro7@gmail.com</a>
              </i>
              <i className="bi bi-phone d-flex align-items-center ms-4">
                <span>+54 358 600-1336</span>
              </i>
            </div>
            <div className="social-links d-none d-md-flex align-items-center">
              <a href="#" className="twitter"><i className="bi bi-twitter"></i></a>
              <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
              <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
              <a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
        </div>

        <div className="branding d-flex align-items-center">
          <div className="container position-relative d-flex align-items-center justify-content-between">
            <a href="App.jsx" className="logo d-flex align-items-center me-auto">
              <h1 className="sitename">Medilab</h1>
            </a>

            <nav id="navmenu" className="navmenu">
              <ul>
                <li><a href="#hero" className="active">Home</a></li>
                <li><a href="#about" className="active">About</a></li>
                <li><a href="#services" className="active">Services</a></li>
                <li><a href="#doctors" className="active">Doctors</a></li>
                <li><a href="#gallery" className="active">Gallery</a></li>
                <li><a href="#faq" className="active">FAQ</a></li>
                <li><a href="#contact" className="active">Contact</a></li>
                <li className="dropdown">
                  <a href="#" className="active" onClick={toggleDropdown}>
                    Account <i className="bi bi-chevron-down ms-1"></i>
                  </a>
                  {isDropdownOpen && (
                    <ul className="dropdown-menu">
                      <li>
                        <a href="#login" onClick={() => alert('Go to Login')}>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Login
                        </a>
                      </li>
                      <li>
                        <a href="#register" onClick={() => alert('Go to Register')}>
                          <i className="bi bi-person-plus me-2"></i>
                          Register
                        </a>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
              <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
            </nav>

            <a className="cta-btn d-none d-sm-block" href="../appointment">Make an Appointment</a>
          </div>
        </div>
      </header>
  );
}

export default Header;
