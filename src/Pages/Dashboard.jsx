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
  const { formData, handleChange, handleSubmit, isSubmitted, setFormData } = useForm(initialValues);

  // State for pending requests
  const [pendingRequests, setPendingRequests] = useState([]);

  // Fetch pending requests when the dashboard loads
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch('/api/pending-requests'); // we are replacing it with actual API endpoint
        const data = await response.json();
        setPendingRequests(data);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleDashboardSubmit = (e) => {
    handleSubmit(e);

    console.log('Plan submitted:', formData);

    setFormData(initialValues);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>اختر خطتك</h2>
      <Form onSubmit={handleDashboardSubmit}>
        {isSubmitted && <p style={styles.successMessage}>تم الإرسال بنجاح!</p>}
        <InputField
          label="عدد الصفحات:"
          name="surahPages"
          value={formData.surahPages}
          onChange={handleChange}
          placeholder="أدخل عدد الصفحات"
          type="number"
        />
        <InputField
          label="عدد الأيام للحفظ:"
          name="daysToMemorize"
          value={formData.daysToMemorize}
          onChange={handleChange}
          placeholder="أدخل عدد الأيام"
          type="number"
        />
        <Button label="إرسال طلب الخطة" type="submit" />
      </Form>

      {/* Pending Requests Section */}
      <div style={styles.requestsContainer}>
        <h3 style={styles.requestsHeader}>الطلبات المعلقة</h3>
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <div key={request.id} style={styles.requestCard}>
              <p>Goal: {request.memorizationGoal}</p>
              <p>Availability: {request.availability}</p>
              <p>Status: {request.status}</p>
            </div>
          ))
        ) : (
          <p>لا توجد طلبات معلقة في الوقت الحالي.</p>
        )}
      </div>

      {/* Start Learning Button */}
      <div style={styles.buttonContainer}>
        <Button
          label="ابدأ التعلم"
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
