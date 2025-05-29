// @ts-ignore
import React from 'react';

// @ts-ignore
const Form = ({ children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} 
// @ts-ignore
    style={styles.form}>
      {children}
    </form>
  );
};

const styles = {
  form: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

export default Form;
