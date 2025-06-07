
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import '../styles/Verification.css';
// import { useLocation } from 'react-router-dom';
import { verify } from '../services/authService';


const Verification = () => {
  // State for the 6-digit code
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // For navigation and getting user_id from registration
  const navigate = useNavigate();
  const location = useLocation();


  // Get user_id from the registration response (passed via state)
  useEffect(() => {
    if (location.state && location.state.userId) {
      setUserId(location.state.userId);
    } else {
      // If no userId is found, redirect to registration page
      navigate('/register');
    }
  }, [location, navigate]);

  // Handle input change for each digit
  
  const handleChange = (index, value) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus the next input
      if (value !== '' && index < 5) {
        
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };
/*********************************************************** */
  // Verification.jsx (relevant part)
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);

  //   const verificationCode = code.join('');
  //   if (verificationCode.length !== 6) {
  //     setError('Please enter a 6-digit code.');
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await axios.post('http://localhost:8000/api/auth/verify', {
  //       user_id: userId,
  //       verification_code: verificationCode,
  //     }, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //       },
  //     });

  //     if (response.status === 200) {
  //       navigate('/login', { state: { message: 'Email verified successfully!' } });
  //     }
  //   } catch (err) {
  //     const errorMessage = err.response?.data?.message || 'Verification failed. Please check your code and try again.';
  //     setError(errorMessage);
  //     console.error('Verification error:', err.response?.data || err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
/*********************************************************** */
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code.');
      setLoading(false);
      return;
    }

    try {
      await verify(userId, verificationCode);
      navigate('/login', { state: { message: 'Email verified successfully!' } });
    } catch (err) {
      
      const errorMessage = err.message || 'Verification failed. Please check your code and try again.';
      setError(errorMessage);
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <h2>OTP 6-Digit Verification Code</h2>
        <p>Enter the 6-digit verification code received on your email</p>
        {/* <a href="/change-email" className="change-email">
          (Change)
        </a> */}

        <form onSubmit={handleSubmit}>
          <div className="code-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="code-input"
              />
            ))}
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="continue-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verification;