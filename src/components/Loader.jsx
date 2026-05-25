import React from 'react';
import { ClipLoader } from 'react-spinners';
import '../styles/Loader.scss';

const Loader = ({ message = "Pobieranie danych..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <ClipLoader color="#3498db" size={60} />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Loader;