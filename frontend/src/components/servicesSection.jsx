// src/components/Services.jsx

import React, {useEffect, useState} from 'react';
import texts from "../assets/components-data/servicesSectionData.json";

function Services({ language }) {
  const [content, setContent] = useState(texts[language]);

  // Dependiendo del idioma, se muestra un texto u otro
  useEffect(() => {
    setContent(texts[language]);
  }, [language]);

  return (
    <section id="services" className="services section">
      {/* Section Title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>{content.sectionTitle}</h2>
        <p>{content.sectionIntroduction}</p>
      </div>

      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div className="service-item position-relative">
              <div className="icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <a href="#" className="stretched-link">
                <h3>{content.firstComponentTitle}</h3>
              </a>
              <p>{content.firstComponentDescription}</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div className="service-item position-relative">
              <div className="icon">
                <i className="fas fa-hospital-user"></i>
              </div>
              <a href="#" className="stretched-link">
                <h3>{content.secondComponentTitle}</h3>
              </a>
              <p>{content.secondComponentDescription}</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
            <div className="service-item position-relative">
              <div className="icon">
                <i className="fas fa-notes-medical"></i>
              </div>
              <a href="#" className="stretched-link">
                <h3>{content.thirdComponentTitle}</h3>
              </a>
              <p>{content.thirdComponentDescription}</p>
              <a href="#" className="stretched-link"></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
