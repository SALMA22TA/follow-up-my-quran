import React, { useState, useEffect } from "react";
import axios from 'axios';
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";
import { FaEdit, FaTimes } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

const API_URL = 'http://localhost:8000/api/v1/teacher/'; 

const ExamsPage = () => {
  const navigate = useNavigate(); 
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExamTitle, setNewExamTitle] = useState("");
  const [editingExamId, setEditingExamId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // حالة لإظهار/إخفاء الـ Sidebar

  const getApiInstance = () => {
    const token = localStorage.getItem("access_token");
    return axios.create({
      baseURL: API_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  };

  const fetchExams = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("❌ الرجاء تسجيل الدخول أولاً");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const api = getApiInstance();
      const response = await api.get('get_all_exams');
      console.log("Exams response:", response.data);
      setExams(response.data.data.data); 
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }
      setError(err.response?.data.message || '❌ حدث خطأ أثناء جلب الاختبارات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [navigate]);

  const handleAddExam = async () => {
    if (newExamTitle.trim() === "") {
      setError("❌ يرجى إدخال عنوان الاختبار");
      return;
    }

    try {
      const api = getApiInstance();
      const response = await api.post('create_exam', { title: newExamTitle });
      console.log("Create exam response:", response.data);
      await fetchExams(); 
      closeModal();
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }
      setError(err.response?.data.message || '❌ حدث خطأ أثناء إنشاء الاختبار');
    }
  };

  const handleDelete = async (id) => {
    try {
      const api = getApiInstance();
      const response = await api.delete(`delete_exam/${id}`);
      console.log("Delete exam response:", response.data);
      await fetchExams(); 
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }
      setError(err.response?.data.message || '❌ حدث خطأ أثناء حذف الاختبار');
    }
  };

  const handleEdit = (id, title) => {
    setEditingExamId(id);
    setNewExamTitle(title);
    setIsModalOpen(true);
  };

  const handleUpdateExam = async () => {
    if (newExamTitle.trim() === "") {
      setError("❌ يرجى إدخال عنوان الاختبار");
      return;
    }

    try {
      const api = getApiInstance();
      const response = await api.put(`update_exam/${editingExamId}`, {
        title: newExamTitle,
      });
      console.log("Update exam response:", response.data);
      await fetchExams(); 
      closeModal();
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }
      setError(err.response?.data.message || '❌ حدث خطأ أثناء تحديث الاختبار');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewExamTitle("");
    setEditingExamId(null);
    setError(null);
  };

  return (
    <>
      <Navbar />
      <div style={styles.dashboardContainer}>
        <button
          style={{
            display: window.innerWidth <= 768 ? "block" : "none",
            position: "fixed",
            top: "10px",
            right: "10px",
            zIndex: 1001,
            backgroundColor: "#1EC8A0",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>

        <div
          style={{
            ...styles.sidebarContainer,
            display: isSidebarOpen || window.innerWidth > 768 ? "block" : "none",
          }}
        >
          <Sidebar />
        </div>

        <div style={styles.mainContent}>
          <h1 style={styles.pageTitle}>الاختبارات</h1>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button style={styles.addButtonStyle} onClick={() => setIsModalOpen(true)}>
              + إضافة اختبار
            </button>
          </div>
          <div style={styles.headerStyle}>قائمة الاختبارات</div>

          {error && (
            <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center' }}>جاري التحميل...</div>
          ) : exams.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666' }}>
              لا توجد اختبارات حاليًا
            </div>
          ) : (
            <div>
              {exams.map((exam, idx) => (
                <div
                  key={exam.id}
                  style={{ ...styles.rowStyle, cursor: 'pointer' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#ECECEC';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,200,160,0.10)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                  }}
                  onClick={e => {
                    if (
                      e.target.closest('button') ||
                      e.target.closest('svg')
                    ) return;
                    navigate(`/exam/${exam.id}/questions`);
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={styles.circleStyle}>{idx + 1}</span>
                    <span style={{ ...styles.examTitleStyle, color: '#222', fontWeight: 600 }}>{exam.title}</span>
                  </span>
                  <div style={styles.buttonContainerStyle}>
                    <button
                      style={styles.editButtonStyle}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(exam.id, exam.title);
                      }}
                    >
                      <FaEdit /> تعديل
                    </button>
                    <button 
                      style={styles.deleteButtonStyle} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setExamToDelete(exam.id);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      <Trash2 size={18} /> حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isModalOpen && (
            <div style={styles.overlayStyle}>
              <div style={styles.modalStyle}>
                <button onClick={closeModal} style={styles.closeButtonStyle}>
                  <FaTimes />
                </button>
                <h2 style={styles.modalTitle}>
                  {editingExamId ? 'تعديل الاختبار' : 'إنشاء اختبار'}
                </h2>
                <label style={styles.modalLabel}>
                  عنوان الاختبار:
                  <input
                    type="text"
                    value={newExamTitle}
                    onChange={(e) => setNewExamTitle(e.target.value)}
                    style={styles.modalInput}
                    placeholder="أدخل عنوان الاختبار"
                  />
                </label>
                <div style={styles.modalButtonContainer}>
                  <button
                    style={styles.submitButtonStyle}
                    onClick={editingExamId ? handleUpdateExam : handleAddExam}
                  >
                    {editingExamId ? 'تحديث' : 'إضافة'}
                  </button>
                  <button style={styles.cancelButtonStyle} onClick={closeModal}>
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div style={styles.overlayStyle}>
          <div style={styles.modalStyle}>
            <button onClick={() => setShowDeleteConfirm(false)} style={styles.closeButtonStyle}>
              <FaTimes />
            </button>
            <h2 style={styles.modalTitle}>تأكيد الحذف</h2>
            <p style={styles.modalText}>هل أنت متأكد من حذف هذا الاختبار؟</p>
            <div style={styles.modalButtonContainer}>
              <button
                style={styles.deleteConfirmButton}
                onClick={() => {
                  handleDelete(examToDelete);
                  setShowDeleteConfirm(false);
                }}
              >
                حذف
              </button>
              <button
                style={styles.cancelButtonStyle}
                onClick={() => setShowDeleteConfirm(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  dashboardContainer: {
    display: "flex",
    flexDirection: "row-reverse",
    direction: "rtl",
    backgroundColor: "#fff",
    minHeight: "100vh",
  },
  sidebarContainer: {
    width: "250px",
    "@media (max-width: 768px)": {
      position: "fixed",
      top: 0,
      right: 0,
      height: "100vh",
      zIndex: 1000,
      backgroundColor: "#fff",
      boxShadow: "-2px 0 5px rgba(0,0,0,0.2)",
      width: "200px",
    },
  },
  mainContent: {
    marginRight: "250px",
    padding: "30px",
    width: "calc(100% - 250px)",
    "@media (max-width: 768px)": {
      marginRight: "0",
      width: "100%",
      padding: "20px",
    },
  },
  pageTitle: {
    textAlign: "right",
    fontSize: "30px",
    marginBottom: "20px",
    "@media (max-width: 768px)": {
      fontSize: "24px",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "10px",
  },
  addButtonStyle: {
    backgroundColor: "#1EC8A0",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    fontSize: "18px",
    cursor: "pointer",
    "@media (max-width: 768px)": {
      fontSize: "16px",
      padding: "8px 12px",
    },
  },
  headerStyle: {
    backgroundColor: "#1EC8A0",
    color: "#fff",
    padding: "15px",
    borderRadius: "12px",
    fontSize: "20px",
    textAlign: "right",
    width: "95%",
    marginBottom: "10px",
    "@media (max-width: 768px)": {
      fontSize: "18px",
      padding: "10px",
      width: "100%",
    },
  },
  rowStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "10px",
    width: "95%",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "background 0.15s",
    cursor: "pointer",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      alignItems: "flex-end",
      padding: "10px",
      width: "100%",
    },
  },
  examTitleStyle: {
    flex: 1,
    textAlign: "right",
    fontSize: "18px",
    "@media (max-width: 768px)": {
      fontSize: "16px",
      marginBottom: "10px",
    },
  },
  buttonContainerStyle: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    "@media (max-width: 768px)": {
      width: "100%",
      justifyContent: "flex-end",
    },
  },
  editButtonStyle: {
    backgroundColor: "transparent",
    color: "#1EC8A0",
    border: "2px solid #1EC8A0",
    padding: "10px 15px",
    borderRadius: "7px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "18px",
    "@media (max-width: 768px)": {
      fontSize: "16px",
      padding: "8px 12px",
    },
  },
  deleteButtonStyle: {
    backgroundColor: "transparent",
    color: "#dc3545",
    border: "2px solid #dc3545",
    padding: "10px 15px",
    borderRadius: "7px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "18px",
    "@media (max-width: 768px)": {
      fontSize: "16px",
      padding: "8px 12px",
    },
  },
  overlayStyle: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalStyle: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "450px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    position: "relative",
    "@media (max-width: 768px)": {
      width: "90%",
      padding: "20px",
    },
  },
  closeButtonStyle: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    "@media (max-width: 768px)": {
      fontSize: "18px",
    },
  },
  modalTitle: {
    marginBottom: "10px",
    fontSize: "22px",
    "@media (max-width: 768px)": {
      fontSize: "18px",
    },
  },
  modalLabel: {
    display: "block",
    marginBottom: "5px",
    textAlign: "right",
    fontSize: "16px",
    "@media (max-width: 768px)": {
      fontSize: "14px",
    },
  },
  modalInput: {
    width: "97%",
    padding: "10px",
    border: "1px solid #1EC8A0",
    borderRadius: "5px",
    marginBottom: "15px",
    textAlign: "right",
    fontSize: "16px",
    "@media (max-width: 768px)": {
      fontSize: "14px",
      padding: "8px",
    },
  },
  modalButtonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      gap: "10px",
    },
  },
  submitButtonStyle: {
    backgroundColor: "#1EC8A0",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    fontSize: "16px",
    "@media (max-width: 768px)": {
      fontSize: "14px",
      padding: "8px 12px",
      width: "100%",
    },
  },
  cancelButtonStyle: {
    backgroundColor: "#ccc",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    fontSize: "16px",
    "@media (max-width: 768px)": {
      fontSize: "14px",
      padding: "8px 12px",
      width: "100%",
    },
  },
  deleteConfirmButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    fontSize: "16px",
    "@media (max-width: 768px)": {
      fontSize: "14px",
      padding: "8px 12px",
      width: "100%",
    },
  },
  modalText: {
    marginBottom: "15px",
    fontSize: "16px",
    "@media (max-width: 768px)": {
      fontSize: "14px",
    },
  },
  circleStyle: {
    display: "inline-block",
    width: "30px",
    height: "30px",
    backgroundColor: "#1EC8A0",
    color: "#fff",
    borderRadius: "50%",
    textAlign: "center",
    lineHeight: "30px",
    fontSize: "16px",
    marginLeft: "15px",
    "@media (max-width: 768px)": {
      width: "25px",
      height: "25px",
      lineHeight: "25px",
      fontSize: "14px",
      marginLeft: "10px",
    },
  },
};

export default ExamsPage;
