import { useState, useEffect } from 'react';

export const useGetDoctors = () => {
  // State to store doctors data
  const [doctors, setDoctors] = useState([]);
  // State to store message related to doctors
  const [messageDoctors, setMessageDoctors] = useState('');
  // State to manage loading status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch doctors data from the server
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/inquiries/doctors');
        const data = await response.json();
        console.log('Doctors data:', data);
        setDoctors(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Return loading message if data is still being fetched
  if (loading) {
    return <p>Loading...</p>;
  }

  // Return doctors data and message
  return { doctors, messageDoctors };
};