// src/components/Doctors.jsx

import React, { useState, useRef, useEffect } from 'react';
import doctorsBg from "../assets/img/doctors/doctors-1.jpg";

function Doctors() {

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <section id="doctors" className="doctors section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Doctors</h2>
        <p>These are the professionals we have.</p>
      </div>

      <div className="container">
        <div className="row gy-4">
          {doctors.map((doctor, index) => (
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100" key={index}>
              <div className="team-member d-flex align-items-start">
                <div className="member-info">
                  <h4>{doctor.first_name} {doctor.last_name}</h4>
                  <span>{doctor.speciality}</span>
                  {/* Agrega más información del doctor si es necesario */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Doctors;
