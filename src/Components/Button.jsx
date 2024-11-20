import React from 'react';

const Button = ({ label, onClick, style, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{ ...styles.button, ...style }}
    >
      {label}
    </button>
  );
};

const styles = {
  button: {
    width: '100%',
    padding: '0.8rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default Button;
