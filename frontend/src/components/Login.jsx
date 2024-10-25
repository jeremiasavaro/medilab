import React, { useState } from 'react';
import '../assets/css/Login.css';

const Login = ({ view, setView, isLoged, setIsLoged }) => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsLoged(true);  // Cambia a true si el login es exitoso
        setView('home')
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Error en la conexión');
    }
  };

  return (
    <div className='gen'>
      <div className="login-container">
        <div className="login-form">
          <br />
          <h2><b>Welcome to Medilab</b></h2>
          <br />
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="dni">DNI</label>
              <input
                type="text"
                id="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="login-btn">Login</button>
            {message && <p className="message">{message}</p>}
          </form>
          <p>
            <br />
            If you're not registered,{' '}
            <span
              onClick={() => setView("register")}
              className="hover-link"
            >
              click here
            </span>
            .
          </p>
          <p>
            {' '}
            <span
              onClick={() => {
                setView("home");
              }}
              className="hover-link"
            >
              Back to main page
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
