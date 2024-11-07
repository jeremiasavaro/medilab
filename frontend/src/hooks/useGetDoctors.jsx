import { useState, useEffect } from 'react';

export const useGetDoctors = () => {

    const [doctors, setDoctors] = useState([]);
    const [mesaggeDoctors, setMessageDoctors] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    if (loading) {
        return <p>Loading...</p>;
    }

    return { doctors, mesaggeDoctors };
};
