import React, { useState } from 'react';
import '../assets/css/XrayService.css';

const XrayService = ({ setView }) => {
  const [message, setMessage] = useState('');
  const [openSection, setOpenSection] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);  // Nuevo estado para el PDF
  const [isUploadVisible, setIsUploadVisible] = useState(true); // Nuevo estado para controlar visibilidad del botón
  const [isScanning, setIsScanning] = useState(false);  // Nuevo estado para controlar si está escaneando

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
        setIsUploadVisible(false); // Ocultar botón después de cargar la imagen
      } catch (error) {
        console.error('Error uploading the image:', error);
      }
    }
  };

  const openOverlaySection = (sectionName) => {
    setOpenSection(sectionName);
  };

  const closeOverlaySection = () => {
    setOpenSection('');
  };

  const handleScanClick = async () => {
    if (imageUrl) {
      setIsScanning(true);  // Inicia la carga
      const formData = new FormData();
      formData.append('image_url', imageUrl);

      try {
        const response = await fetch('http://localhost:5000/xray_diagnosis', {
          method: 'POST',
          body: formData,
        });

        // Espera un archivo binario (PDF)
        const blob = await response.blob();
        setPdfBlob(blob);  // Guarda el blob del PDF en el estado
        setIsScanning(false);  // Finaliza la carga
      } catch (error) {
        console.error('Error enviando la imagen al backend o recibiendo el PDF:', error);
        setIsScanning(false);  // Asegurar que finalice la carga en caso de error
      }
    } else {
      console.log('No hay imagen cargada.');
    }
  };
  
  const handleDownloadClick = () => {
    if (pdfBlob) {
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'diagnosis.pdf');  // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);  // Remover el enlace después de la descarga
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
          <li onClick={() => setView('home')}><i className="fa-solid fa-right-to-bracket"></i>  Back to main page</li>
        </ul>
      </div>
      <div className="xrayServices-container">
        <input
          id="xray-upload"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {imageUrl && (
          <>
            <div className="xray-pic-container">
              <img
                src={imageUrl}
                className="xray-pic"
                alt="Uploaded"
              />
            </div>

            <button className="scan-button" onClick={handleScanClick} disabled={isScanning}>
              {isScanning ? 'Scanning...' : 'Start Scanning'}
              <br></br>
            </button>

            {/* Mostrar los tres puntos de carga */}
            {isScanning && <div className="loading">Procesando...</div>}

            <br></br>
            {pdfBlob && (
              <button className="download-button" onClick={handleDownloadClick}>
                Download Diagnosis PDF
              </button>
            )}
          </>
        )}

        {isUploadVisible && (  // Mostrar el botón de Upload solo si isUploadVisible es true
          <label htmlFor="xray-upload" className="xray-file-upload">
            Upload your X-RAY
          </label>
        )}
      </div>
      {openSection === 'info' && (
        <div className="overlay-section active">
          <div className="overlay-content">
            <h2>
              <i className="bi bi-info-square-fill"> </i>
              INFO
            </h2>
            <p>Metodo fiable</p>
            <button onClick={closeOverlaySection}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default XrayService;