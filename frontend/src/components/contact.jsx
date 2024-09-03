import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="contact section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Contact</h2>
        <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
      </div>
      <div className="mb-5" data-aos="fade-up" data-aos-delay="200">
        <iframe
            style={{border: 0, width: '100%', height: '270px'}}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3292.296302968326!2d-64.351665!3d-33.127668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95d2cc0343eb97a3%3A0xb3bc9f4fd8e978d5!2sPedro%20Zanni%2014%2C%20X5800%20R%C3%ADo%20Cuarto%2C%20C%C3%B3rdoba%2C%20Argentina!5e0!3m2!1sen!2sus!4v1693602897983!5m2!1sen!2sus"
            frameBorder="0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

      </div>
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-4">
          <div className="col-lg-4">
            <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="300">
              <i className="bi bi-geo-alt flex-shrink-0"></i>
              <div>
                <h3>Location</h3>
                <p>Pedro Zanni 14, Rio Cuarto, 5200</p>
              </div>
            </div>
            <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="400">
              <i className="bi bi-telephone flex-shrink-0"></i>
              <div>
                <h3>Call Us</h3>
                <p>+54 358 600 1336</p>
              </div>
            </div>
            <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="500">
              <i className="bi bi-envelope flex-shrink-0"></i>
              <div>
                <h3>Email Us</h3>
                <p>jeremiasavaro7@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <form action="../forms/contact.js" method="post" className="php-email-form" data-aos="fade-up" data-aos-delay="200">
              <div className="row gy-4">
                <div className="col-md-6">
                  <input type="text" name="name" className="form-control" placeholder="Your Name" required />
                </div>
                <div className="col-md-6">
                  <input type="email" className="form-control" name="email" placeholder="Your Email" required />
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" name="subject" placeholder="Subject" required />
                </div>
                <div className="col-md-12">
                  <textarea className="form-control" name="message" rows="6" placeholder="Message" required></textarea>
                </div>
                <div className="col-md-12 text-center">
                  <button type="submit">Send Message</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
