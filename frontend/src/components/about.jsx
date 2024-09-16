// src/components/About.jsx

import React from 'react';
import aboutBg from "../assets/img/about.jpg";

function About() {
  // Función para abrir el video en una nueva ventana
  const openVideo = () => {
    const videoId = 'LV4YF0JtVpA'; // ID del video de YouTube
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(url, '_blank');
  };

  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="row gy-4 gx-5">
          <div className="col-lg-6 position-relative align-self-start" data-aos="fade-up" data-aos-delay="200">
            {/* Imagen que actúa como botón para abrir el video */}
            <img 
              src={aboutBg} 
              className="img-fluid" 
              alt="" 
              onClick={openVideo} 
              style={{ cursor: 'pointer' }} // Cambia el cursor para indicar que es clickeable
            />
            <a href="#" className="glightbox pulsating-play-btn"></a>
          </div>

          <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay="100">
            <h3>About Us</h3>
            <p>
              A team of students from the National University of Rio Cuarto. With the aim of improving people's health, implementing automatic and simple diagnoses.
            </p>
            <ul>
              <li>
                <i className="fa-solid fa-vial-circle-check"></i>
                <div>
                  <h5>Innovation and Precision</h5>
                  <p>We use the most advanced artificial intelligence to offer fast and accurate results, improving the quality of life of our patients.</p>
                </div>
              </li>
              <li>
                <i className="fa-solid fa-pump-medical"></i>
                <div>
                  <h5>Commitment to Care</h5>
                  <p>Our dedication to healthcare goes beyond technology. We are committed to supporting medical professionals with reliable tools that enhance patient care, ensuring that every diagnosis is delivered with the utmost care.</p>
                </div>
              </li>
              <li>
                <i className="fa-solid fa-heart-circle-xmark"></i>
                <div>
                  <h5>Compassionate Expertise</h5>
                  <p>At the heart of our mission is a deep compassion for our patients. We combine cutting-edge technology with a human touch, providing expert diagnostics with empathy and understanding.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
