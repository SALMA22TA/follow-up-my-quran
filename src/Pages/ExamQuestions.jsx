import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";
import { FaEdit, /*FaPlus,*/ FaTimes, /*FaTrash*/ } from "react-icons/fa";
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

  // Fetch all questions for the exam
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
      console.log("Questions response:", response.data); // Debug

      // جربي شكل الـ response
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
  }, [examId, navigate]);

  // Open Add Question Modal
  const openAddModal = () => {
    setIsEditing(false);
    setQuestionText("");
    setIsModalOpen(true);
  };

  // Open Edit Question Modal
  const openEditModal = (question, e) => {
    e.stopPropagation();
    setIsEditing(true);
    setCurrentQuestion(question);
    setQuestionText(question.text);
    setIsModalOpen(true);
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (question, e) => {
    e.stopPropagation();
    setCurrentQuestion(question);
    setIsDeleteModalOpen(true);
  };

  // Close Add/Edit Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setQuestionText("");
    setCurrentQuestion(null);
  };

  // Close Delete Modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentQuestion(null);
  };

  // Add a New Question
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

      console.log("API URL for create_question:", `${API_URL}create_question/${examId}`); // Debug
      console.log("Sending question:", questionText); // Debug
      const response = await api.post(`create_question/${examId}`, {
        question_text: questionText,
      });

      console.log("Create question response:", response.data); // Debug

      // أضيفي تأخير بسيط قبل جلب الأسئلة
      setTimeout(async () => {
        await fetchQuestions(); // Refresh the questions list
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

  // Update an Existing Question
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

      console.log("API URL for update_question:", `${API_URL}update_question/${currentQuestion.id}`); // Debug
      console.log("Updating question:", questionText); // Debug
      const response = await api.put(`update_question/${currentQuestion.id}`, {
        question_text: questionText,
      });

      console.log("Update question response:", response.data); // Debug

      setTimeout(async () => {
        await fetchQuestions(); // Refresh the questions list
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

  // Delete a Question
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

      console.log("API URL for delete_question:", `${API_URL}delete_question/${currentQuestion.id}`); // Debug
      const response = await api.delete(`delete_question/${currentQuestion.id}`);
      console.log("Delete question response:", response.data); // Debug

      setTimeout(async () => {
        await fetchQuestions(); // Refresh the questions list
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
      <div style={dashboardContainer}>
        <Sidebar />
        <div style={mainContent}>
          <h1 style={pageTitle}>عنوان اختبار {examId}</h1>

          {error && (
            <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>
          )}

          <div style={buttonContainer}>
            <button style={addButtonStyle} onClick={openAddModal}>
              + إضافة سؤال  
            </button>
          </div>
          <div style={headerStyle}> <FaEdit/> أسئلة الاختبار: </div>

          <div>
            {loading ? (
              <div style={{ textAlign: 'center' }}>جاري التحميل...</div>
            ) : questions.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666' }}>
                لا توجد أسئلة حاليًا
              </div>
            ) : (
              questions.map((question) => (
                <div key={question.id} style={rowStyle} onClick={() => navigate(`/exam-answers/${question.id}`)}>
                  <span style={circleStyle}>{question.id}</span>
                  <span style={questionTextStyle}>{question.question_text}</span> {/* التعديل هنا: question_text بدل text */}
                  <div style={buttonContainerStyle}>
                    <button style={editButtonStyle} onClick={(e) => openEditModal(question, e)}>
                      <FaEdit /> تعديل
                    </button>
                    <button style={deleteButtonStyle} onClick={(e) => openDeleteModal(question, e)}>
                      <Trash2 /> حذف
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal for Adding/Editing Questions */}
          {isModalOpen && (
            <div style={modalStyle}>
              <div style={modalContentStyle}>
                <button style={closeButtonStyle} onClick={closeModal}>
                  <FaTimes />
                </button>
                <h2 style={modalTitleStyle}>{isEditing ? "تعديل السؤال" : "إضافة سؤال"}</h2>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  style={textareaStyle}
                  placeholder="اكتب السؤال هنا..."
                />
                <div style={modalButtonContainerStyle}>
                  <button
                    style={submitButtonStyle}
                    onClick={isEditing ? handleUpdateQuestion : handleAddQuestion}
                  >
                    + إضافة
                  </button>
                  <button style={cancelButtonStyle} onClick={closeModal}>إلغاء</button>
                </div>
              </div>
            </div>
          )}

          {/* Modal for Confirming Deletion */}
          {isDeleteModalOpen && (
            <div style={modalStyle}>
              <div style={modalContentStyle}>
                <button style={closeButtonStyle} onClick={closeDeleteModal}>
                  <FaTimes />
                </button>
                <div style={deleteIconContainer}>
                  <Trash2 size={50} color="#dc3545" />
                </div>
                <p style={deleteText}>هل أنت متأكد من حذف هذا السؤال؟</p>
                <div style={buttonContainer}>
                  <button onClick={handleDelete} style={deleteConfirmButton}>نعم</button>
                  <button onClick={closeDeleteModal} style={cancelButtonStyle}>لا</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Styles
const dashboardContainer = { display: "flex", flexDirection: "row-reverse", direction: "rtl" };
const mainContent = { marginRight: "250px", padding: "30px", width: "calc(100% - 250px)" };
const pageTitle = { textAlign: "right", fontSize: "30px", marginBottom: "20px" };
const headerStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "15px", borderRadius: "12px", fontSize: "20px", textAlign: "right", width: "95%", marginBottom: "10px" };
const rowStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", padding: "15px", borderRadius: "12px", marginBottom: "10px", width: "95%", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", cursor: "pointer" };
const circleStyle = { display: "inline-block", width: "30px", height: "30px", backgroundColor: "#1EC8A0", color: "#fff", borderRadius: "50%", textAlign: "center", lineHeight: "30px", fontSize: "16px", marginLeft: "15px" };
const addButtonStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", border: "none", display: "flex", alignItems: "center", gap: "5px", fontSize: "18px" };

// Modal styles
const deleteText = { textAlign: "center", fontSize: "18px" };
const buttonContainer = { display: "flex", justifyContent: "end", marginTop: "10px", marginBottom: "18px" };
const deleteConfirmButton = { backgroundColor: "#dc3545", color: "#fff", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", border: "none" };
const modalStyle = { position: "fixed", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" };
const modalContentStyle = { backgroundColor: "#fff", padding: "50px", borderRadius: "10px", textAlign: "center" };
const closeButtonStyle = { background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", float: "left" };
const submitButtonStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "10px", borderRadius: "5px", border: "none", cursor: "pointer" };
const deleteIconContainer = { textAlign: "center", marginBottom: "10px" };
const textareaStyle = { width: "100%", height: "90px", padding: "10px", border: "1px solid #1EC8A0", borderRadius: "5px", textAlign: "right", fontSize: "16px" };
const modalTitleStyle = { textAlign: "right", fontSize: "22px", marginBottom: "10px" };
const modalButtonContainerStyle = { display: "inline-flex", justifyContent: "space-between", marginTop: "10px" };
const cancelButtonStyle = { backgroundColor: "#ccc", color: "#fff", padding: "10px", borderRadius: "5px", border: "none", cursor: "pointer" };

const questionTextStyle = { flex: 1, textAlign: "right", fontSize: "18px" };
const buttonContainerStyle = { display: "flex", gap: "10px", justifyContent: "center" };
const editButtonStyle = {
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
};
const deleteButtonStyle = {
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
};

export default ExamQuestions;