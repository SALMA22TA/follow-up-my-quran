import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Button from '../Components/Button';
import InputField from '../Components/InputField';
import Form from '../Components/Form';
import useForm from '../Components/useForm'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const initialValues = { surahPages: '', daysToMemorize: '' };

  // Use the useForm hook
  const { formData, handleChange, setFormData } = useForm(initialValues);

  // State for validation errors
  const [error, setError] = useState('');

  // State for success message
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State for pending requests
  const [pendingRequests, setPendingRequests] = useState([]);

  // Fetch pending requests when the dashboard loads
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch('/api/pending-requests'); // we will replace it with actual API endpoint
        const data = await response.json();
        setPendingRequests(data);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleDashboardSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.surahPages || !formData.daysToMemorize) {
      setError('Both fields are required.');
      setIsSubmitted(false); // Clear success message on error
      return;
    }

    // Clear errors and process form submission
    setError('');
    console.log('Plan submitted:', formData);

    setIsSubmitted(true);

    setFormData(initialValues);

    setTimeout(() => {
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Choose your plan</h2>
      <Form onSubmit={handleDashboardSubmit}>
        {error && <p style={styles.errorMessage}>{error}</p>}
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

      {/* Pending Requests Section */}
      <div style={styles.requestsContainer}>
        <h3 style={styles.requestsHeader}>Pending Requests</h3>
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <div key={request.id} style={styles.requestCard}>
              <p>Goal: {request.memorizationGoal}</p>
              <p>Availability: {request.availability}</p>
              <p>Status: {request.status}</p>
            </div>
          ))
        ) : (
          <p>No pending requests at the moment.</p>
        )}
      </div>

      {/* Start Learning Button */}
      <div style={styles.buttonContainer}>
        <Button
          label="Start Learning"
          onClick={() => navigate('/start-learning-form')}
        />
      </div>
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
    position: 'relative', 
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
  errorMessage: {
    color: 'red',
    fontSize: '1rem',
    marginBottom: '1rem',
  },
  requestsContainer: {
    marginTop: '2rem',
    width: '100%',
    maxWidth: '600px',
    textAlign: 'left',
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  requestsHeader: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  requestCard: {
    padding: '1rem',
    borderBottom: '1px solid #ddd',
    marginBottom: '1rem',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
  },
};

export default Dashboard;
