import React, { useState, useEffect } from 'react';
import '../assets/css/Account.css';
import ChangePassword from './ChangePassword';
import ConfirmModifications from './ConfirmModifications';
import DeleteAccount from './DeleteAccount';
import { useJwt } from "react-jwt";
import accountData from '../assets/components-data/accountData.json';
import { useToken } from '../hooks/useToken';
import MyDiagnoses from './MyDiagnoses';
import { useObtainData } from "../hooks/useObtainData";

const Account = ({ setView, setIsLogged, language, setIsTransitioning, isTransitioning }) => {
  // Initial component state
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    nationality: '',
    province: '',
    locality: '',
    postalCode: '',
    gender: '',
    message: '',
    selectedFile: null,
    image_url: '',
    isChangePasswordModalOpen: false,
    deleteAccount: false,
    confirmModifications: false,
    myDiagnoses: false,
    content: accountData[language],
  });

  // Get the token and decode it
  const { token } = useToken();
  const { decodedToken, isExpired } = useJwt(token || '');

  // Handle the transition out
  const handleTransitionOut = (targetView) => {
    setIsTransitioning("out");
    setTimeout(() => {
      setIsTransitioning("null");
      setView(targetView);
    }, 1500);
  };

  // Update content when language changes
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      content: accountData[language],
    }));
  }, [language]);

  // Obtain user data
  useObtainData(token, decodedToken, isExpired,
    (firstName) => setState((prev) => ({ ...prev, firstName })),
    (lastName) => setState((prev) => ({ ...prev, lastName })),
    (email) => setState((prev) => ({ ...prev, email })),
    (dni) => setState((prev) => ({ ...prev, dni })),
    (phone) => setState((prev) => ({ ...prev, phone })),
    (address) => setState((prev) => ({ ...prev, address })),
    (birthDate) => setState((prev) => ({ ...prev, birthDate })),
    (nationality) => setState((prev) => ({ ...prev, nationality })),
    (province) => setState((prev) => ({ ...prev, province })),
    (locality) => setState((prev) => ({ ...prev, locality })),
    (postalCode) => setState((prev) => ({ ...prev, postalCode })),
    (gender) => setState((prev) => ({ ...prev, gender })),
    (image_url) => setState((prev) => ({ ...prev, image_url })),
    (message) => setState((prev) => ({ ...prev, message }))
  );

  // Handle file change
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setState((prev) => ({ ...prev, selectedFile: file }));
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/image/upload_image', {
          method: 'POST',
          headers: {
            'Authorization': token,
          },
          body: formData,
        });

        const data = await response.json();
        setState((prev) => ({ ...prev, image_url: data.image_url }));
      } catch (error) {
        console.error('Error uploading the image:', error);
      }
    }
  };

  // Handle account form submission
  const handleAccount = async (e) => {
    e.preventDefault();
  };

  // Form group component
  const FormGroup = ({ label, value, onChange, type = "text", options }) => (
    <div className="form-group">
      <label>{label}</label>
      {type === "select" ? (
        <select value={value} onChange={onChange} required>
          <option value="">{label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} value={value} onChange={onChange} />
      )}
    </div>
  );

  // Sidebar item component
  const SidebarItem = ({ icon, label, onClick, className = "" }) => (
    <li onClick={onClick} className={className}>
      <i className={icon}></i> {label}
    </li>
  );

  const { content } = state;

  return (
    <section id="account" className="contentAccount">
      <div className={isTransitioning=="out" ? "transitionOut-active" : "contentAccount"}>
        <div className="sidebar">
          <div className="logo">{content.yourProfile}</div>
          <ul>
            <SidebarItem icon="fa-solid fa-notes-medical" label={content.myDiagnoses} onClick={() => setState((prev) => ({ ...prev, myDiagnoses: true }))} />
            <SidebarItem icon="fa-solid fa-key" label={content.changePassword} onClick={() => setState((prev) => ({ ...prev, isChangePasswordModalOpen: true }))} />
            <SidebarItem icon="fa-solid fa-trash" label={content.deleteAccount} onClick={() => setState((prev) => ({ ...prev, deleteAccount: true }))} className="delete" />
          </ul>
          <ul>
            <SidebarItem icon="fa-solid fa-right-to-bracket" label={content.mainPage} onClick={() => setView('home')} />
          </ul>
        </div>

        <div className="account-container">
          <div className="account-content">
            <h1><b>{content.personalData}</b></h1>
            <div className="profile-section">
              <div className="profile-info">
                <div>
                  <input
                    id="file-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  {state.image_url && (
                    <div>
                      <br />
                      <img
                        src={state.image_url}
                        className="profile-pic"
                        alt="Uploaded"
                        style={{ maxWidth: '200px', borderRadius: '50%' }}
                      />
                    </div>
                  )}
                  <label htmlFor="file-upload" className="custom-file-upload">
                    {state.image_url ? content.changeImage : content.profileImage}
                  </label>
                  <br />
                </div>
              </div>
              <br />
              <form className="horizontal-form" onSubmit={handleAccount}>
                <div className="account-form">
                  <FormGroup label={content.name} value={state.firstName} onChange={(e) => setState((prev) => ({ ...prev, firstName: e.target.value }))} />
                  <FormGroup label={content.lastName} value={state.lastName} onChange={(e) => setState((prev) => ({ ...prev, lastName: e.target.value }))} />
                  <FormGroup label={content.id} value={state.dni} onChange={(e) => setState((prev) => ({ ...prev, dni: e.target.value }))} />
                  <FormGroup label={content.email} value={state.email} onChange={(e) => setState((prev) => ({ ...prev, email: e.target.value }))} />
                  <FormGroup label={content.phone} value={state.phone} onChange={(e) => setState((prev) => ({ ...prev, phone: e.target.value }))} />
                  <FormGroup label={content.address} value={state.address} onChange={(e) => setState((prev) => ({ ...prev, address: e.target.value }))} />
                  <FormGroup label={content.birthDate} type="date" value={state.birthDate} onChange={(e) => setState((prev) => ({ ...prev, birthDate: e.target.value }))} />
                  <FormGroup label={content.nationality} value={state.nationality} onChange={(e) => setState((prev) => ({ ...prev, nationality: e.target.value }))} />
                  <FormGroup label={content.province} value={state.province} onChange={(e) => setState((prev) => ({ ...prev, province: e.target.value }))} />
                  <FormGroup label={content.locality} value={state.locality} onChange={(e) => setState((prev) => ({ ...prev, locality: e.target.value }))} />
                  <FormGroup label={content.postalCode} value={state.postalCode} onChange={(e) => setState((prev) => ({ ...prev, postalCode: e.target.value }))} />
                  <FormGroup
                    label={content.gender}
                    type="select"
                    value={state.gender}
                    onChange={(e) => setState((prev) => ({ ...prev, gender: e.target.value }))}
                    options={[content.male, content.female, content.other]}
                  />
                  <button type="submit" className="submit-button" onClick={() => setState((prev) => ({ ...prev, confirmModifications: true }))}>
                    {content.saveChanges}
                  </button>
                </div>
              </form>
              {state.message && <p className="message">{state.message}</p>}
            </div>
          </div>
        </div>

        {/* Modal components */}
        <ChangePassword language={language} isOpen={state.isChangePasswordModalOpen} onClose={() => setState((prev) => ({ ...prev, isChangePasswordModalOpen: false }))} />
        <ConfirmModifications
          notConfirmed={state.confirmModifications}
          confirmed={() => setState((prev) => ({ ...prev, confirmModifications: false }))}
          firstName={state.firstName}
          lastName={state.lastName}
          email={state.email}
          phone={state.phone}
          dni={state.dni}
          address={state.address}
          nationality={state.nationality}
          province={state.province}
          locality={state.locality}
          birthDate={state.birthDate}
          postalCode={state.postalCode}
          gender={state.gender}
          message={state.message}
          language={language}
        />
        <DeleteAccount setView={setView} setIsLogged={setIsLogged} Delete={state.deleteAccount} del={() => setState((prev) => ({ ...prev, deleteAccount: false }))} language={language} />
        <MyDiagnoses isOpen={state.myDiagnoses} onClose={() => setState((prev) => ({ ...prev, myDiagnoses: false }))} language={language} />
      </div>
    </section>
  );
};

export default Account;