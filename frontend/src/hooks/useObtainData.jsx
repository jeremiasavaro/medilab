import { useEffect } from "react";

export const useObtainData = (token, decodedToken, isExpired, setFirstName, setLastName, setEmail, setDni, setPhone, setAddress, setBirthDate, setNationality, setProvince, setLocality, setPostalCode, setGender, setImageUrl, setMessage) => {
  
  const formatInputDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toISOString().split('T')[0]; 
  };
  
  useEffect(() => {
    const setData = async () => {
      if (token && decodedToken) {
        try {
          const response = await fetch('http://127.0.0.1:5000/user/obtainData', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            },
          });

          const data = await response.json();
          if (response.ok) {
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setEmail(data.email);
            setDni(data.dni);
            setPhone(data.phone);
            setAddress(data.address);
            const formattedDate = formatInputDate(data.birthDate);
            setBirthDate(formattedDate);
            setNationality(data.nationality);
            setProvince(data.province);
            setLocality(data.locality);
            setPostalCode(data.postalCode);
            setGender(data.gender);
            setImageUrl(data.imagePatient);
          } else {
            setMessage('No se pudo obtener los datos');
          }
        } catch (error) {
          setMessage('Error al obtener los datos');
        }
      }
    };

    setData();
  }, [token, decodedToken, isExpired]);
};