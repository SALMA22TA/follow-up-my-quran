import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import quranImage from './images/quran.png';

const Register = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!registerData.username || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setErrorMessage('يرجى ملء جميع الحقول.');
      setSuccessMessage('');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage('كلمتا المرور غير متطابقتين.');
      setSuccessMessage('');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('تم التسجيل بنجاح!');

    // Store registered user (mock storage)
    const user = {
      email: registerData.email,
      password: registerData.password,
    };
    localStorage.setItem('registeredUser', JSON.stringify(user));

    // Reset form data
    setRegisterData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    // Redirect to login page after success
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div style={styles.mainContainer}>
      {/* Left Section */}
      <div style={styles.leftContainer}>
        <h2 style={styles.header}>إنشاء حساب جديد</h2>
        <p style={styles.description}>قم بإنشاء حساب في منصة هدى القرآن وابدأ رحلتك الآن</p>

        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>اسم المستخدم</label>
          <input
            type="text"
            name="username"
            value={registerData.username}
            onChange={handleChange}
            placeholder="أدخل اسم المستخدم هنا"
            style={styles.input}
          />

          <label style={styles.label}>البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            value={registerData.email}
            onChange={handleChange}
            placeholder="أدخل بريدك الإلكتروني هنا"
            style={styles.input}
          />

          <label style={styles.label}>كلمة المرور</label>
          <input
            type="password"
            name="password"
            value={registerData.password}
            onChange={handleChange}
            placeholder="أدخل كلمة المرور هنا"
            style={styles.input}
          />

          <label style={styles.label}>تأكيد كلمة المرور</label>
          <input
            type="password"
            name="confirmPassword"
            value={registerData.confirmPassword}
            onChange={handleChange}
            placeholder="أعد إدخال كلمة المرور"
            style={styles.input}
          />

          <button type="submit" style={styles.registerButton}>إنشاء حساب</button>
        </form>

        <p style={styles.loginText}>
          لديك حساب بالفعل؟{' '}
          <Link to="/login" style={styles.link}>
            سجل دخولك الآن
          </Link>
        </p>
      </div>

      {/* Right Section */}
      <div style={styles.rightContainer}>
        <img src={quranImage} alt="Quran Illustration" style={styles.rightImage} />
      </div>
    </div>
  );
};

const styles = {
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    fontFamily: '"Arial", sans-serif',
  },
  leftContainer: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  header: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: '#333',
  },
  description: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '1.5rem',
  },
  errorMessage: {
    color: 'red',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  successMessage: {
    color: 'green',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
  },
  label: {
    marginBottom: '0.5rem',
    fontSize: '1rem',
    color: '#333',
    textAlign: 'right',
  },
  input: {
    marginBottom: '1rem',
    padding: '0.8rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem',
    textAlign: 'right',
    direction: 'rtl', // Arabic text alignment
  },
  registerButton: {
    padding: '0.8rem',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  loginText: {
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: '#555',
  },
  link: {
    color: '#4caf50',
    textDecoration: 'none',
  },
  rightContainer: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
  },
  rightImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
};

export default Register;
