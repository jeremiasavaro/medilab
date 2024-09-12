import React, { useState } from 'react';

const XrayService = () =>{
    const [message, setMessage] = useState('');
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
    return (
        <div className = "gen" > 
            <h2>Request X-ray Service</h2>
            <br></br>
            <p>
              --
            </p>
        </div>
    );
}   
export default XrayService;