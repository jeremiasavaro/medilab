import React, { useState, useRef } from 'react';
import '../assets/css/XrayService.css';

const XrayService = ({ setView }) => {
  const [message, setMessage] = useState('');
  const [openSection, setOpenSection] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);  
  const [isUploadVisible, setIsUploadVisible] = useState(true); 
  const [isScanning, setIsScanning] = useState(false);  
  const [showTable, setShowTable] = useState(false);

  const tableRef = useRef(null); // Referencia a la tabla

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/upload_xray_photo', {
          method: 'POST',
          credentials: 'include',
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
          credentials: 'include',
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
  
    // Mostrar la tabla y esperar a que se renderice
    setShowTable(true);
  
    // Usar setTimeout para hacer el scroll después del siguiente ciclo de renderizado
    setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);  // Un pequeño retraso para permitir que React termine el renderizado
  };

  const [data, setData] = useState([
    {
      photo: 'https://via.placeholder.com/50', // URL de ejemplo
      firstName: 'Carlos',
      lastName: 'Gomez',
      specialty: 'Radiologist',
      dni: '23456730',
      email: 'carlos.gomez@hospital.com'
    },
    {
      photo: 'https://via.placeholder.com/50', // URL de ejemplo
      firstName: 'Ana',
      lastName: 'Martinez',
      specialty: 'Technician',
      dni: '17345629',
      email: 'ana.martinez@hospital.com'
    },
    // Agregar más objetos según sea necesario
  ]);

  return (
    <section id="xray-section" className="contentXray">
      <button className="buttonBack" onClick={() => setView('home')}><i className="fa-solid fa-right-to-bracket"></i>  Back</button>
      <header className="title">Faster Diagnostics with X-RAI
      <button className="toggle-button" onClick={() => openOverlaySection('info')}>
          <i className="bi-info-circle-fill"> </i>
          Info
        </button>
      </header>
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

            <button className="scan-button" onClick={handleScanClick} disabled={isScanning}><i class="fa-solid fa-expand"></i> {isScanning ? 'Scanning...' : 'Start Scanning'}
              <br></br>
            </button>
            {isScanning && <div className="loading">Procesando...</div>}

            <br></br>
            {pdfBlob && (
              <button className="download-button" 
              onClick={handleDownloadClick}><i class="fa-regular fa-file-pdf"></i> Download Diagnosis PDF
              </button>
            )}
          </>
        )}

        {isUploadVisible && (  // Mostrar el botón de Upload solo si isUploadVisible es true
          <label htmlFor="xray-upload" className="xray-file-upload">
            Upload your X-RAY
          </label>
        )}
        {showTable && (
          <div ref={tableRef}>
            <hr className="divider" />
            <h2 className='h2'><b>Medicos recomendados</b></h2>
            <div className="table-container">
              <table className="doctor-table">
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Nombre y Apellido</th>
                    <th>Especialidad</th>
                    <th>DNI</th>
                    <th>Email de Contacto</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((person, index) => (
                    <tr key={index}>
                      <td><img src={person.photo} alt={`${person.firstName} ${person.lastName}`} width="50" height="50" /></td>
                      <td>{person.firstName} {person.lastName}</td>
                      <td>{person.specialty}</td>
                      <td>{person.dni}</td>
                      <td><a href={`mailto:${person.email}`}>{person.email}</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
