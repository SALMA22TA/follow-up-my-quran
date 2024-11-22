import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../Components/InputField';
import Button from '../Components/Button';
import Form from '../Components/Form';

const StartLearningForm = ({ userID, sheikhID }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    availability: '', 
    memorizationGoal: '', 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the payload
    const payload = {
      ...formData,
      userID, // Current logged-in user ID
      sheikhID, // The teacher's ID
    };

    // Send to the back-end (we are replacing it with the actual API call)
    fetch('/api/learning-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        alert('تم إرسال الطلب بنجاح! في انتظار موافقة المشرف.');
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error(err);
        alert('لقد حدث خطأ. يرجى المحاولة مرة أخرى.');
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>ابدأ التعلم</h2>
      <Form onSubmit={handleSubmit}>
        <InputField
          label="توفر وقتك (على سبيل المثال، أيام الأسبوع، من 5 إلى 7 مساءً):"
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          placeholder="أدخل أوقاتك المتاحة"
        />
        <InputField
          label="هدف الحفظ (سورة البقرة مثلاً):"
          name="memorizationGoal"
          value={formData.memorizationGoal}
          onChange={handleChange}
          placeholder="ماذا تريد أن تحفظ؟"
        />
        <Button label="إرسال الطلب" type="submit" />
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
};

export default StartLearningForm;
