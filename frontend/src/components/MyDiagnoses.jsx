import React, { useEffect, useState } from 'react';
import "../assets/css/myDiagnoses.css";
import { useJwt } from "react-jwt";
import { IoMdArrowBack } from 'react-icons/io';
import { useToken } from '../hooks/useToken';
import { useObtainData } from '../hooks/useObtainData';
import mydiagnosesData from '../assets/components-data/mydiagnosesData.json';

const MyDiagnoses = ({ isOpen, onClose, language }) => {
  // State to hold diagnoses data
  const [myDiagnoses, setMyDiagnoses] = useState([]);
  // State to hold messages
  const [message, setMessage] = useState('');
  const [messageData, setMessageData] = useState('');
  // State to hold user information
  const [dni, setDni] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  // Get token and message from custom hook
  const { token, messageToken } = useToken();
  // Decode token and check expiration
  const { decodedToken, isExpired } = useJwt(token);
  // State to hold content based on selected language
  const [content, setContent] = useState(mydiagnosesData[language]);
  // State to control the closing animation
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  // Fetch user data using custom hook
  useObtainData(token, decodedToken, isExpired, setFirstName, setLastName, setEmail, setDni, setMessageData);

  // Update content when language changes
  useEffect(() => {
    setContent(mydiagnosesData[language]);
  }, [language]);

  // Fetch diagnoses data when component is open and token is available
  useEffect(() => {
    if (token && decodedToken && isOpen) {
      const fetchMyDiagnoses = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/inquiries/my_diagnoses', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch diagnoses. Status: ${response.status} - ${response.statusText}');
          }

          const data = await response.json();
          console.log("Received data:", data);
          setMyDiagnoses(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Error fetching my diagnoses:', error);
          setMessage(Error('fetching diagnoses: ${error.message}'));
          setMyDiagnoses([]);
        }
      };

      fetchMyDiagnoses();
    }
  }, [isOpen, token, decodedToken]);

  // Handle PDF download
  const handleDownloadClick = (pdfBase64) => {
    if (!pdfBase64) {
      alert("No PDF data available for download.");
      return;
    }

    try {
      // Extract base64 data
      const base64Data = pdfBase64.includes(',') ? pdfBase64.split(',')[1] : pdfBase64;
      // Decode base64 to binary
      const byteCharacters = atob(base64Data);
      // Convert binary to array of character codes
      const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
      // Create Uint8Array from character codes
      const byteArray = new Uint8Array(byteNumbers);
      // Create Blob object from Uint8Array
      const blob = new Blob([byteArray], { type: "application/pdf" });
      // Create URL for Blob object
      const url = window.URL.createObjectURL(blob);
      // Create and click download link
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "diagnosis.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error decoding PDF:", error);
      alert("Failed to process PDF download.");
    }
  };

  // Handle modal close with animation
  const handleClose = () => {
    setIsClosing(true);  // Activates the exit animation
    setTimeout(() => {
      setIsClosing(false);  // Resets the state after the animation
      onClose(); // Calls the close function
    }, 300);  // Time in milliseconds for the exit animation
  };

  // Return null if modal is not open and not in closing animation
  if (!isOpen && !isClosing) return null;

  return (
    <div className={`modal-overlay-diagnoses ${isClosing ? 'closing' : ''}`}>
      <div className="modal-content-diagnoses">
        <div className="header-container">
          <button
            onClick={handleClose}
            aria-label="Go back"
            className="xray-header-back-button-diagnoses"
          >
            <IoMdArrowBack className="header-icon-diagnoses" />
          </button>
          <h1 className="h1-myDiagnoses">{content.title}</h1>
        </div>
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
                <p><b>{content.date}:</b> {new Date(diagnosis.date_result).toLocaleDateString()}</p>
              </div>
              <button
                className="download-button-myDiagnoses"
                onClick={() => handleDownloadClick(diagnosis.pdf_data)}
              >
                <i className="fa-regular fa-file-pdf"></i> {content.downloadPDF}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

}

export default MyDiagnoses;