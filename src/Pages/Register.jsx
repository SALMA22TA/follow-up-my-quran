import { useState } from "react";
// import axios from "axios";
import { useNavigate } from 'react-router-dom';

import quranImage from './images/q.png';
import { Link } from 'react-router-dom';
// import Verification from "./Verification";
import { register } from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setMessage('تم التسجيل بنجاح!');
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8000/api/auth/register",
  //       null,
  //       {
  //         params: formData,
  //       }
  //     );
  //     setMessage(response.data.message);
  //   } catch (error) {
  //     setMessage("Registration failed. Please try again.");
  //     console.error(error);
  //   }
  //   // Redirect to login page after success
  //   setTimeout(() => {
  //     navigate('/verify');
  //   }, 1000);
  // };
  /****************************************** */
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setMessage("");
  
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8000/api/auth/register",
  //       formData // هنا بدل null و params
  //     );
  
  //     setMessage(response.data.message);
  
  //     // انتقلي لصفحة التحقق بعد نجاح التسجيل
  //     setTimeout(() => {
  //       navigate('/verify', { state: { userId: response.data.user_id } });
  //     },);
  
  //   } catch (error) {
  //     setMessage("فشل في التسجيل. يرجى المحاولة مرة أخرى.");
  //     console.error(error);
  //   }
  // };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await register(formData);
      setMessage(response.message);
      setTimeout(() => {
        navigate('/verify', { state: { userId: response.user_id } });
      }, 1000);
    } catch (error) {
      setMessage("فشل في التسجيل. يرجى المحاولة مرة أخرى.");
      console.error(error);
    }
  };

  return (
    <div 

    style={styles.mainContainer}>
      {/* Left Section */}
      <div 

      style={styles.leftContainer}>
        <h2 

        style={styles.header}>إنشاء حساب جديد</h2>
        <p 

        style={styles.description}>قم بتسجيل الدخول إلى منصة هدى القرآن باستخدام إحدى الطرق التالية</p>

        <button style={styles.googleButton}>تسجيل بواسطة جوجل <span style={styles.icon}>G</span></button>
        <button style={styles.facebookButton}>تسجيل بواسطة فيسبوك <span style={styles.icon}>f</span></button>

        <div style={styles.orContainer}>
          <div style={styles.line}></div>
          <span style={styles.orText}>أو</span>
          <div style={styles.line}></div>
        </div>
        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit} 

        style={styles.form}>
          <label 

          style={styles.label}>اسم المستخدم</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="أدخل اسمك الكامل هنا"
            
            style={styles.input}
            required
          />
          <label 

          style={styles.label}>البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            placeholder="أدخل بريدك الإلكتروني هنا"
            value={formData.email}
            onChange={handleChange}
            
            style={styles.input}
            required
          />
          <label 

          style={styles.label}>كلمة المرور</label>
          <input
            type="password"
            name="password"
            placeholder="أدخل كلمة المرور هنا"
            value={formData.password}
            onChange={handleChange}
            
            style={styles.input}
            required
          />
          <button type="submit" style={styles.registerButton}>إنشاء حساب جديد</button>
        </form>

          <Link to="/login" 

          style={styles.link}>
            تسجيل الدخول؟
          </Link>
          <p style={styles.loginText}>
          بتسجيلك في منصة هدى القرآن يعني أنك موافق على{' '}
          <Link to="/terms" 

          style={styles.link}>شروط الاستخدام</Link> و{' '}
          <Link to="/privacy" 

          style={styles.link}>قوانين الخصوصية</Link>
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
  rightContainer: {
    flex: 1,
  },
  rightImage: {
    width: '100%',
    height: '100%',
  },
  icon: {
    fontSize: '1.4rem', 
    fontWeight: 'bold',
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
  googleButton: {
    width: '80%',
    padding: '10px',
    backgroundColor: '#db4437',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  facebookButton: {
    width: '80%',
    padding: '10px',
    backgroundColor: '#4267B2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
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
    fontFamily: '"Tajawal", sans-serif',
    color: '#555',
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
  },
  errorMessage: {
    fontFamily: '"Tajawal", sans-serif',
    color: 'red',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  successMessage: {
    fontFamily: '"Tajawal", sans-serif',
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
    fontFamily: '"Tajawal", sans-serif',
    marginBottom: '0.5rem',
    fontSize: '1rem',
    color: '#333',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  input: {
    fontFamily: '"Tajawal", sans-serif',
    marginBottom: '1rem',
    padding: '0.8rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '1rem',
    textAlign: 'right',
    direction: 'rtl', 
  },
  registerButton: {
    fontFamily: '"Tajawal", sans-serif',
    padding: '0.8rem',
    backgroundColor: '#1EC8A0',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  loginText: {
    fontFamily: '"Tajawal", sans-serif',
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: "#A5A5A5",
  },
  link: {
    fontFamily: '"Tajawal", sans-serif',
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