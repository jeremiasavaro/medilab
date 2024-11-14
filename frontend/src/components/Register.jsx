import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/Register.css';
import registerData from '../assets/components-data/registerData.json';

const Register = ({ setView, language }) => {
  const initialFormState = {
    firstName: '',
    lastName: '',
    password: '',
    repPassword: '',
    address: '',
    email: '',
    dni: '',
    phone: '',
    birthDate: '',
    nationality: '',
    province: '',
    locality: '',
    postalCode: '',
    gender: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState('');
  const [content, setContent] = useState(registerData[language]);
  
  const inputRefs = useRef({}); // Store references dynamically for each field

  useEffect(() => {
    setContent(registerData[language]);
  }, [language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(response.ok ? data.message : data.error);
      if (response.ok) setView('login');
    } catch {
      setMessage('Error en la conexión');
    }
  };

  const handleKeyPress = (e, nextField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextField) inputRefs.current[nextField]?.focus();
    }
  };

  const renderInput = (name, type, label, nextField) => (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        ref={(el) => (inputRefs.current[name] = el)}
        onKeyDown={(e) => handleKeyPress(e, nextField)}
      />
    </div>
  );

  return (
    <div className="gen">
      <div className="register-container">
        <h2><b>{content.createAccount}</b></h2>
        <form className="horizontal-form" onSubmit={handleRegister}>
          {renderInput("firstName", "text", content.firstName, "lastName")}
          {renderInput("lastName", "text", content.lastName, "dni")}
          {renderInput("dni", "text", content.id, "email")}
          {renderInput("email", "email", content.email, "phone")}
          {renderInput("phone", "tel", content.phone, "address")}
          {renderInput("address", "text", content.address, "birthDate")}
          {renderInput("birthDate", "date", content.birthDate, "nationality")}
          {renderInput("nationality", "text", content.nationality, "province")}
          {renderInput("province", "text", content.province, "locality")}
          {renderInput("locality", "text", content.locality, "postalCode")}
          {renderInput("postalCode", "text", content.postalCode, "gender")}
          <div className="input-group">
            <label htmlFor="gender">{content.gender}</label>
            <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                ref={(el) => (inputRefs.current.gender = el)}
                onKeyDown={(e) => handleKeyPress(e, "password")}
            >
              <option value="">{content.select}</option>
              <option value="Male">{content.male}</option>
              <option value="Female">{content.female}</option>
              <option value="Other">{content.other}</option>
            </select>
          </div>
          {renderInput("password", "password", content.password, "repPassword")}
          {renderInput("repPassword", "password", content.confirmPassword, null)}
          <button type="submit">{content.register}</button>
        </form>
        <br></br>
        <p>{content.alreadyHaveAccount}{' '}
          <span onClick={() => setView("login")} className="hover-link">{content.clickHere}</span>
        </p>
        <p><span onClick={() => setView("home")} className="hover-link">{content.mainPage}</span></p>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
