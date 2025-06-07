import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";
import { FaEdit, FaTimes } from "react-icons/fa";
import { Trash2 } from "lucide-react";

const API_URL = 'http://localhost:8000/api/v1/teacher/';

const ExamQuestions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [examTitle, setExamTitle] = useState("");

  const fetchQuestions = async () => {
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
      const api = axios.create({
        baseURL: API_URL,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const response = await api.get(`get_all_questions/${examId}`);
      console.log("Questions response:", response.data);

      let fetchedQuestions = [];
      if (response.data?.data?.data) {
        fetchedQuestions = response.data.data.data;
      } else if (response.data?.data) {
        fetchedQuestions = response.data.data;
      } else if (response.data?.questions) {
        fetchedQuestions = response.data.questions;
      }

      setQuestions(fetchedQuestions);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }
      setError("❌ حدث خطأ أثناء جلب الأسئلة: " + (err.response?.data.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // Fetch exam title
    const fetchExamTitle = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      try {
        const api = axios.create({
          baseURL: API_URL,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        const response = await api.get(`get_exam/${examId}`);
        setExamTitle(response.data.data?.title || "");
      } catch (err) {
        setExamTitle("");
      }
    };
    fetchExamTitle();
  }, [examId, navigate]);

  const openAddModal = () => {
    setIsEditing(false);
    setQuestionText("");
    setIsModalOpen(true);
  };

  const openEditModal = (question, e) => {
    e.stopPropagation();
    setIsEditing(true);
    setCurrentQuestion(question);
    setQuestionText(question.question_text);
    setIsModalOpen(true);
  };

  const openDeleteModal = (question, e) => {
    e.stopPropagation();
    setCurrentQuestion(question);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setQuestionText("");
    setCurrentQuestion(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentQuestion(null);
  };

  const handleAddQuestion = async () => {
    if (questionText.trim() === "") {
      setError("❌ يرجى إدخال نص السؤال");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("❌ الرجاء تسجيل الدخول أولاً");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    try {
      const api = axios.create({
        baseURL: API_URL,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const response = await api.post(`create_question/${examId}`, {
        question_text: questionText,
      });

      console.log("Create question response:", response.data);

      setTimeout(async () => {
        await fetchQuestions();
      }, 500);

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
      setError("❌ حدث خطأ أثناء إضافة السؤال: " + (err.response?.data.message || err.message));
    }
  };

  const handleUpdateQuestion = async () => {
    if (questionText.trim() === "" || !currentQuestion) {
      setError("❌ يرجى إدخال نص السؤال");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("❌ الرجاء تسجيل الدخول أولاً");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    try {
      const api = axios.create({
        baseURL: API_URL,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const response = await api.put(`update_question/${currentQuestion.id}`, {
        question_text: questionText,
      });

      console.log("Update question response:", response.data);

      setTimeout(async () => {
        await fetchQuestions();
      }, 500);

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
      setError("❌ حدث خطأ أثناء تعديل السؤال: " + (err.response?.data.message || err.message));
    }
  };

  const handleDelete = async () => {
    if (!currentQuestion) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("❌ الرجاء تسجيل الدخول أولاً");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    try {
      const api = axios.create({
        baseURL: API_URL,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const response = await api.delete(`delete_question/${currentQuestion.id}`);
      console.log("Delete question response:", response.data);

      setTimeout(async () => {
        await fetchQuestions();
      }, 500);

      closeDeleteModal();
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
      setError("❌ حدث خطأ أثناء حذف السؤال: " + (err.response?.data.message || err.message));
    }
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
          <h1 style={styles.pageTitle}>
            {examTitle ? `عنوان الاختبار: ${examTitle}` : "عنوان الاختبار"}
          </h1>

          {error && (
            <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>
          )}

          <div style={styles.buttonContainer}>
            <button style={styles.addButtonStyle} onClick={openAddModal}>
              + إضافة سؤال  
            </button>
          </div>
          <div style={styles.headerStyle}>
            <FaEdit/> أسئلة الاختبار:
          </div>

          <div>
            {loading ? (
              <div style={{ textAlign: 'center' }}>جاري التحميل...</div>
            ) : questions.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666' }}>
                لا توجد أسئلة حاليًا
              </div>
            ) : (
              questions.map((question, idx) => (
                <div
                  key={question.id}
                  style={styles.rowStyle}
                  onClick={() => navigate(`/exam-answers/${question.id}`)}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ECECEC'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                >
                  <span style={styles.circleStyle}>{idx + 1}</span>
                  <span style={styles.questionTextStyle}>{question.question_text}</span>
                  <div style={styles.buttonContainerStyle}>
                    <button style={styles.editButtonStyle} onClick={e => openEditModal(question, e)}>
                      <FaEdit /> تعديل
                    </button>
                    <button style={styles.deleteButtonStyle} onClick={e => openDeleteModal(question, e)}>
                      <Trash2 /> حذف
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {isModalOpen && (
            <div style={styles.modalStyle}>
              <div style={styles.modalContentStyle}>
                <button style={styles.closeButtonStyle} onClick={closeModal}>
                  <FaTimes />
                </button>
                <h2 style={styles.modalTitleStyle}>{isEditing ? "تعديل السؤال" : "إضافة سؤال"}</h2>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  style={styles.textareaStyle}
                  placeholder="اكتب السؤال هنا..."
                />
                <div style={styles.modalButtonContainerStyle}>
                  <button
                    style={styles.submitButtonStyle}
                    onClick={isEditing ? handleUpdateQuestion : handleAddQuestion}
                  >
                    + إضافة
                  </button>
                  <button style={styles.cancelButtonStyle} onClick={closeModal}>إلغاء</button>
                </div>
              </div>
            </div>
          )}

          {isDeleteModalOpen && (
            <div style={styles.modalStyle}>
              <div style={styles.modalContentStyle}>
                <button style={styles.closeButtonStyle} onClick={closeDeleteModal}>
                  <FaTimes />
                </button>
                <div style={styles.deleteIconContainer}>
                  <Trash2 size={50} color="#dc3545" />
                </div>
                <p style={styles.deleteText}>هل أنت متأكد من حذف هذا السؤال؟</p>
                <div style={styles.buttonContainer}>
                  <button onClick={handleDelete} style={styles.deleteConfirmButton}>نعم</button>
                  <button onClick={closeDeleteModal} style={styles.cancelButtonStyle}>لا</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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
    cursor: "pointer",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      alignItems: "flex-end",
      padding: "10px",
      width: "100%",
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
  questionTextStyle: {
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
  addButtonStyle: {
    backgroundColor: "#1EC8A0",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "18px",
    "@media (max-width: 768px)": {
      fontSize: "16px",
      padding: "8px 12px",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "end",
    marginTop: "10px",
    marginBottom: "18px",
    "@media (max-width: 768px)": {
      justifyContent: "center",
    },
  },
  modalStyle: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContentStyle: {
    backgroundColor: "#fff",
    padding: "50px",
    borderRadius: "10px",
    textAlign: "center",
    width: "500px",
    "@media (max-width: 768px)": {
      width: "90%",
      padding: "20px",
    },
  },
  closeButtonStyle: {
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    float: "left",
    "@media (max-width: 768px)": {
      fontSize: "18px",
    },
  },
  modalTitleStyle: {
    textAlign: "right",
    fontSize: "22px",
    marginBottom: "10px",
    "@media (max-width: 768px)": {
      fontSize: "18px",
    },
  },
  textareaStyle: {
    width: "100%",
    height: "90px",
    padding: "10px",
    border: "1px solid #1EC8A0",
    borderRadius: "5px",
    textAlign: "right",
    fontSize: "16px",
    "@media (max-width: 768px)": {
      fontSize: "14px",
      height: "70px",
    },
  },
  modalButtonContainerStyle: {
    display: "inline-flex",
    justifyContent: "space-between",
    marginTop: "10px",
    width: "100%",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      gap: "10px",
    },
  },
  submitButtonStyle: {
    backgroundColor: "#1EC8A0",
    color: "#fff",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    "@media (max-width: 768px)": {
      fontSize: "14px",
      padding: "8px",
      width: "100%",
    },
  },
  cancelButtonStyle: {
    backgroundColor: "#ccc",
    color: "#fff",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    "@media (max-width: 768px)": {
      fontSize: "14px",
      padding: "8px",
      width: "100%",
    },
  },
  deleteText: {
    textAlign: "center",
    fontSize: "18px",
    "@media (max-width: 768px)": {
      fontSize: "16px",
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
  deleteIconContainer: {
    textAlign: "center",
    marginBottom: "10px",
  },
};

export default ExamQuestions;
