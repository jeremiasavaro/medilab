import React from 'react';

const Footer = () => {
  return (
    <footer id="footer" className="footer light-background">
      <div className="container copyright text-center mt-4">
          <p>Universidad Nacional de Río Cuarto, 5800  |  <strong>Phone:</strong> <span>+54 358 600 1336</span>  |  <strong>Email:</strong> <span>medilab@dc.exa.unrc.edu.ar</span></p>
          <div className="social-links d-flex justify-content-center mt-4"> {/* Centra los iconos de redes sociales */}
            <a href="https://x.com/dcexaunrc"><i className="bi bi-twitter-x"></i></a>
            <a href="https://www.facebook.com/universidadriocuarto"><i className="bi bi-facebook"></i></a>
            <a href="https://www.instagram.com/universidadnacionalderiocuarto/"><i className="bi bi-instagram"></i></a>
        </div>
        <br></br>
        <p>© <span>Copyright</span> <strong className="px-1 sitename">Medilab</strong> <span>All Rights Reserved</span></p>
      </div>
    </footer>
  );
};

export default Footer;
