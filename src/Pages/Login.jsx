import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import useForm from '../Components/useForm';
import quranImage from './images/quran.png';

const Login = () => {
  const navigate = useNavigate();
  const initialValues = { usernameOrEmail: '', password: '' };
  const { formData, handleChange, setFormData } = useForm(initialValues);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');  // New state for success message

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Validate input
    if (!formData.usernameOrEmail || !formData.password) {
      setErrorMessage('يرجى ملء كلا الحقلين.');
      return;
    }

    // Retrieve stored user data
    const storedUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (!storedUser) {
      setErrorMessage('لم يتم العثور على مستخدم. يرجى التسجيل أولاً.');
      return;
    }

    // Validate credentials
    if (
      formData.usernameOrEmail === storedUser.email &&
      formData.password === storedUser.password
    ) {
      setErrorMessage('');
      setSuccessMessage('تم تسجيل الدخول بنجاح!');  

      // Hide success message after 1 second and redirect
      setTimeout(() => {
        setSuccessMessage('');  // Clear the success message
        navigate('/student-dashboard');
      }, 1000);
    } else {
      setErrorMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }

    // Reset form data
    setFormData(initialValues);
  };

  return (
    <div style={styles.mainContainer}>
      {/* Left Section */}
      <div style={styles.leftContainer}>
        <h2 style={styles.header}>تسجيل الدخول</h2>
        <p style={styles.description}>
          قم بتسجيل الدخول إلى منصة هدى القرآن باستخدام إحدى الطرق الآتية
        </p>
        <button style={styles.socialButtonGoogle}>
          تسجيل بواسطة جوجل <span style={styles.icon}>G</span>
        </button>
        <button style={styles.socialButtonFacebook}>
          تسجيل بواسطة فيسبوك <span style={styles.icon}>f</span>
        </button>
        <div style={styles.orContainer}>
          <div style={styles.line}></div>
          <span style={styles.orText}>أو</span>
          <div style={styles.line}></div>
        </div>

        <form onSubmit={handleLoginSubmit} style={styles.form}>
          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
          {successMessage && <p style={styles.successMessage}>{successMessage}</p>} {/* Display success message */}
          <label style={styles.label}>البريد الإلكتروني</label>
          <input
            type="text"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            placeholder="أدخل بريدك الإلكتروني هنا"
            style={styles.input}
          />

          <label style={styles.label}>كلمة المرور</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="أدخل كلمة المرور هنا"
            style={styles.input}
          />

          <button type="submit" style={styles.loginButton}>
            تسجيل الدخول
          </button>
        </form>

        <p style={styles.registerText}>
          مستخدم جديد؟{' '}
          <Link to="/register" style={styles.link}>
            سجل الآن
          </Link>
        </p>
        <p style={styles.termsText}>
          باستخدامك في منصة هدى القرآن فأنت توافق على{' '}
          <Link to="/terms" style={styles.termsLink}>
            شروط الاستخدام
          </Link>{' '}
          و{' '}
          <Link to="/privacy" style={styles.termsLink}>
            قوانين الخصوصية
          </Link>
        </p>
      </div>

      {/* Right Section */}
      <div style={styles.rightContainer}>
        <img
          src={quranImage}
          alt="Quran Illustration"
          style={styles.rightImage}
        />
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
  socialButtonGoogle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    padding: '0.8rem',
    margin: '0.5rem 0',
    backgroundColor: '#db4437',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    gap: '0.5rem', // Spacing between the icon and text
  },
  socialButtonFacebook: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    padding: '0.8rem',
    margin: '0.5rem 0',
    backgroundColor: '#3b5998',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    gap: '0.5rem', // Spacing between the icon and text
  },
  icon: {
    fontSize: '1.5rem', // Adjust icon size
    fontWeight: 'bold', // Make it prominent
  },
  orContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    margin: '1rem 0',
  },
  line: {
    flex: 1,
    height: '1px',
    backgroundColor: '#ccc',
    margin: '0 1rem',
  },
  orText: {
    fontSize: '1rem',
    color: '#555',
    whiteSpace: 'nowrap',
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
    direction: 'rtl',   
  },
  loginButton: {
    padding: '0.8rem',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  errorMessage: {
    color: 'red',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  successMessage: {
    color: 'green',
    fontSize: '1rem',
    marginBottom: '1rem',
  },
  registerText: {
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: '#555',
  },
  termsText: {
    fontSize: '0.9rem',
    color: '#555',
    textAlign: 'right',
    marginTop: '0rem',
  },
  termsLink: {
    color: '#4caf50',
    textDecoration: 'underline',
    fontWeight: 'bold',
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

export default Login;