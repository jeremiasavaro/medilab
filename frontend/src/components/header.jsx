import React, { useState } from 'react';

function Header({ setView, isLoged, setIsLoged , language, setLanguage }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  //Cuando se deslogee, seteamos en falso isLoged, y lo mandamos a home con esta variable cambiada
  const handleLogout = () => {
    setIsLoged(false);
    setView("home"); 
    setIsDropdownOpen(false); // Cerrar desplegable
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Volver al inicio
  };
  
  const handleChangeLanguage = (lang) => {
    setLanguage(lang);
    setIsDropdownOpen(false); // Cerrar desplegable
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Volver al inicio
  };
  

  return (
    <header id="header" className="header sticky-top">
      <div className="topbar d-flex align-items-center">
        <div className="container d-flex justify-content-center justify-content-md-between">
          <div className="contact-info d-flex align-items-center">
            <i className="bi bi-envelope d-flex align-items-center">
              <a href="mailto:medilab@dc.exa.unrc.edu.ar">medilab@dc.exa.unrc.edu.ar</a>
            </i>
            <i className="bi bi-phone d-flex align-items-center ms-4">
              <span>+54 358 600-1336</span>
            </i>
          </div>
          <div className="social-links d-none d-md-flex align-items-center">
            <a href="https://www.facebook.com/universidadriocuarto" className="facebook"><i className="bi bi-facebook"></i></a>
            <a href="https://www.instagram.com/universidadnacionalderiocuarto/" className="instagram"><i className="bi bi-instagram"></i></a>
            <a href="https://github.com/jeremiasavaro/proyecto-UNRC-2024" className="github"><i className="bi bi-github"></i></a>
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
                <a href="#" onClick={toggleDropdown}>
                  Language <i className="bi bi-chevron-down ms-1"></i>
                </a>
                {isDropdownOpen && (
                  <ul className="dropdown-menu">
                      <>
                        <li>
                          <a href="#english" onClick={() => handleChangeLanguage("en")}>
                            English
                          </a>
                        </li>
                        <li>
                          <a href="#spanish" onClick={() => handleChangeLanguage("es")}>
                            Spanish
                          </a>
                        </li>
                      </>
                  </ul>
                )}
              </li>
              <li className="dropdown">
                <a href="#" className="active" onClick={toggleDropdown}>
                  Account <i className="bi bi-chevron-down ms-1"></i>
                </a>
                {isDropdownOpen && (
                  <ul className="dropdown-menu">
                    {isLoged ? (    //Si esta logeado mostramos las opciones para ver su cuenta o deslogearse
                      <>
                        <li>
                          <a href="#account" onClick={() => setView("account")}>
                            <i className="bi bi-person-circle me-2"></i>
                            My Account
                          </a>
                        </li>
                        <li>
                          <a href="#logout" onClick={handleLogout}>
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Logout
                          </a>
                        </li>
                      </>
                    ) : (   //Sino esta logeado mostramos las opciones para logearse o registrarse
                      <>
                        <li>
                          <a href="#login" onClick={() => setView("login")}>
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Login
                          </a>
                        </li>
                        <li>
                          <a href="#register" onClick={() => setView("register")}>
                            <i className="bi bi-person-plus me-2"></i>
                            Register
                          </a>
                        </li>
                      </>
                    )}
                  </ul>
                )}
              </li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
