import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import useForm from '../Components/useForm';
import quranImage from './images/l.png';

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
          <label style={styles.label}>اسم المستخدم</label>
          <input
            type="text"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            placeholder="أدخل اسم المستخدم من هنا"
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

          <Link to="/register" style={styles.link}>
            مستخدم جديد؟
          </Link>
        </p>
        <p style={styles.termsText}>
        بتسجيلك في منصة هدى القرآن يعني أنك موافق على{' '}
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
    overflow: 'hidden',
    height: '100%',
    fontFamily: '"Tajawal", sans-serif',
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
    fontFamily: '"Tajawal", sans-serif',
    fontWeight: 'bold',
    fontSize: "24px",
    marginBottom: '1px',
    letterSpacing: "0%",
    textAlign: "center",
    color: "#090909",
  },
  description: {
    fontFamily: '"Tajawal", sans-serif',
    fontWeight: 400,
    fontSize: "14px",
    marginBottom: '10px',
    letterSpacing: "0%",
    textAlign: "center",
    color: "#A5A5A5",
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
    fontFamily: '"Tajawal", sans-serif',
    color: '#555',
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
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
    borderRadius: '8px',
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
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    gap: '0.5rem', // Spacing between the icon and text
  },
  icon: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
  },
  label: {
    fontFamily: '"Tajawal", sans-serif',
    marginBottom: '0.5rem',
    fontSize: '1rem',
    color: '#333',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: '1rem',
    padding: '0.8rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '1rem',
    textAlign: 'right',
    direction: 'rtl',   
  },
  loginButton: {
    padding: '0.8rem',
    backgroundColor: '#1EC8A0',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
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
    color: '#090909',
  },
  termsText: {
    fontSize: '0.9rem',
    color: '#A5A5A5',
    textAlign: 'right',
    marginTop: '0rem',
  },
  termsLink: {
    color: '#090909',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  link: {
    fontFamily: '"Tajawal", sans-serif',
    color: '#090909',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 400,
    letterSpacing: "0%",
    textAlign: "center",
    marginTop: '10px',
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