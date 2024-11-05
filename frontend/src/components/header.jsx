import React, { useState, useEffect } from 'react';
import texts from "../assets/components-data/headerData.json";

function Header({ setView, isLogged, setIsLogged , language, setLanguage }) {
  // Usados para cambiar el idioma del contenido
  const [content, setContent] = useState(texts[language]);

  // Dependiendo del idioma, se muestra un texto u otro
  useEffect(() => {
    setContent(texts[language]); 
  }, [language]);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  //Cuando se deslogee, seteamos en falso isLogged, y lo mandamos a home con esta variable cambiada
  const handleLogout = () => {
    setIsLogged(false);
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
              <a href={`mailto:${content.contactInfo.email}`}>{content.contactInfo.email}</a>
            </i>
            <i className="bi bi-phone d-flex align-items-center ms-4">
              <span>{content.contactInfo.phone}</span>
            </i>
          </div>
          <div className="social-links d-none d-md-flex align-items-center">
            <a href={content.socialLinks.facebook} className="facebook"><i className="bi bi-facebook"></i></a>
            <a href={content.socialLinks.instagram} className="instagram"><i className="bi bi-instagram"></i></a>
            <a href={content.socialLinks.github} className="github"><i className="bi bi-github"></i></a>
          </div>
        </div>
      </div>

      <div className="branding d-flex align-items-center">
        <div className="container position-relative d-flex align-items-center justify-content-between">
          <a href="App.jsx" className="logo d-flex align-items-center me-auto">
            <h1 className="sitename">{content.siteName}</h1>
          </a>

          <nav id="navmenu" className="navmenu">
            <ul>
              <li><a href="#hero" className="active">{content.menuItems.home}</a></li>
              <li><a href="#about" className="active">{content.menuItems.about}</a></li>
              <li><a href="#services" className="active">{content.menuItems.services}</a></li>
              <li><a href="#doctors" className="active">{content.menuItems.doctors}</a></li>
              <li><a href="#gallery" className="active">{content.menuItems.gallery}</a></li>
              <li><a href="#faq" className="active">{content.menuItems.faq}</a></li>
              <li><a href="#contact" className="active">{content.menuItems.contact}</a></li>
              <li className="dropdown">
                <a href="#" className="active" onClick={toggleDropdown}>
                  {content.languageDropdown.title} <i className="bi bi-chevron-down ms-1"></i>
                </a>
                {isDropdownOpen && (
                  <ul className="dropdown-menu">
                      <>
                        <li>
                          <a href="#english" onClick={() => handleChangeLanguage("en")}>
                            {content.languageDropdown.english}
                          </a>
                        </li>
                        <li>
                          <a href="#spanish" onClick={() => handleChangeLanguage("es")}>
                            {content.languageDropdown.spanish}
                          </a>
                        </li>
                      </>
                  </ul>
                )}
              </li>
              <li className="dropdown">
                <a href="#" className="active" onClick={toggleDropdown}>
                  {content.accountDropdown.title} <i className="bi bi-chevron-down ms-1"></i>
                </a>
                {isDropdownOpen && (
                  <ul className="dropdown-menu">
                    {isLogged ? (
                      <>
                        <li>
                          <a href="#account" onClick={() => setView("account")}>
                            <i className="bi bi-person-circle me-2"></i>
                            {content.accountDropdown.loggedIn.myAccount}
                          </a>
                        </li>
                        <li>
                          <a href="#logout" onClick={handleLogout}>
                            <i className="bi bi-box-arrow-right me-2"></i>
                            {content.accountDropdown.loggedIn.logout}
                          </a>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <a href="#login" onClick={() => setView("login")}>
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            {content.accountDropdown.notLoggedIn.login}
                          </a>
                        </li>
                        <li>
                          <a href="#register" onClick={() => setView("register")}>
                            <i className="bi bi-person-plus me-2"></i>
                            {content.accountDropdown.notLoggedIn.register}
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