import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import quranImage from './images/l.png';
import { login } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(location.state?.isError || false);
  const [message, setMessage] = useState(location.state?.message || searchParams.get('message') || "");

  useEffect(() => {
    if (!message) return;
  
    const timer = setTimeout(() => {
      setMessage("");
      setIsError(false);
    }, isError ? 4000 : 3000); // 4 seconds for error message, 3 seconds for others
  
    return () => clearTimeout(timer);
  }, [message, isError]);
  

  
const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    if (!formData.email || !formData.password) {
      setMessage("يرجى ملء كلا الحقلين.");
      setIsError(true);
      return;
    }
    setLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      const role = Number(response.user.role);
    
      if (role === 0) {
        setMessage("تم تسجيل الدخول بنجاح!");
        setIsError(false);
        setTimeout(() => {
          navigate("/student-dashboard");
        }, 1000);
      } else if (role === 1) {
        setMessage("تم تسجيل الدخول بنجاح!");
        setIsError(false);
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 1000);
      } else if (role === 2) {
        setMessage("تم تسجيل الدخول بنجاح!");
        setIsError(false);
        setTimeout(() => {
          navigate("/sheikh-dashboard");
        }, 1000);
      } else {
        setMessage("دور المستخدم غير معروف.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      
    const errorMessage = error.message || "فشل تسجيل الدخول. تحقق من البيانات.";
      setMessage(errorMessage);
      setIsError(true);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div 
    style={styles.mainContainer}>
      <div 
      style={styles.leftContainer}>
        <h2 
        style={styles.header}>تسجيل الدخول</h2>
        <p 
        style={styles.description}>
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

        <form onSubmit={handleLoginSubmit} 
        style={styles.form}>
          {message && <p style={{ ...styles.message, color: isError ? 'red' : 'green' }}>{message}</p>}
          <label 
          style={styles.label}>البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="أدخل بريدك الإلكتروني هنا"
            required
            
          style={styles.input}
          />
          <label 
          style={styles.label}>كلمة المرور</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="أدخل كلمة المرور هنا"
            
          style={styles.input}
            required
          />
          <button type="submit" style={styles.loginButton} disabled={loading}>
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <p style={styles.registerText}>
          <Link to="/register" 
          style={styles.link}>
            مستخدم جديد؟
          </Link>
        </p>
        <p 
        style={styles.termsText}>
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
    fontWeight: '>int',
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
    gap: '0.5rem',
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
    gap: '0.5rem',
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
  message: {
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
/************************************* Latest V2**************************************** */
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import quranImage from './images/l.png';
// import { login } from '../services/authService';

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [message, setMessage] = useState(location.state?.message || "");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setIsError(false);
//     if (!formData.email || !formData.password) {
//       setMessage("يرجى ملء كلا الحقلين.");
//       setIsError(true);
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await login(formData.email, formData.password);
//       setMessage("تم تسجيل الدخول بنجاح!");
//       setTimeout(() => {
//         const role = Number(response.user.role); // Convert role to number
//         if (role === 0) {
//           navigate("/student-dashboard");
//         } else if (role === 1) {
//           navigate("/admin-dashboard");
//         } else if (role === 2) {
//           navigate("/sheikh-dashboard");
//         } else {
//           setMessage("دور المستخدم غير معروف.");
//           setIsError(true);
//         }
//       }, 1000);
//     } catch (error) {
//       console.error("Login error:", error);
//       const errorMessage = error.message || "فشل تسجيل الدخول. تحقق من البيانات.";
//       setMessage(errorMessage);
//       setIsError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.mainContainer}>
//       <div style={styles.leftContainer}>
//         <h2 style={styles.header}>تسجيل الدخول</h2>
//         <p style={styles.description}>
//           قم بتسجيل الدخول إلى منصة هدى القرآن باستخدام إحدى الطرق الآتية
//         </p>
//         <button style={styles.socialButtonGoogle}>
//           تسجيل بواسطة جوجل <span style={styles.icon}>G</span>
//         </button>
//         <button style={styles.socialButtonFacebook}>
//           تسجيل بواسطة فيسبوك <span style={styles.icon}>f</span>
//         </button>
//         <div style={styles.orContainer}>
//           <div style={styles.line}></div>
//           <span style={styles.orText}>أو</span>
//           <div style={styles.line}></div>
//         </div>

//         <form onSubmit={handleLoginSubmit} style={styles.form}>
//           {message && <p style={{ ...styles.message, color: isError ? 'red' : 'green' }}>{message}</p>}
//           <label style={styles.label}>اسم المستخدم</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="أدخل اسم المستخدم من هنا"
//             required
//             style={styles.input}
//           />
//           <label style={styles.label}>كلمة المرور</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="أدخل كلمة المرور هنا"
//             style={styles.input}
//             required
//           />
//           <button type="submit" style={styles.loginButton} disabled={loading}>
//             {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
//           </button>
//         </form>

//         <p style={styles.registerText}>
//           <Link to="/register" style={styles.link}>
//             مستخدم جديد؟
//           </Link>
//         </p>
//         <p style={styles.termsText}>
//           بتسجيلك في منصة هدى القرآن يعني أنك موافق على{' '}
//           <Link to="/terms" style={styles.termsLink}>
//             شروط الاستخدام
//           </Link>{' '}
//           و{' '}
//           <Link to="/privacy" style={styles.termsLink}>
//             قوانين الخصوصية
//           </Link>
//         </p>
//       </div>

//       <div style={styles.rightContainer}>
//         <img
//           src={quranImage}
//           alt="Quran Illustration"
//           style={styles.rightImage}
//         />
//       </div>
//     </div>
//   );
// };

// const styles = {
//   mainContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     overflow: 'hidden',
//     height: '100%',
//     fontFamily: '"Tajawal", sans-serif',
//   },
//   leftContainer: {
//     flex: 1,
//     padding: '2rem',
//     backgroundColor: '#f9f9f9',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     textAlign: 'center',
//   },
//   header: {
//     fontFamily: '"Tajawal", sans-serif',
//     fontWeight: 'bold',
//     fontSize: "24px",
//     marginBottom: '1px',
//     letterSpacing: "0%",
//     textAlign: "center",
//     color: "#090909",
//   },
//   description: {
//     fontFamily: '"Tajawal", sans-serif',
//     fontWeight: 400,
//     fontSize: "14px",
//     marginBottom: '10px',
//     letterSpacing: "0%",
//     textAlign: "center",
//     color: "#A5A5A5",
//   },
//   orContainer: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '80%',
//     margin: '1rem 0',
//   },
//   line: {
//     flex: 1,
//     height: '1px',
//     backgroundColor: '#ccc',
//     margin: '0 1rem',
//   },
//   orText: {
//     fontFamily: '"Tajawal", sans-serif',
//     color: '#555',
//     whiteSpace: 'nowrap',
//     fontWeight: '>int',
//   },
//   socialButtonGoogle: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '80%',
//     padding: '0.8rem',
//     margin: '0.5rem 0',
//     backgroundColor: '#db4437',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '1rem',
//     cursor: 'pointer',
//     gap: '0.5rem',
//   },
//   socialButtonFacebook: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '80%',
//     padding: '0.8rem',
//     margin: '0.5rem 0',
//     backgroundColor: '#3b5998',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '1rem',
//     cursor: 'pointer',
//     gap: '0.5rem',
//   },
//   icon: {
//     fontSize: '1.4rem',
//     fontWeight: 'bold',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     width: '80%',
//   },
//   label: {
//     fontFamily: '"Tajawal", sans-serif',
//     marginBottom: '0.5rem',
//     fontSize: '1rem',
//     color: '#333',
//     textAlign: 'right',
//     fontWeight: 'bold',
//   },
//   input: {
//     marginBottom: '1rem',
//     padding: '0.8rem',
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     fontSize: '1rem',
//     textAlign: 'right',
//     direction: 'rtl',
//   },
//   loginButton: {
//     padding: '0.8rem',
//     backgroundColor: '#1EC8A0',
//     color: '#FFFFFF',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '1rem',
//     cursor: 'pointer',
//   },
//   message: {
//     color: 'green',
//     fontSize: '1rem',
//     marginBottom: '1rem',
//   },
//   registerText: {
//     marginTop: '1rem',
//     fontSize: '0.9rem',
//     color: '#090909',
//   },
//   termsText: {
//     fontSize: '0.9rem',
//     color: '#A5A5A5',
//     textAlign: 'right',
//     marginTop: '0rem',
//   },
//   termsLink: {
//     color: '#090909',
//     textDecoration: 'underline',
//     fontWeight: 'bold',
//   },
//   link: {
//     fontFamily: '"Tajawal", sans-serif',
//     color: '#090909',
//     textDecoration: 'none',
//     fontSize: '14px',
//     fontWeight: 400,
//     letterSpacing: "0%",
//     textAlign: "center",
//     marginTop: '10px',
//   },
//   rightContainer: {
//     flex: 1,
//     backgroundColor: '#e8f5e9',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '0',
//   },
//   rightImage: {
//     width: '100%',
//     height: '100%',
//     objectFit: 'cover',
//   },
// };

// export default Login;
/************************************* Latest ********************************************** */
// import React, { useState } from 'react';
// // import axios from "axios";
// import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// // import useForm from '../Components/useForm';
// import quranImage from './images/l.png';
// // import authService from './services/authService';
// // import authService from '../services/authService';
// import { login } from '../services/authService';
// import { useLocation } from 'react-router-dom';


// const Login = () => {
//   const navigate = useNavigate();
//   // const initialValues = { email: '', password: '' };
//   // const { formData, handleChange, setFormData } = useForm(initialValues);
//   // const [message, setmessage] = useState('');
//   // const [successMessage, setSuccessMessage] = useState('');  // New state for success message

//   // const handleLoginSubmit = (e) => {
//   //   e.preventDefault();

//   //   // Validate input
//   //   if (!formData.email || !formData.password) {
//   //     setmessage('يرجى ملء كلا الحقلين.');
//   //     return;
//   //   }

//   //   // Retrieve stored user data
//   //   const storedUser = JSON.parse(localStorage.getItem('registeredUser'));

//   //   if (!storedUser) {
//   //     setmessage('لم يتم العثور على مستخدم. يرجى التسجيل أولاً.');
//   //     return;
//   //   }

//   //   // Validate credentials
//   //   if (
//   //     formData.email === storedUser.email &&
//   //     formData.password === storedUser.password
//   //   ) {
//   //     setmessage('');
//   //     setSuccessMessage('تم تسجيل الدخول بنجاح!');  

//   // Hide success message after 1 second and redirect
//   // setTimeout(() => {
//   //   setSuccessMessage('');  // Clear the success message
//   //   navigate('/student-dashboard');
//   // }, 1000);
//   // } else {
//   //   setmessage('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
//   // }

//   // Reset form data
//   // setFormData(initialValues);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });


//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // const handleLoginSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setMessage("");
//   //   try {
//   //     const response = await axios.post(
//   //       "https://graduation-main-0wwkv3.laravel.cloud/api/auth/login",
//   //       {
//   //         email: formData.email,
//   //         password: formData.password,
//   //       },
//   //       {
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //       }
//   //     );

//   //     console.log("Login Response:", response.data);

//   //     if (response.data.access_token) {
//   //       setMessage("تم تسجيل الدخول بنجاح!");
//   //       setTimeout(() => {
//   //         navigate('/sheikh-dashboard');
//   //       }, 1000);
//   //       localStorage.setItem("token", response.data.access_token); // stores token
//   //     } 
//   //     else {
//   //       setMessage("حدث خطأ غير متوقع.");
//   //     }
//   //   } catch (error) {
//   //     console.error("Login error:", error.response?.data);
//   //     setMessage(error.response?.data?.message || "Login failed. Please try again.");
//   //   }
//   // };

//   // const handleLoginSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setMessage("");
//   //   try {
//   //     // const { access_token } = await login(formData.email, formData.password);
//   //     await login(formData.email, formData.password);
//   //     setMessage("تم تسجيل الدخول بنجاح!");
//   //     setTimeout(() => navigate("/sheikh-dashboard"), 1000);
//   //   } catch (error) {
//   //     console.error("Login error:", error);
//   //     setMessage("فشل تسجيل الدخول. تحقق من البيانات.");
//   //   }
//   // };
// /****************************************************** */
//   // Login.jsx (relevant part)
//   // const handleLoginSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setMessage("");

//   //   if (!formData.email || !formData.password) {
//   //     setMessage("يرجى ملء كلا الحقلين.");
//   //     return;
//   //   }

//   //   try {
//   //     const response = await login(formData.email, formData.password);
//   //     localStorage.setItem('token', response.access_token);
//   //     setMessage("تم تسجيل الدخول بنجاح!");
//   //     setTimeout(() => {
//   //       // navigate("/sheikh-dashboard");
//   //       navigate("/sheikh-dashboard");
//   //     }, 1000);
//   //   } catch (error) {
//   //     console.error("Login error:", error);
//   //     const errorMessage = error.message || "فشل تسجيل الدخول. تحقق من البيانات.";
//   //     setMessage(errorMessage);
//   //   }
//   // };
//   /**************************************************** */

//   const [loading, setLoading] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const location = useLocation();
//   const [message, setMessage] = useState(location.state?.message || "");

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setIsError(false);
//     if (!formData.email || !formData.password) {
//       setMessage("يرجى ملء كلا الحقلين.");
//       setIsError(true);
//       return;
//     }
//     setLoading(true);
//     try {
//       await login(formData.email, formData.password);
//       setMessage("تم تسجيل الدخول بنجاح!");
//       setTimeout(() => {
//         navigate("/sheikh-dashboard");
//       }, 1000);
//     } catch (error) {
//       console.error("Login error:", error);
//       const errorMessage = error.message || "فشل تسجيل الدخول. تحقق من البيانات.";
//       setMessage(errorMessage);
//       setIsError(true);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div style={styles.mainContainer}>
//       {/* Left Section */}
//       <div style={styles.leftContainer}>
//         <h2 style={styles.header}>تسجيل الدخول</h2>
//         <p style={styles.description}>
//           قم بتسجيل الدخول إلى منصة هدى القرآن باستخدام إحدى الطرق الآتية
//         </p>
//         <button style={styles.socialButtonGoogle}>
//           تسجيل بواسطة جوجل <span style={styles.icon}>G</span>
//         </button>
//         <button style={styles.socialButtonFacebook}>
//           تسجيل بواسطة فيسبوك <span style={styles.icon}>f</span>
//         </button>
//         <div style={styles.orContainer}>
//           <div style={styles.line}></div>
//           <span style={styles.orText}>أو</span>
//           <div style={styles.line}></div>
//         </div>

//         <form onSubmit={handleLoginSubmit} style={styles.form}>
//         {message && <p style={{ ...styles.message, color: isError ? 'red' : 'green' }}>{message}</p>}
//           {/* {message && <p style={styles.message}>{message}</p>} */}
//           {/* {successMessage && <p style={styles.successMessage}>{successMessage}</p>} //Display success message */}
//           <label style={styles.label}>اسم المستخدم</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="أدخل اسم المستخدم من هنا"
//             required
//             style={styles.input}
//           />
//           {/* <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         /> */}

//           <label style={styles.label}>كلمة المرور</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="أدخل كلمة المرور هنا"
//             style={styles.input}
//             required
//           />

//           {/* <Link to="/sheikh-dashboard" style={styles.loginButton}>
//             تسجيل الدخول
//           </Link> */}
//           <button type="submit" style={styles.loginButton} disabled={loading}>
//             {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
//           </button>
//           {/* <button type="submit" style={styles.loginButton}>
//             تسجيل الدخول
//           </button> */}
//         </form>

//         <p style={styles.registerText}>

//           <Link to="/register" style={styles.link}>
//             مستخدم جديد؟
//           </Link>
//         </p>
//         <p style={styles.termsText}>
//           بتسجيلك في منصة هدى القرآن يعني أنك موافق على{' '}
//           <Link to="/terms" style={styles.termsLink}>
//             شروط الاستخدام
//           </Link>{' '}
//           و{' '}
//           <Link to="/privacy" style={styles.termsLink}>
//             قوانين الخصوصية
//           </Link>
//         </p>
//       </div>

//       {/* Right Section */}
//       <div style={styles.rightContainer}>
//         <img
//           src={quranImage}
//           alt="Quran Illustration"
//           style={styles.rightImage}
//         />
//       </div>
//     </div>
//   );
// };

// const styles = {
//   mainContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     overflow: 'hidden',
//     height: '100%',
//     fontFamily: '"Tajawal", sans-serif',
//   },
//   leftContainer: {
//     flex: 1,
//     padding: '2rem',
//     backgroundColor: '#f9f9f9',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     textAlign: 'center',
//   },
//   header: {
//     fontFamily: '"Tajawal", sans-serif',
//     fontWeight: 'bold',
//     fontSize: "24px",
//     marginBottom: '1px',
//     letterSpacing: "0%",
//     textAlign: "center",
//     color: "#090909",
//   },
//   description: {
//     fontFamily: '"Tajawal", sans-serif',
//     fontWeight: 400,
//     fontSize: "14px",
//     marginBottom: '10px',
//     letterSpacing: "0%",
//     textAlign: "center",
//     color: "#A5A5A5",
//   },
//   orContainer: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '80%',
//     margin: '1rem 0',
//   },
//   line: {
//     flex: 1,
//     height: '1px',
//     backgroundColor: '#ccc',
//     margin: '0 1rem',
//   },
//   orText: {
//     fontFamily: '"Tajawal", sans-serif',
//     color: '#555',
//     whiteSpace: 'nowrap',
//     fontWeight: 'bold',
//   },

//   socialButtonGoogle: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '80%',
//     padding: '0.8rem',
//     margin: '0.5rem 0',
//     backgroundColor: '#db4437',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '1rem',
//     cursor: 'pointer',
//     gap: '0.5rem', // Spacing between the icon and text
//   },
//   socialButtonFacebook: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '80%',
//     padding: '0.8rem',
//     margin: '0.5rem 0',
//     backgroundColor: '#3b5998',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '1rem',
//     cursor: 'pointer',
//     gap: '0.5rem', // Spacing between the icon and text
//   },
//   icon: {
//     fontSize: '1.4rem',
//     fontWeight: 'bold',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     width: '80%',
//   },
//   label: {
//     fontFamily: '"Tajawal", sans-serif',
//     marginBottom: '0.5rem',
//     fontSize: '1rem',
//     color: '#333',
//     textAlign: 'right',
//     fontWeight: 'bold',
//   },
//   input: {
//     marginBottom: '1rem',
//     padding: '0.8rem',
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     fontSize: '1rem',
//     textAlign: 'right',
//     direction: 'rtl',
//   },
//   loginButton: {
//     padding: '0.8rem',
//     backgroundColor: '#1EC8A0',
//     color: '#FFFFFF',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '1rem',
//     cursor: 'pointer',
//   },
//   message: {
//     color: 'green',
//     fontSize: '1rem',
//     marginBottom: '1rem',
//   },
//   registerText: {
//     marginTop: '1rem',
//     fontSize: '0.9rem',
//     color: '#090909',
//   },
//   termsText: {
//     fontSize: '0.9rem',
//     color: '#A5A5A5',
//     textAlign: 'right',
//     marginTop: '0rem',
//   },
//   termsLink: {
//     color: '#090909',
//     textDecoration: 'underline',
//     fontWeight: 'bold',
//   },
//   link: {
//     fontFamily: '"Tajawal", sans-serif',
//     color: '#090909',
//     textDecoration: 'none',
//     fontSize: '14px',
//     fontWeight: 400,
//     letterSpacing: "0%",
//     textAlign: "center",
//     marginTop: '10px',
//   },
//   rightContainer: {
//     flex: 1,
//     backgroundColor: '#e8f5e9',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '0',
//   },
//   rightImage: {
//     width: '100%',
//     height: '100%',
//     objectFit: 'cover',
//   },
// };

// export default Login;
/********************************************************************************************** */

// import React, { useState } from 'react';
// // import axios from "axios";
// import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// // import useForm from '../Components/useForm';
// import quranImage from './images/l.png';
// // import authService from './services/authService';
// // import authService from '../services/authService';
// import { login } from '../services/authService';


// const Login = () => {
//   const navigate = useNavigate();
//   // const initialValues = { email: '', password: '' };
//   // const { formData, handleChange, setFormData } = useForm(initialValues);
//   // const [message, setmessage] = useState('');
//   // const [successMessage, setSuccessMessage] = useState('');  // New state for success message

//   // const handleLoginSubmit = (e) => {
//   //   e.preventDefault();

//   //   // Validate input
//   //   if (!formData.email || !formData.password) {
//   //     setmessage('يرجى ملء كلا الحقلين.');
//   //     return;
//   //   }

//   //   // Retrieve stored user data
//   //   const storedUser = JSON.parse(localStorage.getItem('registeredUser'));

//   //   if (!storedUser) {
//   //     setmessage('لم يتم العثور على مستخدم. يرجى التسجيل أولاً.');
//   //     return;
//   //   }

//   //   // Validate credentials
//   //   if (
//   //     formData.email === storedUser.email &&
//   //     formData.password === storedUser.password
//   //   ) {
//   //     setmessage('');
//   //     setSuccessMessage('تم تسجيل الدخول بنجاح!');  

//   // Hide success message after 1 second and redirect
//   // setTimeout(() => {
//   //   setSuccessMessage('');  // Clear the success message
//   //   navigate('/student-dashboard');
//   // }, 1000);
//   // } else {
//   //   setmessage('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
//   // }

//   // Reset form data
//   // setFormData(initialValues);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // const handleLoginSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setMessage("");
//   //   try {
//   //     const response = await axios.post(
//   //       "https://graduation-main-0wwkv3.laravel.cloud/api/auth/login",
//   //       {
//   //         email: formData.email,
//   //         password: formData.password,
//   //       },
//   //       {
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //       }
//   //     );

//   //     console.log("Login Response:", response.data);

//   //     if (response.data.access_token) {
//   //       setMessage("تم تسجيل الدخول بنجاح!");
//   //       setTimeout(() => {
//   //         navigate('/sheikh-dashboard');
//   //       }, 1000);
//   //       localStorage.setItem("token", response.data.access_token); // stores token
//   //     } 
//   //     else {
//   //       setMessage("حدث خطأ غير متوقع.");
//   //     }
//   //   } catch (error) {
//   //     console.error("Login error:", error.response?.data);
//   //     setMessage(error.response?.data?.message || "Login failed. Please try again.");
//   //   }
//   // };

//   // const handleLoginSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setMessage("");
//   //   try {
//   //     // const { access_token } = await login(formData.email, formData.password);
//   //     await login(formData.email, formData.password);
//   //     setMessage("تم تسجيل الدخول بنجاح!");
//   //     setTimeout(() => navigate("/sheikh-dashboard"), 1000);
//   //   } catch (error) {
//   //     console.error("Login error:", error);
//   //     setMessage("فشل تسجيل الدخول. تحقق من البيانات.");
//   //   }
//   // };

//   // // Login.jsx (relevant part)
//   // const handleLoginSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setMessage("");

//   //   if (!formData.email || !formData.password) {
//   //     setMessage("يرجى ملء كلا الحقلين.");
//   //     return;
//   //   }

//   //   try {
//   //     const response = await login(formData.email, formData.password);
//   //     localStorage.setItem('token', response.access_token);
//   //     setMessage("تم تسجيل الدخول بنجاح!");
//   //     setTimeout(() => {
//   //       navigate("/sheikh-dashboard");
//   //     }, 1000);
//   //   } catch (error) {
//   //     console.error("Login error:", error);
//   //     const errorMessage = error.message || "فشل تسجيل الدخول. تحقق من البيانات.";
//   //     setMessage(errorMessage);
//   //   }
//   // };
//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
  
//     if (!formData.email || !formData.password) {
//       setMessage("يرجى ملء كلا الحقلين.");
//       return;
//     }
  
//     try {
//       await login(formData.email, formData.password); // Remove 'const response =' since it's not used
//       setMessage("تم تسجيل الدخول بنجاح!");
//       setTimeout(() => {
//         navigate("/sheikh-dashboard");
//       }, 1000);
//     } catch (error) {
//       console.error("Login error:", error);
//       const errorMessage = error.message || "فشل تسجيل الدخول. تحقق من البيانات.";
//       setMessage(errorMessage);
//     }
//   };
  
//   return (
//     <div style={styles.mainContainer}>
//       {/* Left Section */}
//       <div style={styles.leftContainer}>
//         <h2 style={styles.header}>تسجيل الدخول</h2>
//         <p style={styles.description}>
//           قم بتسجيل الدخول إلى منصة هدى القرآن باستخدام إحدى الطرق الآتية
//         </p>
//         <button style={styles.socialButtonGoogle}>
//           تسجيل بواسطة جوجل <span style={styles.icon}>G</span>
//         </button>
//         <button style={styles.socialButtonFacebook}>
//           تسجيل بواسطة فيسبوك <span style={styles.icon}>f</span>
//         </button>
//         <div style={styles.orContainer}>
//           <div style={styles.line}></div>
//           <span style={styles.orText}>أو</span>
//           <div style={styles.line}></div>
//         </div>

//         <form onSubmit={handleLoginSubmit} style={styles.form}>
//           {message && <p style={styles.message}>{message}</p>}
//           {/* {successMessage && <p style={styles.successMessage}>{successMessage}</p>} //Display success message */}
//           <label style={styles.label}>اسم المستخدم</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="أدخل اسم المستخدم من هنا"
//             required
//             style={styles.input}
//           />
//           {/* <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         /> */}

//           <label style={styles.label}>كلمة المرور</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="أدخل كلمة المرور هنا"
//             style={styles.input}
//             required
//           />

//           {/* <Link to="/sheikh-dashboard" style={styles.loginButton}>
//             تسجيل الدخول
//           </Link> */}
//           <button type="submit" style={styles.loginButton}>
//             تسجيل الدخول
//           </button>
//         </form>

//         <p style={styles.registerText}>

//           <Link to="/register" style={styles.link}>
//             مستخدم جديد؟
//           </Link>
//         </p>
//         <p style={styles.termsText}>
//           بتسجيلك في منصة هدى القرآن يعني أنك موافق على{' '}
//           <Link to="/terms" style={styles.termsLink}>
//             شروط الاستخدام
//           </Link>{' '}
//           و{' '}
//           <Link to="/privacy" style={styles.termsLink}>
//             قوانين الخصوصية
//           </Link>
//         </p>
//       </div>

//       {/* Right Section */}
//       <div style={styles.rightContainer}>
//         <img
//           src={quranImage}
//           alt="Quran Illustration"
//           style={styles.rightImage}
//         />
//       </div>
//     </div>
//   );
// };

// const styles = {
//   mainContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     overflow: 'hidden',
//     height: '100%',
//     fontFamily: '"Tajawal", sans-serif',
//   },
//   leftContainer: {
//     flex: 1,
//     padding: '2rem',
//     backgroundColor: '#f9f9f9',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     textAlign: 'center',
//   },
//   header: {
//     fontFamily: '"Tajawal", sans-serif',
//     fontWeight: 'bold',
//     fontSize: "24px",
//     marginBottom: '1px',
//     letterSpacing: "0%",
//     textAlign: "center",
//     color: "#090909",
//   },
//   description: {
//     fontFamily: '"Tajawal", sans-serif',
//     fontWeight: 400,
//     fontSize: "14px",
//     marginBottom: '10px',
//     letterSpacing: "0%",
//     textAlign: "center",
//     color: "#A5A5A5",
//   },
//   orContainer: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '80%',
//     margin: '1rem 0',
//   },
//   line: {
//     flex: 1,
//     height: '1px',
//     backgroundColor: '#ccc',
//     margin: '0 1rem',
//   },
//   orText: {
//     fontFamily: '"Tajawal", sans-serif',
//     color: '#555',
//     whiteSpace: 'nowrap',
//     fontWeight: 'bold',
//   },

//   socialButtonGoogle: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '80%',
//     padding: '0.8rem',
//     margin: '0.5rem 0',
//     backgroundColor: '#db4437',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '1rem',
//     cursor: 'pointer',
//     gap: '0.5rem', // Spacing between the icon and text
//   },
//   socialButtonFacebook: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '80%',
//     padding: '0.8rem',
//     margin: '0.5rem 0',
//     backgroundColor: '#3b5998',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '1rem',
//     cursor: 'pointer',
//     gap: '0.5rem', // Spacing between the icon and text
//   },
//   icon: {
//     fontSize: '1.4rem',
//     fontWeight: 'bold',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     width: '80%',
//   },
//   label: {
//     fontFamily: '"Tajawal", sans-serif',
//     marginBottom: '0.5rem',
//     fontSize: '1rem',
//     color: '#333',
//     textAlign: 'right',
//     fontWeight: 'bold',
//   },
//   input: {
//     marginBottom: '1rem',
//     padding: '0.8rem',
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     fontSize: '1rem',
//     textAlign: 'right',
//     direction: 'rtl',
//   },
//   loginButton: {
//     padding: '0.8rem',
//     backgroundColor: '#1EC8A0',
//     color: '#FFFFFF',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '1rem',
//     cursor: 'pointer',
//   },
//   message: {
//     color: 'green',
//     fontSize: '1rem',
//     marginBottom: '1rem',
//   },
//   registerText: {
//     marginTop: '1rem',
//     fontSize: '0.9rem',
//     color: '#090909',
//   },
//   termsText: {
//     fontSize: '0.9rem',
//     color: '#A5A5A5',
//     textAlign: 'right',
//     marginTop: '0rem',
//   },
//   termsLink: {
//     color: '#090909',
//     textDecoration: 'underline',
//     fontWeight: 'bold',
//   },
//   link: {
//     fontFamily: '"Tajawal", sans-serif',
//     color: '#090909',
//     textDecoration: 'none',
//     fontSize: '14px',
//     fontWeight: 400,
//     letterSpacing: "0%",
//     textAlign: "center",
//     marginTop: '10px',
//   },
//   rightContainer: {
//     flex: 1,
//     backgroundColor: '#e8f5e9',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '0',
//   },
//   rightImage: {
//     width: '100%',
//     height: '100%',
//     objectFit: 'cover',
//   },
// };

// export default Login;