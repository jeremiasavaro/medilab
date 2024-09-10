import React from 'react';

function HeroSection() {
  return (
    <section id="hero" className="hero section light-background">
      <img src="../assets/img/hero-bg.jpg" alt="" data-aos="fade-in" />

      <div className="container position-relative">
        <div className="welcome position-relative" data-aos="fade-down" data-aos-delay="100">
          <h2>WELCOME TO MEDILAB</h2>
          <p></p>
        </div>

        <div className="content row gy-4">
          <div className="col-lg-4 d-flex align-items-stretch">
            <div className="why-box" data-aos="zoom-out" data-aos-delay="200">
              <h3>X-ray diagnostic service</h3>
              <p>The X-ray service provides a way of diagnosis from the scanning of an X-ray by using AI.</p>
              <div className="text-center">
                <a href="#image-upload" className="more-btn"><span>Access the service</span> <i className="bi bi-chevron-right"></i></a>
              </div>
            </div>
          </div>

          <div className="col-lg-8 d-flex align-items-stretch">
            <div className="d-flex flex-column justify-content-center">
              <div className="row gy-4">
                <div className="col-xl-4 d-flex align-items-stretch">
                  <div className="icon-box" data-aos="zoom-out" data-aos-delay="300">
                    <i className="bi bi-clipboard-data"></i>
                    <h4>High reliability</h4>
                    <p>The Probee X-ray service helps the patient by shortening times and providing a more comfortable experience.</p>
                  </div>
                </div>

                <div className="col-xl-4 d-flex align-items-stretch">
                  <div className="icon-box" data-aos="zoom-out" data-aos-delay="400">
                    <i className="bi bi-gem"></i>
                    <h4>Rapid Diagnosis</h4>
                    <p>Thanks to the speed and accuracy of our AI, scan results are available within minutes, optimizing waiting time for patients.</p>
                  </div>
                </div>

                <div className="col-xl-4 d-flex align-items-stretch">
                  <div className="icon-box" data-aos="zoom-out" data-aos-delay="500">
                    <i className="bi bi-inboxes"></i>
                    <h4>Friendly Interface</h4>
                    <p>An easy and intuitive experience, designed with the user in mind, allows healthcare professionals to access diagnoses quickly and without complications.</p>
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
