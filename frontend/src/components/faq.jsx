// src/components/FAQ.jsx

import React from 'react';

function FAQ() {
  return (
    <section id="faq" className="faq section light-background">
      <div className="container section-title" data-aos="fade-up">
        <h2>Frequently Asked Questions</h2>
        <p>Some of the most frequently asked questions</p>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10" data-aos="fade-up" data-aos-delay="100">
            <div className="faq-container">
              <div className="faq-item faq-active">
                <h3>When will the pages with all its services be finished?</h3>
                <div className="faq-content">
                  <p>We are currently working to start training and testing artificial intelligence, we will update all
                    the advances.</p>
                </div>
                <i className="faq-toggle bi bi-chevron-right"></i>
              </div>
            </div>
            <div className="faq-container">
              <div className="faq-item faq-active">
                <h3>What is the cost of using all these services?</h3>
                <div className="faq-content">
                  <p>Being something educational, we decided that the system would be non-profit,
                    the advances.</p>
                </div>
                <i className="faq-toggle bi bi-chevron-right"></i>
              </div>
            </div>
            {/*Pensar mas preguntas frecuetnes y agregarlas*/}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
