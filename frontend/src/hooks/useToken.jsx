import { useState, useEffect } from 'react';

export const useToken = () => {
  const [token, setToken] = useState('');
  const [messageToken, setMessageToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/auth/obtainToken', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) {
          setToken(data.token);
        } else {
          setMessageToken("No se pudo obtener el token");
        }
      } catch (error) {
        setMessageToken('Error al obtener el token');
      }
    };

    fetchToken();
  }, []);

  return { token, messageToken };
};
