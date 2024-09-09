import React from 'react';

const Footer = () => {
  return (
    <footer id="footer" className="footer light-background">
      <div className="container footer-top">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6 footer-about">
            <a href="../App.jsx" className="logo d-flex align-items-center">
              <span className="sitename">Medilab</span>
            </a>
            <div className="footer-contact pt-3">
              <p>Pedro Zanni 14</p>
              <p>Argentina, CBA, RC 5200</p>
              <p className="mt-3"><strong>Phone:</strong> <span>+54 358 600 1336</span></p>
              <p><strong>Email:</strong> <span>jeremiasavaro7@gmail.com</span></p>
            </div>
            <div className="social-links d-flex mt-4">
            <a href="https://www.facebook.com/jeremiasjose.avaro?mibextid=ZbWKwL" className="facebook"><i className="bi bi-facebook"></i></a>
            <a href="https://www.instagram.com/baachi13?igsh=MWZ4Mzd2OXFyYW92dQ==" className="instagram"><i className="bi bi-instagram"></i></a>
            <a href="https://github.com/jeremiasavaro/proyecto-UNRC-2024" className="github"><i className="bi bi-github"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Useful Links</h4>
            <ul>
              <li><a href="#hero">Home</a></li>
              <li><a href="#about">About us</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#">Terms of service</a></li>
              <li><a href="#">Privacy policy</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Our Services</h4>
            <ul>
              <li><a href="#">Web Design</a></li>
              <li><a href="#">Web Development</a></li>
              <li><a href="#">Product Management</a></li>
              <li><a href="#">Marketing</a></li>
              <li><a href="#">Graphic Design</a></li>
            </ul>
          </div>

          </div>
      </div>

      <div className="container copyright text-center mt-4">
        <p>© <span>Copyright</span> <strong className="px-1 sitename">Medilab</strong> <span>All Rights Reserved</span></p>
      </div>
    </footer>
  );
};

export default Footer;
