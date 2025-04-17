import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  // Clear access_token and user_role from localStorage
  useEffect(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
  }, []);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>404 - الصفحة غير موجودة</h1>
      <p style={styles.message}>
        عذرًا، المسار الذي تحاول الوصول إليه غير موجود.
      </p>
      <button onClick={handleGoToLogin} style={styles.button}>
        العودة إلى تسجيل الدخول
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f9f9f9',
    fontFamily: '"Tajawal", sans-serif',
    textAlign: 'center',
  },
  header: {
    fontSize: '2.5rem',
    color: '#d32f2f',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.2rem',
    color: '#555',
    marginBottom: '2rem',
  },
  button: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#1EC8A0',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontFamily: '"Tajawal", sans-serif',
  },
};

export default NotFound;