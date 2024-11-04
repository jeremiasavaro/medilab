import React, { useState, useEffect } from 'react';
import heroBg from '../assets/img/hero-bg.jpg';
import texts from "../assets/components-data/heroData.json";

function HeroSection({ setView, language }) {
  // Usados para cambiar el idioma del contenido
  const [content, setContent] = useState(texts[language]);

  // Dependiendo del idioma, se muestra un texto u otro
  useEffect(() => {
    setContent(texts[language]); 
  }, [language]);
  return (
    <section id="hero" className="hero section light-background">
      <img src={heroBg} alt="" data-aos="fade-in" />

      <div className="container position-relative">
        <div className="welcome position-relative" data-aos="fade-down" data-aos-delay="100">
          <h2>{content.welcomeTitle}</h2>
          <p></p>
        </div>

        <div className="content row gy-4">
          <div className="col-lg-4 d-flex align-items-stretch">
            <div className="why-box" data-aos="zoom-out" data-aos-delay="200">
              <h3>{content.xrayServiceTitle}</h3>
              <p>{content.xrayServiceDescription}</p>
              <div className="text-center">
                <a href="#xrayService" onClick={() => setView("xrayService")} className="more-btn">
                  <span>{content.accessService}</span>
                  <i className="bi bi-chevron-right"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-8 d-flex align-items-stretch">
            <div className="d-flex flex-column justify-content-center">
              <div className="row gy-4">
                <div className="col-xl-4 d-flex align-items-stretch">
                  <div className="icon-box" data-aos="zoom-out" data-aos-delay="300">
                    <i className="bi bi-clipboard-data"></i>
                    <h4>{content.reliabilityTitle}</h4>
                    <p>{content.reliabilityDescription}</p>
                  </div>
                </div>

                <div className="col-xl-4 d-flex align-items-stretch">
                  <div className="icon-box" data-aos="zoom-out" data-aos-delay="400">
                    <i className="bi bi-gem"></i>
                    <h4>{content.rapidDiagnosisTitle}</h4>
                    <p>{content.rapidDiagnosisDescription}</p>
                  </div>
                </div>

                <div className="col-xl-4 d-flex align-items-stretch">
                  <div className="icon-box" data-aos="zoom-out" data-aos-delay="500">
                    <i className="bi bi-inboxes"></i>
                    <h4>{content.friendlyInterfaceTitle}</h4>
                    <p>{content.friendlyInterfaceDescription}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
