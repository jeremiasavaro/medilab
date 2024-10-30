// src/components/About.jsx

import React, { useState, useEffect } from 'react';
import aboutBg from "../assets/img/about.jpg";
import texts from "../assets/components-data/about.json";

function About({language}) {
  // Usados para cambiar el idioma del contenido
  const [content, setContent] = useState(texts[language]);

  // Dependiendo del idioma, se muestra un texto u otro
  useEffect(() => {
    setContent(texts[language]); 
  }, [language]);

  // Función para abrir el video en una nueva ventana
  const openVideo = () => {
    const videoId = 'LV4YF0JtVpA'; // ID del video de YouTube
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(url, '_blank');
  };

  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="language-selector">
          {/* Botones para cambiar de idioma */}
          <button onClick={() => setLanguage('en')}>English</button>
          <button onClick={() => setLanguage('es')}>Español</button>
        </div>

        <div className="row gy-4 gx-5">
          <div className="col-lg-6 position-relative align-self-start" data-aos="fade-up" data-aos-delay="200">
            <img 
              src={aboutBg} 
              className="img-fluid" 
              alt="" 
              onClick={openVideo} 
              style={{ cursor: 'pointer' }} 
            />
            <a href="#" className="glightbox pulsating-play-btn"></a>
          </div>

          <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay="100">
            <h3>{content.aboutUs}</h3>
            <p>{content.intro}</p>
            <ul>
              {content.features.map((feature, index) => (
                <li key={index}>
                  <i className={`fa-solid fa-${index === 0 ? 'vial-circle-check' : index === 1 ? 'pump-medical' : 'heart-circle-xmark'}`}></i>
                  <div>
                    <h5>{feature.title}</h5>
                    <p>{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;