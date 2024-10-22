// src/components/Doctors.jsx

import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';

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

      <Carousel controls={true} indicators={false} interval={null}>
        {doctors.map((doctor, index) => (
          <Carousel.Item key={index}>
            <div className="d-flex justify-content-center align-items-center">
              <div className="team-member text-center">
                <h4>{doctor.first_name} {doctor.last_name}</h4>
                <span>{doctor.speciality}</span>
                <br></br>
                <span>{doctor.email}</span>
              </div>
              {index + 1 < doctors.length && (
                <div className="team-member text-center">
                  <h4>{doctors[index + 1].first_name} {doctors[index + 1].last_name}</h4>
                  <span>{doctors[index + 1].speciality}</span>
                  <br></br>
                  <span>{doctors[index + 1].email}</span>
                </div>
              )}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
}

export default Doctors;
