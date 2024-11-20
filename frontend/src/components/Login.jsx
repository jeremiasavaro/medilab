import React, { useState, useEffect } from 'react';
import '../assets/css/Login.css';
import loginData from '../assets/components-data/loginData.json';

const Login = ({ setView, setIsLogged, language, setIsTransitioning, isTransitioning }) => {
  // State to manage form data
  const [formData, setFormData] = useState({ dni: '', password: '' });
  // State to manage messages
  const [message, setMessage] = useState('');
  // State to hold the content based on the selected language
  const [content, setContent] = useState(loginData[language]);

  // Handle view transition out
  const handleTransitionOut = (targetView) => {
    setTimeout(() => {
      setIsTransitioning("null");
      setView(targetView);
    }, 1500);
  };

  // Update content when language changes
  useEffect(() => {
    setContent(loginData[language]);
  }, [language]);

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Handle form submission for login
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
      setMessage('Connection error');
    }
  };

  // Render link with text and view
  const renderLink = (text, view) => (
    <span onClick={() => setView(view)} className="hover-link">{text}</span>
  );

  return (
    <div className='gen'>
      <div className={isTransitioning=="out" ? "transitionOut-active" : "gen"}>
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
    </div>
  );
};

export default Login;