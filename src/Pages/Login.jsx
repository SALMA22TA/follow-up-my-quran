// Login.jsx
import React from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom'; 
import Button from '../Components/Button';
import InputField from '../Components/InputField';
import Form from '../Components/Form';
import useForm from '../Components/useForm';  

const Login = () => {
  const navigate = useNavigate(); 
  const initialValues = { usernameOrEmail: '', password: '' };

  // The useForm hook
  const { formData, handleChange, handleSubmit, isSubmitted, setFormData } = useForm(initialValues);

  const handleLoginSubmit = (e) => {
    handleSubmit(e);

    // Mock API response after form submission (temporary)
    const mockApiResponse = {
      usernameOrEmail: formData.usernameOrEmail,
      password: formData.password,
      role: 'student',
    };

    console.log('Logged in with:', mockApiResponse);

    // Reset data
    setFormData(initialValues);

    // Redirect to student dashboard
    setTimeout(() => {
      navigate('/student-dashboard'); 
    }, 1000); 
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Login</h2>
      <Form onSubmit={handleLoginSubmit}>
        {isSubmitted && <p style={styles.successMessage}>Logged in successfully!</p>}
        <InputField
          label="Username or Email:"
          name="usernameOrEmail"
          value={formData.usernameOrEmail}
          onChange={handleChange}
          placeholder="Enter your username or email"
        />
        <InputField
          label="Password:"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          type="password"
        />
        <Button label="Login" type="submit" />
      </Form>
      <p style={styles.signupHint}>
        Don't have an account? <Link to="/register">Sign up here</Link>
      </p>
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
  signupHint: {
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: '#555',
  },
};

export default Login;
