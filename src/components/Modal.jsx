// Modal.js
import React from 'react';

const Modal = ({ children, isVisible, onClose }) => {
  if (!isVisible) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();  // Close when overlay is clicked
    }
  };

  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-20" 
      onClick={handleOverlayClick}
    >
      {children}
    </div>
  );
};

export default Modal;
