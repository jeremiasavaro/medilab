import React from 'react';

const Footer = () => {
  return (
    <footer id="footer" className="footer light-background">
      <div className="container copyright text-center mt-4">
          <p>Pedro Zanni 14, Argentina, CBA, Rio Cuarto 5800  |  <strong>Phone:</strong> <span>+54 358 600 1336</span>  |  <strong>Email:</strong> <span>jeremiasavaro7@gmail.com</span></p>
          <div className="social-links d-flex justify-content-center mt-4"> {/* Centra los iconos de redes sociales */}
            <a href=""><i className="bi bi-twitter-x"></i></a>
            <a href=""><i className="bi bi-facebook"></i></a>
            <a href=""><i className="bi bi-instagram"></i></a>
            <a href=""><i className="bi bi-linkedin"></i></a>
        </div>
        <br></br>
        <p>© <span>Copyright</span> <strong className="px-1 sitename">Medilab</strong> <span>All Rights Reserved</span></p>
      </div>
    </footer>
  );
};

export default Footer;
