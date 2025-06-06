import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Components/StudentSidebar";
import Navbar from "../Components/DashboardNavbar";
import { Star } from "lucide-react";

const TeacherFeedbacks = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTeacherProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('لم يتم العثور على رمز المصادقة');
      }

      if (!id) {
        throw new Error('لم يتم تحديد معرف المدرس');
      }

      console.log('Fetching teacher profile for ID:', id);

      const response = await fetch(`http://localhost:8000/api/v1/student/teacher_profile/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('Teacher Profile API Response:', data);

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error(data.message || `خطأ في الاتصال! الحالة: ${response.status}`);
      }
      
      if (data.status === 200 && data.data) {
        setTeacher(data.data);
        console.log('Teacher data updated successfully:', data.data);
        console.log('Feedbacks array:', data.data.feedbacks);
      } else {
        throw new Error(data.message || 'فشل في جلب بيانات المدرس');
      }
    } catch (err) {
      console.error('Error fetching teacher profile:', err);
      setError(err.message || 'حدث خطأ أثناء جلب بيانات المدرس');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTeacherProfile();
    } else {
      setError('لم يتم تحديد معرف المدرس');
      setLoading(false);
    }
  }, [id, navigate]);

  // Add event listener for storage changes to refresh data when new feedback is added
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'newFeedbackAdded' && e.newValue === 'true') {
        console.log('New feedback detected, refreshing data...');
        fetchTeacherProfile();
        localStorage.removeItem('newFeedbackAdded');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: "flex", flexDirection: "row-reverse", direction: "rtl" }}>
          <Sidebar />
          <div style={{ marginRight: "220px", padding: "40px 30px 30px 30px", width: "100%", boxSizing: "border-box", marginTop: "60px" }}>
            <div style={{ textAlign: "center", padding: "50px" }}>جاري التحميل ...</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div style={{ display: "flex", flexDirection: "row-reverse", direction: "rtl" }}>
          <Sidebar />
          <div style={{ marginRight: "220px", padding: "40px 30px 30px 30px", width: "100%", boxSizing: "border-box", marginTop: "60px" }}>
            <div style={{ textAlign: "center", padding: "50px", color: "red" }}>{error}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "row-reverse", direction: "rtl" }}>
        <Sidebar />
        <div style={{ marginRight: "220px", padding: "40px 30px 30px 30px", width: "100%", boxSizing: "border-box", marginTop: "60px" }}>
          <h2 style={{ marginBottom: "32px", color: "#1EC8A0", fontWeight: "bold" }}>تقييمات الطلاب</h2>
          {teacher?.feedbacks && teacher.feedbacks.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "22px", maxWidth: "600px" }}>
              {teacher.feedbacks.map((feedback) => (
                <div key={feedback.id} style={{
                  background: "#EAF8F4",
                  borderRadius: "12px",
                  padding: "18px 22px",
                  boxShadow: "0 2px 8px rgba(30,200,160,0.07)",
                  border: "1px solid #d2f3ea"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "bold", color: "#222", fontSize: "1.1rem" }}>
                      {feedback.students?.fullName || "طالب"}
                    </span>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          color="#FFD700"
                          fill={star <= feedback.rate ? "#FFD700" : "#e0e0e0"}
                        />
                      ))}
                    </div>
                  </div>
                  <div style={{ color: "#444", fontSize: "1rem" }}>{feedback.feedback}</div>
                  <div style={{ color: "#888", fontSize: "0.9rem", marginTop: "8px" }}>
                    {new Date(feedback.created_at).toLocaleDateString('ar-SA')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: "center", 
              padding: "40px", 
              background: "#EAF8F4", 
              borderRadius: "12px",
              color: "#666"
            }}>
              لا توجد تقييمات متاحة حالياً
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TeacherFeedbacks; 