import React from 'react';
import '../styles/InfoModal.scss';

const InfoModal = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className="info-modal-overlay">
      <div className={`info-modal-card ${type}`}>
        <div className="modal-icon">
          {type === 'success' ? '✅' : '❌'}
        </div>
        <h2>{type === 'success' ? 'Success!' : 'Error'}</h2>
        <p>{message}</p>
        <button className="modal-btn" onClick={onClose}>
          Understood
        </button>
      </div>
    </div>
  );
};

export default InfoModal;