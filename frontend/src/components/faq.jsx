// src/components/FAQ.jsx

import React from 'react';

function FAQ() {
  return (
    <section id="faq" className="faq section light-background">
      <div className="container section-title" data-aos="fade-up">
        <h2>Frequently Asked Questions</h2>
        <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10" data-aos="fade-up" data-aos-delay="100">
            <div className="faq-container">
              <div className="faq-item faq-active">
                <h3>Non consectetur a erat nam at lectus urna duis?</h3>
                <div className="faq-content">
                  <p>Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.</p>
                </div>
                <i className="faq-toggle bi bi-chevron-right"></i>
              </div>
              {/*Pensar mas preguntas frecuetnes y agregarlas*/}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
