import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";

const GenerateSessions = () => {
  const [students, setStudents] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // دالة لجلب بيانات الطلاب (مؤقتة لحد ما الـ API تكون جاهزة)
  const getStudents = async () => {
    // بيانات تجريبية مؤقتة
    const mockStudents = [
      { id: 1, name: 'طالب 1', sessionTime: '14:00', days: 'السبت، الأحد' },
      { id: 2, name: 'طالب 2', sessionTime: '15:00', days: 'الإثنين، الثلاثاء' },
      { id: 3, name: 'طالب 3', sessionTime: '16:00', days: 'الأربعاء، الخميس' },
    ];
    return { students: mockStudents };

    // The actual code when the API is ready (I will replace the above code with this code):
    /*
    try {
      const response = await axios.get('http://localhost:8000/api/v1/teacher/students', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Get students error:', error.response?.data || error);
      throw error.response?.data || error;
    }
    */
  };

  // دالة لإنشاء الجلسات
  const generateSessions = async (studentId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/teacher/generate_sessions/${studentId}`,
        {},
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Generate sessions error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  };

  // جلب بيانات الطلاب عند تحميل الصفحة
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data.students || []);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  // دالة لفتح الـ pop-up للتأكيد
  const handleGenerateClick = (studentId) => {
    setSelectedStudentId(studentId);
    setShowConfirmModal(true);
  };

  // دالة لإنشاء الجلسات بعد التأكيد
  const confirmGenerateSession = async () => {
    setLoading(true);
    try {
      const response = await generateSessions(selectedStudentId);
      setSuccessMessage(response.message || 'تم إنشاء جلسة بنجاح!');
      setShowConfirmModal(false);
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      // إعادة جلب بيانات الطلاب بعد إنشاء الجلسات (اختياري)
      const updatedStudents = await getStudents();
      setStudents(updatedStudents.students || []);
    } catch (error) {
      console.error('Error generating sessions:', error);
      setSuccessMessage('فشل إنشاء الجلسة. حاول مرة أخرى.');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // دالة لإلغاء التأكيد
  const cancelGenerateSession = () => {
    setShowConfirmModal(false);
    setSelectedStudentId(null);
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    direction: 'rtl',
    fontFamily: '"Tajawal", sans-serif',
  };

  const thStyle = {
    border: '1px solid #E6E6E6',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  };

  const tdStyle = {
    border: '1px solid #E6E6E6',
    padding: '10px',
    textAlign: 'center',
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#1EC8A0',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: '"Tajawal", sans-serif',
  };

  const modalStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    fontFamily: '"Tajawal", sans-serif',
    direction: 'rtl',
  };

  const modalButtonStyle = {
    padding: '8px 16px',
    margin: '0 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: '"Tajawal", sans-serif',
  };

  const confirmButtonStyle = {
    ...modalButtonStyle,
    backgroundColor: '#1EC8A0',
    color: '#FFFFFF',
  };

  const cancelButtonStyle = {
    ...modalButtonStyle,
    backgroundColor: '#FF4D4F',
    color: '#FFFFFF',
  };

  const successMessageStyle = {
    color: 'green',
    textAlign: 'center',
    marginTop: '20px',
    fontFamily: '"Tajawal", sans-serif',
  };
  const contentContainerStyle = {
    padding: '20px',
    marginTop: '90px', 
    marginRight: '220px', 
    direction: 'rtl',
    minHeight: 'calc(100vh - 90px)', 
  };
  return (
    <>
      <Navbar />
      <Sidebar />
      <div style={contentContainerStyle}>
        <h2 style={{ textAlign: 'center', fontFamily: '"Tajawal", sans-serif' }}>
          إنشاء الجلسات
        </h2>
        {successMessage && <p style={successMessageStyle}>{successMessage}</p>}
        {students.length === 0 ? (
          <p style={{ textAlign: 'center', fontFamily: '"Tajawal", sans-serif' }}>
            لا يوجد طلاب متاحين لإنشاء جلسات.
          </p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>اسم الطالب</th>
                <th style={thStyle}>موعد الجلسة</th>
                <th style={thStyle}>الأيام</th>
                <th style={thStyle}>إنشاء جلسة</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td style={tdStyle}>{student.name}</td>
                  <td style={tdStyle}>{student.sessionTime}</td>
                  <td style={tdStyle}>{student.days}</td>
                  <td style={tdStyle}>
                    <button
                      style={buttonStyle}
                      onClick={() => handleGenerateClick(student.id)}
                      disabled={loading}
                    >
                      {loading && selectedStudentId === student.id ? 'جاري الإنشاء...' : 'إنشاء جلسة'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showConfirmModal && (
          <div style={modalStyle}>
            <div style={modalContentStyle}>
              <p>هل أنت متأكد أنك تريد إنشاء جلسة لهذا الطالب؟</p>
              <button style={confirmButtonStyle} onClick={confirmGenerateSession} disabled={loading}>
                نعم
              </button>
              <button style={cancelButtonStyle} onClick={cancelGenerateSession} disabled={loading}>
                لا
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GenerateSessions;