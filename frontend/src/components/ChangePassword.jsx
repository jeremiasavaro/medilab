import React from 'react';
import "../assets/css/changePassword.css"

const ChangePassword = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Si no está abierto, no se renderiza

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h1><b>Change Password</b></h1>
        <br></br>
        <form>
          <div className="form-group">
            <label>Current password</label>
            <input type="password" placeholder="Enter current password" />
          </div>
          <div className="form-group">
            <label>New password</label>
            <input type="password" placeholder="Enter new password" />
          </div>
          <div className="form-group">
            <label>Repeat new password</label>
            <input type="password" placeholder="Repeat new password" />
          </div>
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Change Password</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
