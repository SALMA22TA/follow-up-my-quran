import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import quranImage from './images/q.png';

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
        <p style={styles.description}>قم بتسجيل الدخول إلى منصة هدى القرآن باستخدام إحدى الطرق التالية</p>

        <button style={styles.googleButton}>تسجيل بواسطة جوجل <span style={styles.icon}>G</span></button>
        <button style={styles.facebookButton}>تسجيل بواسطة فيسبوك <span style={styles.icon}>f</span></button>

        <div style={styles.orContainer}>
          <div style={styles.line}></div>
          <span style={styles.orText}>أو</span>
          <div style={styles.line}></div>
        </div>

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

          <button type="submit" style={styles.registerButton}>إنشاء حساب جديد</button>
        </form>

          <Link to="/login" style={styles.link}>
            تسجيل الدخول؟
          </Link>
          <p style={styles.loginText}>
          بتسجيلك في منصة هدى القرآن يعني أنك موافق على{' '}
          <Link to="/terms" style={styles.link}>شروط الاستخدام</Link> و{' '}
          <Link to="/privacy" style={styles.link}>قوانين الخصوصية</Link>
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
    overflow: 'hidden',
    height: '100%',
    fontFamily: "'Cairo', sans-serif",
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
  rightContainer: {
    flex: 1,
  },
  rightImage: {
    width: '100%',
    height: '100%',
  },
  icon: {
    fontSize: '1.2rem', 
    fontWeight: 'bold',
  },
  header: {
    fontFamily: "'Cairo', sans-serif",
    fontWeight: 'bold',
    fontSize: "24px",
    marginBottom: '1px',
    letterSpacing: "0%",
    textAlign: "center",
    color: "#090909",
  },
  description: {
    fontFamily: "'Cairo', sans-serif",
    fontWeight: 400,
    fontSize: "14px",
    marginBottom: '10px',
    letterSpacing: "0%",
    textAlign: "center",
    color: "#A5A5A5",
  },
  googleButton: {
    width: '80%',
    padding: '10px',
    backgroundColor: '#db4437',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  facebookButton: {
    width: '80%',
    padding: '10px',
    backgroundColor: '#4267B2',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
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
    fontFamily: "'Cairo', sans-serif",
    color: '#555',
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
  },
  errorMessage: {
    fontFamily: "'Cairo', sans-serif",
    color: 'red',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  successMessage: {
    fontFamily: "'Cairo', sans-serif",
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
    fontFamily: "'Cairo', sans-serif",
    marginBottom: '0.5rem',
    fontSize: '1rem',
    color: '#333',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  input: {
    fontFamily: "'Cairo', sans-serif",
    marginBottom: '1rem',
    padding: '0.8rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem',
    textAlign: 'right',
    direction: 'rtl', // Arabic text alignment
  },
  registerButton: {
    fontFamily: "'Cairo', sans-serif",
    padding: '0.8rem',
    backgroundColor: '#1EC8A0',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  loginText: {
    fontFamily: "'Cairo', sans-serif",
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: "#A5A5A5",
  },
  link: {
    fontFamily: "'Cairo', sans-serif",
    color: '#090909',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: "0%",
    textAlign: "center",
    marginTop: '10px',
  },
};

export default Register;