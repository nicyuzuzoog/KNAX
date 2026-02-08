import React from 'react';
import './Loader.css';

const Loader = ({ fullScreen = true, size = 'large' }) => {
  if (fullScreen) {
    return (
      <div className="loader-overlay">
        <div className="loader-container">
          <div className="loader">
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-center"></div>
          </div>
          <p className="loader-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`loader-inline ${size}`}>
      <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;