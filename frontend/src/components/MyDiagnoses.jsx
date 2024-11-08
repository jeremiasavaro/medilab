import React, { useEffect, useState } from 'react';
import "../assets/css/myDiagnoses.css";

const MyDiagnoses = ({ isOpen, onClose }) => {
    const [myDiagnoses, setMyDiagnoses] = useState([]);
    const [message, setMessage] = useState('');

    // Usa useEffect sin condiciones y controla el fetch dentro de él
    useEffect(() => {
        const fetchMyDiagnoses = async () => {
            if (!isOpen) return; // Solo realiza la llamada si el modal está abierto
            try {
                const response = await fetch('http://127.0.0.1:5000/inquiries/my_diagnoses');
                const data = await response.json();
                setMyDiagnoses(data);
            } catch (error) {
                console.error('Error fetching my diagnoses:', error);
                setMessage('Error fetching diagnoses'); 
            }
        };

        fetchMyDiagnoses();
    }, [isOpen]); // useEffect depende de isOpen

    // Si no está abierto, retorna null directamente
    if (!isOpen) return null;

    return (
        <div className="modal-overlay-diagnoses">
          <div className="modal-content-diagnoses">
            <h1 className='h1-myDiagnoses'><b>Diagnoses of patient with DNI ...</b></h1>
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
                    <p><b>DNI:</b> {diagnosis.dni}</p>
                    <p><b>Date:</b> {diagnosis.date_result}</p>
                  </div>
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