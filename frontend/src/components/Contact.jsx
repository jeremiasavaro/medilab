import React, { useState, useEffect } from 'react';
import { useJwt } from "react-jwt";
import contactData from '../assets/components-data/contactData.json';
import { useObtainData } from "../hooks/useObtainData";

function InfoItem({aosDelay, h3, p }) {
  return (
    <div className="info-item d-flex" data-aos="fade-up" data-aos-delay={aosDelay}>
      <i className="bi bi-telephone flex-shrink-0"></i>
      <div>
        <h3>{h3}</h3>
        <p>{p}</p>
      </div>
    </div>
  );
}

function ContentForm({divClass, inp, val, handleChange, ph, name}) {
  if (name === null) {
    return (
      <div className={divClass}>
        <input type={inp}
               value={val}
               onChange={handleChange}
               className="form-control" placeholder={ph} required/>
      </div>
    );
  } else {
    return (
      <div className={divClass}>
        <input type={inp}
               value={val}
               onChange={handleChange}
               className="form-control" name= {name} placeholder={ph} required/>
      </div>
    );
  }
  
}

const Contact = ({ setView, isLogged, language }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [token, setToken] = useState('');
  const { decodedToken, isExpired } = useJwt(token);
  
  const [message, setMessage] = useState('');

  // Usados para cambiar el idioma del contenido
  const [content, setContent] = useState(contactData[language]);

  // Dependiendo del idioma, se muestra un texto u otro
  useEffect(() => {
    setContent(contactData[language]);
  }, [language]);

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

    useObtainData(token, decodedToken, isExpired, setFirstName, setLastName, setEmail, setMessage);
  
  // Función que maneja el envío del formulario.
  const handleContact = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página).
      if (isLogged){
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
        <h2>{content.sectionTitle}</h2>
        <p>{content.sectionInfo}</p>
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
            <InfoItem aosDelay={300} h3={content.location} p={`${content.address}, ${content.postalCode}`} />
            <InfoItem aosDelay={"400"} h3={content.callUs} p={content.phoneNumber}/>
            <InfoItem aosDelay={"500"} h3={content.emailUs} p={content.email}/>
          </div>

          <div className="col-lg-8">
            <form onSubmit={handleContact}>
            <div className="row gy-4">
              <ContentForm
                divClass={"col-md-6"}
                inp={"text"}
                val={isLogged ? firstName : ''}
                handleChange={(e) => setFirstName(e.target.value)}
                ph={content.firstName}
              />
              <ContentForm
                divClass={"col-md-6"}
                inp={"text"}
                val={isLogged ? lastName : ''}
                handleChange={(e) => setLastName(e.target.value)}
                ph={content.lastName}
              />
              <ContentForm
                divClass={"col-md-12"}
                inp={"email"}
                val={isLogged ? email : ''}
                handleChange={(e) => setEmail(e.target.value)}
                ph={content.userEmail}
                name={"email"}
              />
              <ContentForm
                divClass={"col-md-12"}
                inp={"text"}
                val={isLogged ? subject : ''}
                handleChange={(e) => setSubject(e.target.value)}
                ph={content.subject}
                name={"subject"}
              />
              <div className="col-md-12">
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  className="form-control"
                  name="message"
                  rows="6"
                  placeholder={content.message}
                  required
                ></textarea>
              </div>
              <div className="col-md-12 text-center">
                <button type="submit">{content.sendMessage}</button>
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