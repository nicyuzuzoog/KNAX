// components/BackButton/BackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './BackButton.css';

const BackButton = ({ to, text = 'Back' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleClick} className="back-button">
      <FaArrowLeft />
      <span>{text}</span>
    </button>
  );
};

export default BackButton;