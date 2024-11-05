import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/XrayService.css';
import { useJwt } from "react-jwt";
import infoData from '../assets/components-data/infoData.json';
import xrayData from '../assets/components-data/xrayServiceData.json';
import { useToken } from '../hooks/useToken';

const DoctorTable = ({ doctors, content, tableRef }) => (
  <div ref={tableRef}>
    <hr className="divider" />
    <h2 className='h2'><b>{content.doctors}</b></h2>
    <div className="table-container">
      <table className="doctor-table">
        <thead>
          <tr>
            <th>{content.doctorsName}</th>
            <th>{content.doctorsSpeciality}</th>
            <th>{content.doctorsID}</th>
            <th>{content.contactEmail}</th>
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
);

const XrayService = ({ setView, language }) => {
  const [message, setMessage] = useState('');
  const [openSection, setOpenSection] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isUploadVisible, setIsUploadVisible] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [content, setContent] = useState(xrayData[language]);
  const [data, setData] = useState(infoData[language]);

  const tableRef = useRef(null); // Referencia a la tabla

  const {token, messageToken} = useToken();
  const { decodedToken, isExpired } = useJwt(token);

  useEffect(() => {
    setContent(xrayData[language]);
    setData(infoData[language]);
    fetchDoctors();
  }, [language]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/inquiries/doctors');
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    if(token && decodedToken) {
      try {
        const response = await fetch('http://localhost:5000/image/upload_xray_photo', {
          method: 'POST',
          headers: { 'Authorization': token },
          body: formData,
        });

        const data = await response.json();
        setImageUrl(data.image_url);
        setIsUploadVisible(false);
      } catch (error) {
        console.error('Error uploading the image:', error);
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    handleFileUpload(file);
  };

  const handleScanClick = async () => {
    if (!imageUrl) return console.log('No hay imagen cargada.');

    setIsScanning(true);
    const formData = new FormData();
    formData.append('image_url', imageUrl);
    if(token && decodedToken) {
      try {
        const response = await fetch('http://localhost:5000/xray/xray_diagnosis', {
          headers: { 'Authorization': token },
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        const blob = await response.blob();
        setPdfBlob(blob);
      } catch (error) {
        console.error('Error enviando la imagen al backend o recibiendo el PDF:', error);
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleDownloadClick = () => {
    if (!pdfBlob) return;

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'diagnosis.pdf');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    setShowTable(true);
    setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  const openOverlaySection = (sectionName) => setOpenSection(sectionName);
  const closeOverlaySection = () => setOpenSection('');

  return (
    <section id="xray-section" className="contentXray">
      <button className="buttonBack" onClick={() => setView('home')}>
        <i className="fa-solid fa-right-to-bracket"></i> {content.backButton}
      </button>
      <header className="title">
        {content.sectionTitle}
        <button className="toggle-button" onClick={() => openOverlaySection('info')}>
          <i className="bi-info-circle-fill"></i> {content.info}
        </button>
      </header>
      <div className="xrayServices-container">
        <input id="xray-upload" type="file" style={{ display: 'none' }} onChange={handleFileChange} />

        {imageUrl && (
          <>
            <div className="xray-pic-container">
              <img src={imageUrl} className="xray-pic" alt="Uploaded" />
            </div>
            <button className="scan-button" onClick={handleScanClick} disabled={isScanning}>
              <i className="fa-solid fa-expand"></i> {isScanning ? content.scanning : content.startScanning}
            </button>
            {isScanning && <div className="loading">{content.processing}</div>}
            <br></br>
            {pdfBlob && (
              <button className="download-button" onClick={handleDownloadClick}>
                <i className="fa-regular fa-file-pdf"></i> {content.downloadPDF}
              </button>
            )}
          </>
        )}

        {isUploadVisible && (
          <label htmlFor="xray-upload" className="xray-file-upload">
            {content.uploadXRay}
          </label>
        )}

        {showTable && <DoctorTable doctors={doctors} content={content} tableRef={tableRef} />}
      </div>

      {openSection === 'info' && (
        <div className="overlay-section active">
          <div className="overlay-content">
            <h2><i className="bi bi-info-square-fill"></i> {content.info}</h2>
            <h3>{data.aboutUs.title}</h3>
            <p>{data.aboutUs.content}</p>
            <h3>{data.methodology.title}</h3>
            <p>{data.methodology.content[0]}</p>
            <ul>
              <li><strong>{data.methodology.content[1].model1.name}:</strong> {data.methodology.content[1].model1.description}</li>
              <li><strong>{data.methodology.content[2].model2.name}:</strong> {data.methodology.content[2].model2.description}</li>
            </ul>
            <h3>{data.detectedDiseases.title}</h3>
            <ul>{data.detectedDiseases.list.map((disease, index) => <li key={index}>- {disease}</li>)}</ul>
            <h3>{data.disclaimer.title}</h3>
            <p>{data.disclaimer.content}</p>
            <h3>{data.credits.title}</h3>
            <p>{data.credits.content}</p>
            <button onClick={closeOverlaySection}>{content.closeButton}</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default XrayService;
