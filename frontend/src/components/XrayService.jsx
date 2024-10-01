import React, { useState } from 'react';
import '../assets/css/XrayService.css';

const XrayService = ({ setView }) => {
  const [message, setMessage] = useState('');
  const [openSection, setOpenSection] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);  // Nuevo estado para el PDF

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

  const openOverlaySection = (sectionName) => {
    setOpenSection(sectionName);
  };

  const closeOverlaySection = () => {
    setOpenSection('');
  };

  const handleScanClick = async () => {
    if (imageUrl) {
      const formData = new FormData();
      formData.append('image_url', imageUrl);

      try {
        const response = await fetch('http://localhost:5000/xray_diagnosis', {
          method: 'POST',
          body: formData,
        });

        // Espera un archivo binario
        const blob = await response.blob();
        setPdfBlob(blob);  // Guarda el blob en el estado

        // Obtener el nombre del archivo desde el header
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = 'diagnosis.pdf';  // Valor por defecto en caso de que no obtengamos el nombre

        if (contentDisposition) {
          // Extraer el nombre del archivo del header
          const matches = contentDisposition.match(/filename="(.+)"/);
          if (matches.length > 1) {
            fileName = matches[1];
          }
        }

        // Crear el enlace de descarga de PDF
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);  // Usar el nombre del archivo obtenido
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);  // Remover enlace después de la descarga
      } catch (error) {
        console.error('Error enviando la imagen al backend o recibiendo el PDF:', error);
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
      link.setAttribute('download', 'diagnosis.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
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

            <button className="scan-button" onClick={handleScanClick}>
              Start Scanning
            </button>

            {pdfBlob && (
              <button className="download-button" onClick={handleDownloadClick}>
                Download Diagnosis PDF
              </button>
            )}
          </>
        )}

        <label htmlFor="xray-upload" className="xray-file-upload">
          Upload your X-RAY
        </label>
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
