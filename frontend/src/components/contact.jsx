import React, { useState, useEffect } from 'react';
import { useJwt } from "react-jwt";

const Contact = ({setIsLoged, setView, isLoged}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [token, setToken] = useState('');
  const { decodedToken, isExpired } = useJwt(token);
  
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/auth/obtainToken', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) {
          setToken(data.token);
        } else {
          setMessage("No se pudo obtener el token");
        }
      } catch (error) {
        setMessage('Error al obtener el token');
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const setData = async () => {
      if (token && decodedToken) {
        try {
          const response = await fetch('http://127.0.0.1:5000/user/obtainData', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            },
          });

          const data = await response.json();
          if (response.ok) {
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setEmail(data.email);
          } else {
            setMessage("No se pudo obtener los datos");
          }
        } catch (error) {
          setMessage('Error al obtener los datos');
        }
      }
    }

    setData();
  }, [token, decodedToken, isExpired]);
  
  // Función que maneja el envío del formulario.
  const handleContact = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página).
      if (isLoged){
        try {
          // Realiza una solicitud POST al servidor.
          const response = await fetch('http://127.0.0.1:5000/inquiries/contact', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json', // Indica que el cuerpo de la solicitud está en formato JSON.
            },
            body: JSON.stringify({ firstName, lastName, email, subject, userMessage }),
          });

          const data = await response.json(); // Parsea la respuesta del servidor como JSON.

          if (response.ok) {
            setMessage(data.message);
          } else {
            setMessage(data.error);
          }
        } catch (error) {
          setMessage('Error en la conexión');
        }
      } else {
        setView('Alert')
      }
  }

  return (
    <section id="contact" className="contact section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Contact</h2>
        <p>If you have any questions or recommendations, please contact us.</p>
      </div>
      <div className="mb-5" data-aos="fade-up" data-aos-delay="200">
      <iframe
            style={{border: 0, width: '100%', height: '270px'}}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26729.843315742124!2d-64.3497984!3d-33.129310749999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95cdffb8089fff01%3A0x8851f91e0b23b631!2sUniversidad%20Nacional%20de%20R%C3%ADo%20Cuarto!5e0!3m2!1ses!2sar!4v1729089446519!5m2!1ses!2sar"
            allowFullScreen=""
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
                <p>Universidad Nacional de Río Cuarto, 5800</p>
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
                <p>medilab@dc.exa.unrc.edu.ar</p>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <form onSubmit={handleContact}>
              <div className="row gy-4">
                <div className="col-md-6">
                  <input type="text"
                         value={firstName}
                         onChange={(e) => setFirstName(e.target.value)}
                         className="form-control" placeholder="First Name" required/>
                </div>
                <div className="col-md-6">
                  <input type="text"
                         value={lastName}
                         onChange={(e) => setLastName(e.target.value)}
                         className="form-control" placeholder="Last Name" required/>
                </div>
                <div className="col-md-12">
                  <input type="email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="form-control" name="email" placeholder="Your Email" required/>
                </div>
                <div className="col-md-12">
                  <input type="text"
                         value={subject}
                         onChange={(e) => setSubject(e.target.value)}
                         className="form-control" name="subject" placeholder="Subject" required/>
                </div>
                <div className="col-md-12">
                  <textarea
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      className="form-control" name="message" rows="6" placeholder="Message" required></textarea>
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