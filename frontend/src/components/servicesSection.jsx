// src/components/Services.jsx

import React from 'react';

function Services() {
  return (
    <section id="services" className="services section">
      {/* Section Title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>Services</h2>
        <p>At Medilab, we offer a range of cutting-edge services designed to streamline the diagnostic process and enhance patient care.</p>
      </div>

      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div className="service-item position-relative">
              <div className="icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <a href="#" className="stretched-link">
                <h3>Automated X-ray Diagnostics</h3>
              </a>
              <p>Receive accurate diagnostics from your X-ray images within minutes. Our AI analyzes radiographs to detect potential anomalies with exceptional precision.</p>
            </div>
          </div>
          {/*<div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">  Pensar otra funcionalidad acá
            <div className="service-item position-relative">
              <div className="icon">
                <i className="fas fa-pills"></i>
              </div>
              <a href="#" className="stretched-link">
                <h3>Eosle Commodi</h3>
              </a>
              <p>Ut autem aut autem non a. Sint sint sit facilis nam iusto sint. Libero corrupti neque eum hic non ut nesciunt dolorem.</p>
            </div>
          </div>*/}
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div className="service-item position-relative">
              <div className="icon">
                <i className="fas fa-hospital-user"></i>
              </div>
              <a href="#" className="stretched-link">
                <h3>Personalized Medical Recommendations</h3>
              </a>
              <p>Automatically connect with the most suitable specialists based on your diagnosis. We provide a curated list of recommended doctors to continue your treatment seamlessly.</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
            <div className="service-item position-relative">
              <div className="icon">
                <i className="fas fa-dna"></i>
              </div>
              <a href="#" className="stretched-link">
                <h3>Cranial X-ray Diagnostics</h3>
              </a>
              <p>Specializing in cranial radiography, our technology identifies any irregularities, from fractures to signs of neurological disorders, ensuring comprehensive care.</p>
              <a href="#" className="stretched-link"></a>
            </div>
          </div>
          {/*<div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500"> Pensar otra funcionalidad acá
            <div className="service-item position-relative">
              <div className="icon">
                <i className="fas fa-wheelchair"></i>
              </div>
              <a href="#" className="stretched-link">
                <h3>Velit Doloremque</h3>
              </a>
              <p>Cumque et suscipit saepe. Est maiores autem enim facilis ut aut ipsam corporis aut. Sed animi at autem alias eius labore.</p>
              <a href="#" className="stretched-link"></a>
            </div>
          </div>*/}
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
            <div className="service-item position-relative">
              <div className="icon">
                <i className="fas fa-notes-medical"></i>
              </div>
              <a href="#" className="stretched-link">
                <h3>Professional PDF Report Generation</h3>
              </a>
              <p>Receive a detailed and professional report in PDF format with your X-ray diagnosis. Ideal for sharing with other healthcare professionals or for your personal records.</p>
              <a href="#" className="stretched-link"></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
