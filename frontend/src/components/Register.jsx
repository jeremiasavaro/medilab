import React, { useState } from 'react';
import '../assets/css/Register.css';

const Register = ({ toggleForm, setView }) => {
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
    <div className="gen">
      <div className="register-container">
        <h2><b>Create your account</b></h2>
        <br></br>
        <form className="horizontal-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="dni">DNI</label>
            <input
              type="text"
              id="dni"
              name="dni"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="input-group">
              <label htmlFor='birthDate'>Birth Date:</label>
              <input 
              type="date" 
              id="birthDate"
              value={birthDate} 
              onChange={(e) => setBirthDate(e.target.value)} required/>
          </div>
          <div className="input-group">
              <label htmlFor='nationality'>Nationality:</label>
              <input 
              type="text" 
              id="nationality"
              value={nationality} 
              onChange={(e) => setNationality(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label htmlFor='province'>Province:</label>
              <input 
              type="text" 
              id = "province"
              value={province} 
              onChange={(e) => setProvince(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label htmlFor='locality'>Locality:</label>
              <input 
              type="text" 
              id = "locality"
              value={locality} 
              onChange={(e) => setLocality(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label htmlFor='postalCode'>Postal Code:</label>
              <input 
              type="text" 
              value={postalCode} 
              onChange={(e) => setPostalCode(e.target.value)} required/>
            </div>
            <div className="input-group">
              <label htmlFor='gender'>Gender:</label>
              <select 
              value={gender} 
              onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="repPassword">Confirm Password</label>
            <input
              type="password"
              id="repPassword"
              name="repPassword"
              value={repPassword}
              onChange={(e) => setRepPassword(e.target.value)}
            />
          </div>
          <button type="submit">Register</button>
        </form>
        <p>
          <br></br>
          Already have an account?,{' '}
          <span
            onClick={() => setView("login")}
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
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
