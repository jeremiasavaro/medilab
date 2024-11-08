import React, { useState, useEffect } from 'react';
import '../assets/css/Login.css';
import loginData from '../assets/components-data/loginData.json';

const Login = ({ setView, setIsLogged, language }) => {
  const [formData, setFormData] = useState({ dni: '', password: '' });
  const [message, setMessage] = useState('');
  const [content, setContent] = useState(loginData[language]);

  useEffect(() => {
    setContent(loginData[language]);
  }, [language]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsLogged(true);
        setView('home');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Error en la conexión');
    }
  };

  const renderLink = (text, view) => (
    <span onClick={() => setView(view)} className="hover-link">{text}</span>
  );

  return (
    <div className="gen">
      <div className="login-container">
        <div className="login-form">
          <h2><b>{content.welcome}</b></h2>
          <form onSubmit={handleLogin}>
            {['dni', 'password'].map((field) => (
              <div key={field} className="input-group">
                <label htmlFor={field}>{content[field]}</label>
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <button type="submit" className="login-btn">{content.login}</button>
            {message && <p className="message">{message}</p>}
          </form>
          <br></br>
          <p>{content.notRegistered}, {renderLink(content.click, 'register')}</p>
          <p>{renderLink(content.mainPage, 'home')}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
