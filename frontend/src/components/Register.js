import React, { useState } from 'react';
import '../assets/css/Register.css';

const Register = ({ toggleForm }) => {
  // Define los estados para todos los campos del formulario.
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [repPassword, setRepPassword] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [nationality, setNationality] = useState('');
  const [province, setProvince] = useState('');
  const [locality, setLocality] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [gender, setGender] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName, lastName, password, repPassword, address, email, dni, phone, birthDate,
          nationality, province, locality, postalCode, gender,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Error en la conexión');
    }
  };

  return (
      <div className="register-container">
        <div className="register-form">
          <h2>Register</h2>
          <form onSubmit={handleRegister} className="horizontal-form">
            <div className="input-group">
              <label>First Name:</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label>Last Name:</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label>Repeat Password:</label>
              <input type="password" value={repPassword} onChange={(e) => setRepPassword(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label>Address:</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label>Mail:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label>DNI:</label>
              <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label>Phone:</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label>Birth Date:</label>
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label>Nationality:</label>
              <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label>Province:</label>
              <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label>Locality:</label>
              <input type="text" value={locality} onChange={(e) => setLocality(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label>Postal Code:</label>
              <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label>Gender:</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button type="submit">Register</button>
          </form>
          {message && <p className="message">{message}</p>}
          <p>
            Already have an account?{' '}
            <span onClick={toggleForm} className="hover-link">click here</span>.
          </p>
        </div>
      </div>
  );
};

export default Register;
