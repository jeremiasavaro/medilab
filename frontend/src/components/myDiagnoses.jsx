import React, { useEffect, useState } from 'react';
import "../assets/css/myDiagnoses.css";
import { useJwt } from "react-jwt";
import { useToken } from '../hooks/useToken';
import { useObtainData } from '../hooks/useObtainData';
import xrayData from '../assets/components-data/xrayServiceData.json';

const MyDiagnoses = ({ isOpen, onClose, language }) => {
  const [myDiagnoses, setMyDiagnoses] = useState([]);
  const [message, setMessage] = useState('');
  const [messageData, setMessageData] = useState('');
  const [dni, setDni] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const { token, messageToken } = useToken();
  const { decodedToken, isExpired } = useJwt(token);
  const [content, setContent] = useState(xrayData[language]);
  const [pdfBlob, setPdfBlob] = useState(null);

  useObtainData(token, decodedToken, isExpired, setFirstName, setLastName, setEmail, setDni, setMessageData);

  useEffect(() => {
    if (token && decodedToken && isOpen) {
      const fetchMyDiagnoses = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/inquiries/my_diagnoses', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch diagnoses. Status: ${response.status} - ${response.statusText}`);
          }

          const data = await response.json();
          console.log("Received data:", data);

          // Asegúrate de que sea un arreglo
          setMyDiagnoses(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Error fetching my diagnoses:', error);
          setMessage(`Error fetching diagnoses: ${error.message}`); // Mostrar el mensaje de error completo
          setMyDiagnoses([]);  // Configura un arreglo vacío en caso de error
        }
      };

      fetchMyDiagnoses();
    }
  }, [isOpen, token, decodedToken]);

  // Si no está abierto, retorna null directamente
  if (!isOpen) return null;

  const handleDownloadClick = () => {
    if (!pdfBlob) return;

    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'diagnosis.pdf');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    };

  return (
    <div className="modal-overlay-diagnoses">
      <div className="modal-content-diagnoses">
        <h1 className='h1-myDiagnoses'><b>Diagnoses of patient {firstName} {lastName} with DNI: {dni}</b></h1>
        <br />
        {message && <p className="message">{message}</p>}
        <div className="diagnoses-grid">
          {myDiagnoses.map((diagnosis, index) => (
            <div key={index} className="diagnosis-card">
              {diagnosis.image_diagnostic && (
                <div className="diagnosis-image">
                  <img
                    src={diagnosis.image_diagnostic}
                    className="profile-pic"
                    alt="Uploaded"
                  />
                </div>
              )}
              <div className="diagnosis-info">
                <p><b>Date:</b> {new Date(diagnosis.date_result).toLocaleDateString()}</p>
              </div>
              <button className="download-button" onClick={handleDownloadClick}>
                <i className="fa-regular fa-file-pdf"></i> Download PDF
              </button>
            </div>
          ))}
        </div>
        <div className="modal-buttons">
          <button type="button" onClick={onClose}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default MyDiagnoses;