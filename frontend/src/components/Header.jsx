import React, { useState, useEffect } from 'react';
import texts from "../assets/components-data/headerData.json";

function Header({ setView, isLogged, setIsLogged, language, setLanguage }) {
  const [content, setContent] = useState(texts[language]);

  useEffect(() => {
    setContent(texts[language]);
  }, [language]);

  const [dropdownOpen, setDropdownOpen] = useState({ language: false, account: false });

  const toggleDropdown = (dropdown) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [dropdown]: !prevState[dropdown]
    }));
  };

  const handleLogout = () => {
    setIsLogged(false);
    setView("home");
    setDropdownOpen({ language: false, account: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeLanguage = (lang) => {
    setLanguage(lang);
    setDropdownOpen({ ...dropdownOpen, language: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const DropdownMenu = ({ title, items, dropdown }) => (
    <li className="dropdown">
      <a href="#" className="active" onClick={() => toggleDropdown(dropdown)}>
        {title} <i className="bi bi-chevron-down ms-1"></i>
      </a>
      {dropdownOpen[dropdown] && (
        <ul className="dropdown-menu">
          {items.map((item, index) => (
            <li key={index}>
              <a href={item.href} onClick={item.action}>
                {item.icon && <i className={`bi ${item.icon} me-2`}></i>}
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  const languageItems = [
    { href: "#english", label: content.languageDropdown.english, action: () => handleChangeLanguage("en") },
    { href: "#spanish", label: content.languageDropdown.spanish, action: () => handleChangeLanguage("es") }
  ];

  const accountItems = isLogged
    ? [
        { href: "#account", label: content.accountDropdown.loggedIn.myAccount, icon: "bi-person-circle", action: () => setView("account") },
        { href: "#logout", label: content.accountDropdown.loggedIn.logout, icon: "bi-box-arrow-right", action: handleLogout }
      ]
    : [
        { href: "#login", label: content.accountDropdown.notLoggedIn.login, icon: "bi-box-arrow-in-right", action: () => setView("login") },
        { href: "#register", label: content.accountDropdown.notLoggedIn.register, icon: "bi-person-plus", action: () => setView("register") }
      ];

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
              <DropdownMenu title={content.languageDropdown.title} items={languageItems} dropdown="language" />
              <DropdownMenu title={content.accountDropdown.title} items={accountItems} dropdown="account" />
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
