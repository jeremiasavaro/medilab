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
                <ul>
                    {myDiagnoses.map((diagnosis, index) => (
                        <li key={index}>
                            {diagnosis.image_diagnostic && (
                                <div>
                                <br/>
                                <img
                                    src={diagnosis.image_diagnostic}
                                    className="profile-pic"
                                    alt="Uploaded"
                                    style={{maxWidth: '200px', borderRadius: '0%'}}
                                />
                                </div>
                            )}
                            <br></br>
                            Dni: {diagnosis.dni} 
                            <br></br>
                            Date: {diagnosis.date_result}
                        </li>
                    ))}
                </ul>
            <div className="modal-buttons">
                <button type="button" onClick={onClose}>Back</button>
            </div>
            </div>
        </div>
    );
};

export default MyDiagnoses;
