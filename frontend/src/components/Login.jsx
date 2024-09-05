import React, { useState } from 'react';
import '../assets/css/Login.css';

const Login = ({toggleForm, setView}) => {
  // Define los estados para username, password y message usando el hook useState.
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Función que maneja el envío del formulario.
  const handleLogin = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página).

    try {
      // Realiza una solicitud POST al servidor para autenticar al usuario.
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indica que el cuerpo de la solicitud está en formato JSON.
        },
        body: JSON.stringify({ dni, password }), // Convierte los valores de username y password a JSON.
      });

      const data = await response.json(); // Parsea la respuesta del servidor como JSON.

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Error en la conexión');
    }
  };

  // JSX que define la estructura y el contenido del formulario de login.
  return (
    <div className = "gen">
      <div className="login-container">
      <br></br>
      <h2><b>Welcome to Medilab</b></h2>
      <br></br>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="dni">DNI</label>
          <input
            type = "text"
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
        {message && <p className="message">{message}</p>} {}
      </form>
      <br></br>
      <p>
        If you're not registered,{' '}
        <span
          onClick={() => setView("register")}
          className="hover-link"
        >
          click here
        </span>
      </p>
    </div>
  </div>
);
}

export default Login;