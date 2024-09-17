import React, { useState } from 'react';
import '../assets/css/XrayService.css';

const XrayService = ({setView}) =>{
    const [message, setMessage] = useState('');
    const [openSection, setOpenSection] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    
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

    const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/upload_xray_photo', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        setImageUrl(data.image_url);

      } catch (error) {
        console.error('Error uploading the image:', error);
      }
    }
  };

  return (
      <section id="xray-section" className="contentXray">
          <header className="title">Faster Diagnostics with X-RAI</header>
          <div className="side-Bar">
              <button className="toggle-button" onClick={() => openOverlaySection('info')}>
                  <i className="bi-info-circle-fill"> </i>
                   Info
              </button>
              <ul>
                  <li onClick={() => setView('home')}>
                      <span className="fa-solid fa-right-to-bracket">Back To Main Page</span>
                  </li>
              </ul>
          </div>
          <div className="xrayServices-container">
              <div className="xrayServices-content">
                  <label htmlFor="xray-upload" className="xray-file-upload">
                      Upload your X-RAY
                  </label>
                  <input
                      id="xray-upload"
                      type="file"
                      style={{display: 'none'}}
                      onChange={handleFileChange}
                  />
                  {imageUrl && (
                      <div>
                          <br/>
                          <img
                              src={imageUrl}
                              className="xray-pic"
                              alt="Uploaded"
                              style={{maxWidth: '200px', borderRadius: '50%'}}
                          />
                      </div>
                  )}
              </div>
          </div>
    {
        openSection === 'info' && (
            <div className="overlay-section active">
          <div className="overlay-content">
            <h2>
                <i className="bi bi-info-square-fill"> </i>
                 INFO</h2>
            <p>Aca podríamos argumentar sobre la fiabilidad del método</p>
            <button onClick={closeOverlaySection}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default XrayService;
