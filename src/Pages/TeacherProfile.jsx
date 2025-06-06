import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Components/StudentSidebar";
import Navbar from "../Components/DashboardNavbar";
import { User, CheckCircle2 } from "lucide-react";

const TeacherProfile = () => {
  const { id } = useParams(); 
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [rate, setRate] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchTeacherProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('لم يتم العثور على رمز المصادقة');
      }

      const response = await fetch(`http://localhost:8000/api/v1/student/teacher_profile/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error(`خطأ في الاتصال! الحالة: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.status === 200 && data.data) {
        setTeacher(data.data);
      } else {
        throw new Error(data.message || 'فشل في جلب بيانات المدرس');
      }
    } catch (err) {
      console.error('Error fetching teacher profile:', err);
      if (err.message === 'لم يتم العثور على رمز المصادقة') {
        navigate('/login');
      } else {
        setError(err.message || 'حدث خطأ أثناء جلب بيانات المدرس');
      }
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

  const handleModalClose = (e) => {
    if (e.target.className === "modal-overlay") {
      setShowModal(false);
      setModalError(null);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setModalError(null);
  };

  const handleSubmitRating = async () => {
    try {
      // Validate inputs
      if (!feedback.trim()) {
        setModalError("يرجى كتابة تعليق");
        return;
      }
      if (rate < 1 || rate > 5) {
        setModalError("يرجى اختيار تقييم من 1 إلى 5");
        return;
      }

      setModalError(null);
      setSubmitting(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('لم يتم العثور على رمز المصادقة');
      }

      if (!id) {
        throw new Error('لم يتم تحديد معرف المدرس');
      }

      // Get user ID from the token
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('رمز المصادقة غير صالح');
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      console.log('Token payload:', payload);

      const userId = payload.id || payload.sub;
      if (!userId) {
        throw new Error('لم يتم العثور على معرف المستخدم في رمز المصادقة');
      }

      // Use the ID from URL parameters
      const teacherId = parseInt(id);
      console.log('Using teacher ID from URL:', teacherId);

      // Match the exact data structure required by the API
      const ratingPayload = {
        user_id: parseInt(userId),
        teacher_id: teacherId,
        rate: parseInt(rate),
        feedback: feedback
      };

      console.log('Rating Submission Payload:', ratingPayload);

      const response = await fetch('http://localhost:8000/api/v1/student/store/rate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(ratingPayload)
      });

      const responseData = await response.json();
      console.log('Rating Submission Response:', responseData);

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error(responseData.message || `خطأ في الاتصال! الحالة: ${response.status}`);
      }
      
      if (responseData.message === "Rating submitted successfully") {
        // Reset form and close rating modal
        setRate(5);
        setFeedback("");
        setShowModal(false);
        // Show success modal
        setShowSuccessModal(true);
        // Trigger storage event to notify feedbacks page
        localStorage.setItem('newFeedbackAdded', 'true');
        // Refresh teacher data
        await fetchTeacherProfile();
        // Auto close success modal after 2 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);
      } else {
        throw new Error(responseData.message || 'فشل في إضافة التقييم');
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert(err.message || 'حدث خطأ أثناء إضافة التقييم');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: "flex", flexDirection: "row-reverse", direction: "rtl" }}>
          <Sidebar />
          <div style={{ marginRight: "220px", padding: "30px", width: "100%", boxSizing: "border-box", marginTop: "80px" }}>
            <div style={{ textAlign: "center", padding: "50px" }}> جاري التحميل ...</div>
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
          <div style={{ marginRight: "220px", padding: "30px", width: "100%", boxSizing: "border-box", marginTop: "80px" }}>
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
        <div style={{ marginRight: "220px", padding: "30px", width: "100%", boxSizing: "border-box", marginTop: "80px" }}>
          <div style={{
            display: "flex",
            flexDirection: "row-reverse",
            background: "#EAF8F4",
            borderRadius: "16px",
            padding: "32px 24px",
            alignItems: "flex-start",
            gap: "32px",
            boxShadow: "0 4px 16px rgba(30,200,160,0.07)",
            minHeight: "350px"
          }}>
            {/* Profile Pic & Buttons */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "180px" }}>
              {teacher.teacherinfo?.profile_pic ? (
                <img
                  src={teacher.teacherinfo.profile_pic}
                  alt={teacher.teacherinfo.fname}
                  style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #1EC8A0",
                    marginBottom: "18px"
                  }}
                />
              ) : (
                <div style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px solid #1EC8A0",
                  marginBottom: "18px"
                }}>
                  <User size={60} color="#1EC8A0" />
                </div>
              )}
              <button
                style={{
                  backgroundColor: "#1EC8A0",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginBottom: "12px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  transition: "all 0.2s"
                }}
                onClick={() => navigate("/request-schedule", { state: { teacher } })}
                onMouseEnter={e => {
                  e.target.style.background = "#17a88a";
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(30,200,160,0.15)";
                }}
                onMouseLeave={e => {
                  e.target.style.background = "#1EC8A0";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                طلب جدول
              </button>
            </div>
            {/* Main Info */}
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontWeight: "bold", fontSize: "2rem", color: "#222" }}>
                الشيخ {teacher.teacherinfo?.fname} {teacher.teacherinfo?.lname}
              </h2>
              <p style={{ color: "#666", margin: "8px 0 28px 0", fontSize: "1.1rem" }}>
                {teacher.teacherinfo?.bio || "لا يوجد نبذة متوفرة"}
              </p>
              <div style={{ marginBottom: "24px", display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "8px 10px" }}>
                <span style={{ background: "#1EC8A0", color: "#fff", borderRadius: "6px", padding: "4px 12px", fontWeight: "bold", fontSize: "1.08rem", letterSpacing: "0.5px" }}>
                  {teacher.teacherinfo?.specialty || "غير محدد"}
                </span>
                <span style={{ background: "#fff", color: "#1EC8A0", borderRadius: "6px", padding: "4px 12px", fontWeight: "bold", fontSize: "1.08rem", letterSpacing: "0.5px", display: "inline-flex", alignItems: "center" }}>
                  <span style={{ color: "#1EC8A0", fontWeight: "bold" }}> سنوات الخبرة : </span>
                  <span style={{ color: "#222", fontWeight: "bold", marginRight: "4px" }}>{teacher.teacherinfo?.years_of_experience || "غير محدد"}</span>
                </span>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button
                  style={{
                    background: "#fff",
                    color: "#1EC8A0",
                    border: "2px solid #1EC8A0",
                    borderRadius: "8px",
                    padding: "8px 18px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => navigate(`/teacher/${teacher.id}/feedbacks`)}
                  onMouseEnter={e => {
                    e.target.style.background = "#EAF8F4";
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(30,200,160,0.15)";
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = "#fff";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  عرض التقييمات
                </button>
                <button
                  style={{
                    background: "#1EC8A0",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 18px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={handleOpenModal}
                  onMouseEnter={e => {
                    e.target.style.background = "#17a88a";
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(30,200,160,0.15)";
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = "#1EC8A0";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  إضافة تقييم
                </button>
              </div>
            </div>
          </div>
          {/* Success Modal */}
          {showSuccessModal && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1001
            }}>
              <div style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "32px 28px",
                minWidth: "340px",
                boxShadow: "0 8px 32px rgba(30,200,160,0.13)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px"
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#EAF8F4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <CheckCircle2 size={50} color="#1EC8A0" />
                </div>
                <h3 style={{
                  margin: 0,
                  color: "#222",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  textAlign: "center"
                }}>
                  تم إضافة التقييم بنجاح
                </h3>
              </div>
            </div>
          )}
          {/* Rating Modal */}
          {showModal && (
            <div className="modal-overlay" onClick={handleModalClose} style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000
            }}>
              <div style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "32px 28px 24px 28px",
                minWidth: "340px",
                boxShadow: "0 8px 32px rgba(30,200,160,0.13)",
                position: "relative"
              }}>
                <button onClick={() => setShowModal(false)} style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  background: "none",
                  border: "none",
                  fontSize: "1.3rem",
                  color: "#888",
                  cursor: "pointer"
                }}>×</button>
                <div style={{ marginBottom: "18px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <label style={{ display: "block", marginBottom: "8px", color: "#111", fontWeight: "bold", alignSelf: "flex-start" }}>التقييم (من 5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={rate}
                    onChange={e => {
                      setRate(e.target.value);
                      setModalError(null);
                    }}
                    style={{
                      width: "80%",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: "1px solid #1EC8A0",
                      fontSize: "1rem",
                      margin: "0 auto"
                    }}
                  />
                </div>
                <div style={{ marginBottom: "18px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <label style={{ display: "block", marginBottom: "8px", color: "#111", fontWeight: "bold", alignSelf: "flex-start" }}>التعليق</label>
                  <textarea
                    value={feedback}
                    onChange={e => {
                      setFeedback(e.target.value);
                      setModalError(null);
                    }}
                    rows={3}
                    style={{
                      width: "80%",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: "1px solid #1EC8A0",
                      fontSize: "1rem",
                      resize: "none",
                      margin: "0 auto"
                    }}
                  />
                </div>
                {modalError && (
                  <div style={{ 
                    color: "#dc3545", 
                    fontSize: "0.9rem", 
                    marginBottom: "16px", 
                    textAlign: "center",
                    fontWeight: "bold",
                    padding: "8px",
                    background: "#fff5f5",
                    borderRadius: "6px",
                    border: "1px solid #dc3545",
                    width: "80%",
                    margin: "0 auto 16px auto"
                  }}>
                    {modalError}
                  </div>
                )}
                <button
                  style={{
                    background: "#1EC8A0",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 24px",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    transition: "all 0.2s",
                    margin: "0 auto",
                    display: "block"
                  }}
                  onClick={handleSubmitRating}
                  disabled={submitting}
                >
                  {submitting ? 'جاري الإضافة...' : 'إضافة'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TeacherProfile; 