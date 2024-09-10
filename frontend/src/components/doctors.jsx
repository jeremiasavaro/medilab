// src/components/Doctors.jsx
import imgDoctor from '../assets/img/doctors/doctors-1.jpg'
import React from 'react';

function Doctors() {
  return (
    <section id="doctors" className="doctors section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Doctors</h2>
        <p>These are the professionals we have.</p>
      </div>

      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
            <div className="team-member d-flex align-items-start">
              <div className="pic"><img src={imgDoctor} className="img-fluid" alt="" /></div>
              <div className="member-info">
                <h4>Walter White</h4>
                <span>Pulmonologist</span>
                <p>Un neumonólogo :)</p>
                <div className="social">
                  <a href="#"><i className="bi bi-twitter-x"></i></a>
                  <a href="#"><i className="bi bi-facebook"></i></a>
                  <a href="#"><i className="bi bi-instagram"></i></a>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Doctors;
