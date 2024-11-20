// Dashboard.jsx
import React from 'react';
import Button from '../Components/Button';
import InputField from '../Components/InputField';
import Form from '../Components/Form';
import useForm from '../Components/useForm';  // Import the custom useForm hook

const Dashboard = () => {
  const initialValues = { surahPages: '', daysToMemorize: '' };

  // Use the useForm hook
  const { formData, handleChange, handleSubmit, isSubmitted, setFormData } = useForm(initialValues);

  const handleDashboardSubmit = (e) => {
    handleSubmit(e);
    
    // Handle additional logic after submission if needed
    console.log('Plan submitted:', formData);

    // Reset form data after submission
    setFormData(initialValues);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Choose your plan</h2>
      <Form onSubmit={handleDashboardSubmit}>
        {isSubmitted && <p style={styles.successMessage}>Submitted successfully!</p>}
        <InputField
          label="Number of Pages:"
          name="surahPages"
          value={formData.surahPages}
          onChange={handleChange}
          placeholder="Enter number of pages"
          type="number"
        />
        <InputField
          label="Number of Days to Memorize:"
          name="daysToMemorize"
          value={formData.daysToMemorize}
          onChange={handleChange}
          placeholder="Enter number of days"
          type="number"
        />
        <Button label="Submit Plan Request" type="submit" />
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

export default Dashboard;
