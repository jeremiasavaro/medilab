import React, { useState } from 'react';
import '../assets/css/XrayService.css';

const XrayService = ({setView}) =>{
    const [message, setMessage] = useState('');
    const [openSection, setOpenSection] = useState('');
    const handleXrayService = async (e) =>{
    try {
        const response = await fetch('http://127.0.0.1:5000/XrayService', {
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          const data = await response.json();
          if (response.ok) {
            setMessage(data.message);
          } else {
            setMessage(data.error);
          }
        } catch (error) {
          setMessage('Error en la conexión');
        }
    };

    // Con esta funcion manejamos las secciones sobre la side-bar
    const openOverlaySection = (sectionName) => {
      setOpenSection(sectionName);
    };  

    //con esta funcion cerramos una seccion abierta
    const closeOverlaySection = () => {
      setOpenSection('');
    ;}

    return (
        <section id="xray-section" className='contentXray'>
          <header className="title">Faster Diagnostics with X-RAI</header>
            <div className="side-Bar">
                <button className="toggle-button" onClick={() => openOverlaySection('Method')}>
                  Method Used
               </button>
               <button className="toggle-button" onClick={() => openOverlaySection('Diagnostics')}>
                  Diagnostics options
               </button>
               <button className="toggle-button" onClick={() => openOverlaySection('Fiability')}>
                  Fiability
               </button>
                <ul>
                    <li onClick={() => setView('home')}><i className=""></i>
                      <span className="back">
                      Back To Main Page
                      </span>
                       
                    </li>
                </ul>
            </div>
            {openSection === 'Method' && (
             <div className="overlay-section">
              <div className="overlay-content">
               <h2>Method</h2>
                <p>Aca vamos a contar sobre el metodo usado</p>
                <button onClick={closeOverlaySection}>Close</button>
              </div>
            </div>
            )}
            {openSection === 'Diagnostics' && (
             <div className="overlay-section">
              <div className="overlay-content">
               <h2>Method</h2>
                <p>Aca deberiamos colocar los distintos diagnosticos que se podria hacer</p>
                <button onClick={closeOverlaySection}>Close</button>
              </div>
            </div>
            )}
            {openSection === 'Fiability' && (
             <div className="overlay-section">
              <div className="overlay-content">
               <h2>Method</h2>
                <p>Aca podriamos argumentar sobre la fiabilidad del metodo</p>
                <button onClick={closeOverlaySection}>Close</button>
              </div>
            </div>
            )}
           {/* 
            <h3 className="message">Your result in one click</h3>
            <button className="Initiate-button">
                  Initiate
            </button>
            */}
        </section>
    );
}   
export default XrayService;