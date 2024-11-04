import React, { useState, useEffect } from 'react';
import '../assets/css/Login.css';
import loginData from '../assets/components-data/loginData.json'

const Login = ({ view, setView, isLogged, setIsLogged, language }) => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  // Usados para cambiar el idioma del contenido
  const [content, setContent] = useState(loginData[language]);

  // Dependiendo del idioma, se muestra un texto u otro
  useEffect(() => {
    setContent(loginData[language]);
  }, [language]);

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
        setIsLogged(true); // Cambia a true si el login es exitoso
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
          <h2><b>{content.welcome}</b></h2>
          <br />
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="dni">{content.dni}</label>
              <input
                type="text"
                id="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">{content.password}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="login-btn">{content.login}</button>
            {message && <p className="message">{message}</p>}
          </form>
          <p>
            <br />
            {content.notRegistered},{' '}
            <span
              onClick={() => setView("register")}
              className="hover-link"
            >
              {content.click}
            </span>
          </p>
          <p>
            {' '}
            <span
              onClick={() => {
                setView("home");
              }}
              className="hover-link"
            >
              {content.mainPage}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
