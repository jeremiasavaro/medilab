import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/XrayService.css';
import { useJwt } from "react-jwt";
import infoData from '../infoData.json';

const XrayService = ({ setView }) => {
  const [message, setMessage] = useState('');
  const [openSection, setOpenSection] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isUploadVisible, setIsUploadVisible] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  const { decodedToken, isExpired } = useJwt(token);

  const [data] = useState(infoData);  // Datos de la sección de información

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
          headers: {
            'Authorization': token,
          },
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
          headers: {
            'Authorization': token,
          },
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

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/obtainToken', {
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

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/doctors');  // Cambia a la URL correcta de tu API
        const data = await response.json();
        console.log('Doctors data:', data); // Verificar los datos aquí
        setDoctors(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      }
    };
  
    fetchDoctors();
  }, []);

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

            <button className="scan-button" onClick={handleScanClick} disabled={isScanning}><i className="fa-solid fa-expand"></i> {isScanning ? 'Scanning...' : 'Start Scanning'}
              <br></br>
            </button>
            {isScanning && <div className="loading">Procesando...</div>}

            <br></br>
            {pdfBlob && (
              <button className="download-button"
              onClick={handleDownloadClick}><i className="fa-regular fa-file-pdf"></i> Download Diagnosis PDF
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
            <h2 className='h2'><b>Recommended doctors</b></h2>
            <div className="table-container">
              <table className="doctor-table">
                <thead>
                  <tr>
                    <th>Name and surname</th>
                    <th>Speciality</th>
                    <th>DNI</th>
                    <th>contact email</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor, index) => (
                    <tr key={index}>
                      <td>{doctor.first_name} {doctor.last_name}</td>
                      <td>{doctor.speciality}</td>
                      <td>{doctor.dni}</td>
                      <td><a href={`mailto:${doctor.email}`}>{doctor.email}</a></td>
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
            <i className="bi bi-info-square-fill"></i> INFO
          </h2>

          {/* Sección "Sobre Nosotros" */}
          <h3>{data.aboutUs.title}</h3>
          <p>{data.aboutUs.content}</p>

          {/* Sección "Metodología Utilizada" */}
          <h3>{data.methodology.title}</h3>
          <p>{data.methodology.content[0]}</p>
          <ul>
            <li>
              <strong>{data.methodology.content[1].model1.name}:</strong>{' '}
              {data.methodology.content[1].model1.description}
            </li>
            <li>
              <strong>{data.methodology.content[2].model2.name}:</strong>{' '}
              {data.methodology.content[2].model2.description}
            </li>
          </ul>

          {/* Sección "Enfermedades Detectadas" */}
          <h3>{data.detectedDiseases.title}</h3>
          <ul>
            {data.detectedDiseases.list.map((disease, index) => (
              <li key={index}>- {disease}</li>
            ))}
          </ul>

          {/* Aviso Importante */}
          <h3>{data.disclaimer.title}</h3>
          <p>{data.disclaimer.content}</p>

          {/* Agradecimientos */}
          <h3>{data.credits.title}</h3>
          <p>{data.credits.content}</p>

          <button onClick={closeOverlaySection}>Close</button>
        </div>
      </div>
    )}
    </section>
  );
};

export default XrayService;