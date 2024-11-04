import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/Register.css';
import registerData from '../assets/components-data/registerData.json'

const Register = ({ setView, language }) => {
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

  // Crear referencias para cada input
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const dniRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const birthDateRef = useRef(null);
  const nationalityRef = useRef(null);
  const provinceRef = useRef(null);
  const localityRef = useRef(null);
  const postalCodeRef = useRef(null);
  const genderRef = useRef(null);
  const passwordRef = useRef(null);
  const repPasswordRef = useRef(null);

  // Usados para cambiar el idioma del contenido
  const [content, setContent] = useState(registerData[language]);

  // Dependiendo del idioma, se muestra un texto u otro
  useEffect(() => {
    setContent(registerData[language]);
  }, [language]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/register', {
        method: 'POST',
        credentials: 'include',
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
        setView('login')
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Error en la conexión');
    }
  };

  const handleKeyPress = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  return (
    <div className="gen">
      <div className="register-container">
        <h2><b>{content.createAccount}</b></h2>
        <br></br>
        <form className="horizontal-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="firstName">{content.firstName}</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              ref={firstNameRef}
              onKeyDown={(e) => handleKeyPress(e, lastNameRef)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="lastName">{content.lastName}</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              ref={lastNameRef}
              onKeyDown={(e) => handleKeyPress(e, dniRef)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="dni">{content.id}</label>
            <input
              type="text"
              id="dni"
              name="dni"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              ref={dniRef}
              onKeyDown={(e) => handleKeyPress(e, emailRef)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">{content.email}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              ref={emailRef}
              onKeyDown={(e) => handleKeyPress(e, phoneRef)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="phone">{content.phone}</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              ref={phoneRef}
              onKeyDown={(e) => handleKeyPress(e, addressRef)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="address">{content.address}</label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              ref={addressRef}
              onKeyDown={(e) => handleKeyPress(e, birthDateRef)}
            />
          </div>
          <div className="input-group">
              <label htmlFor='birthDate'>{content.birthDate}</label>
              <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              ref={birthDateRef}
              onKeyDown={(e) => handleKeyPress(e, nationalityRef)}
              required
              />
          </div>
          <div className="input-group">
              <label htmlFor='nationality'>{content.nationality}</label>
              <input
              type="text"
              id="nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              ref={nationalityRef}
              onKeyDown={(e) => handleKeyPress(e, provinceRef)}
              required
              />
            </div>
            <div className="input-group">
              <label htmlFor='province'>{content.province}</label>
              <input
              type="text"
              id = "province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              ref={provinceRef}
              onKeyDown={(e) => handleKeyPress(e, localityRef)}
              required
              />
            </div>
            <div className="input-group">
              <label htmlFor='locality'>{content.locality}</label>
              <input
              type="text"
              id = "locality"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              ref={localityRef}
              onKeyDown={(e) => handleKeyPress(e, postalCodeRef)}
              required
              />
            </div>
            <div className="input-group">
              <label htmlFor='postalCode'>{content.postalCode}</label>
              <input
              type="text"
              id="postalCode"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              ref={postalCodeRef}
              onKeyDown={(e) => handleKeyPress(e, genderRef)}
              required
              />
            </div>
            <div className="input-group">
              <label htmlFor='gender'>{content.gender}</label>
              <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              ref={genderRef}
              onKeyDown={(e) => handleKeyPress(e, passwordRef)}
              required
              >
                <option value="">{content.select}</option>
                <option value="Male">{content.male}</option>
                <option value="Female">{content.female}</option>
                <option value="Other">{content.other}</option>
              </select>
            </div>
          <div className="input-group">
            <label htmlFor="password">{content.password}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              ref={passwordRef}
              onKeyDown={(e) => handleKeyPress(e, repPasswordRef)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="repPassword">{content.confirmPassword}</label>
            <input
              type="password"
              id="repPassword"
              name="repPassword"
              value={repPassword}
              onChange={(e) => setRepPassword(e.target.value)}
              ref={repPasswordRef}
              onKeyDown={(e) => handleKeyPress(e, null)} // Último campo, no hay "siguiente".
            />
          </div>
          <button type="submit">{content.register}</button>
        </form>
        <p>
          <br></br>
          {content.alreadyHaveAccount},{' '}
          <span
            onClick={() => setView("login")}
            className="hover-link"
          >
            {content.clickHere}
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
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Register;