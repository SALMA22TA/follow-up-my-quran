import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Components/Button';
import InputField from '../Components/InputField';
import Form from '../Components/Form';

const Register = () => {
  const navigate = useNavigate(); 
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      !registerData.username ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      alert('Please fill in all fields.');
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    setIsSubmitted(true);
    // we are going to perform registration logic here (e.g., API request)
    console.log('Registered with:', registerData);
    
    setRegisterData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    // Redirect to login page after successful registration
    setTimeout(() => {
      navigate('/login'); 
    }, 1000); 
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Register</h2>
      <Form onSubmit={handleSubmit}>
        {isSubmitted && <p style={styles.successMessage}>Registered successfully!</p>}
        <InputField
          label="Username:"
          name="username"
          value={registerData.username}
          onChange={handleChange}
          placeholder="Enter your username"
        />
        <InputField
          label="Email:"
          name="email"
          value={registerData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        <InputField
          label="Password:"
          name="password"
          value={registerData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          type="password"
        />
        <InputField
          label="Confirm Password:"
          name="confirmPassword"
          value={registerData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          type="password"
        />
        <Button label="Register" type="submit" />
      </Form>
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
    backgroundColor: '#f4f6f8',
    fontFamily: '"Arial", sans-serif',
    padding: '1rem',
  },
  header: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '1.5rem',
  },
  successMessage: {
    color: 'green',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
};

export default Register;
