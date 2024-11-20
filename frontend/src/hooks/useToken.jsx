import { useState, useEffect } from 'react';

export const useToken = () => {
  // State to store the token
  const [token, setToken] = useState('');
  // State to store the message related to the token
  const [messageToken, setMessageToken] = useState('');

  useEffect(() => {
    // Function to fetch the token from the server
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
          // Set the token to state
          setToken(data.token);
        } else {
          // Set error message if token could not be obtained
          setMessageToken("Could not get token");
        }
      } catch (error) {
        // Set error message if there was an error during fetch
        setMessageToken("Error getting token");
      }
    };

    fetchToken();
  }, []);

  // Return the token and message
  return { token, messageToken };
};