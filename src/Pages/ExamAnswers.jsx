import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";
import { FaEdit, /*FaPlus,*/ FaTimes, /*FaTrash*/ } from "react-icons/fa";
import { Trash2 } from "lucide-react";

const API_URL = 'http://localhost:8000/api/v1/teacher/';

const ExamAnswers = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentOption, setCurrentOption] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the question
  const fetchQuestion = async () => {
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

      const response = await api.get(`get_question/${questionId}`);
      console.log("Question response:", JSON.stringify(response.data, null, 2)); // Debug
      setQuestion(response.data.data);
      console.log("Current question state after fetch:", response.data.data); // Debug
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }
      setError("❌ حدث خطأ أثناء جلب السؤال: " + (err.response?.data.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Fetch all options for the question
  const fetchOptions = async () => {
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

      const response = await api.get(`get_all_options/${questionId}`);
      console.log("Options response:", response.data); // Debug
      if (response.data?.data?.data) {
        setOptions(response.data.data.data);
      } else {
        setOptions([]);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }
      setError("❌ حدث خطأ أثناء جلب الخيارات: " + (err.response?.data.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
    fetchOptions();
  }, [questionId, navigate]);

  useEffect(() => {
    console.log("Question state updated:", question);
  }, [question]);

  // Open Add Answer Modal
  const openAddModal = () => {
    setIsEditing(false);
    setAnswerText("");
    setIsCorrect(false);
    setIsModalOpen(true);
  };

  // Open Edit Answer Modal
  const openEditModal = (option, e) => {
    e.stopPropagation();
    setIsEditing(true);
    setCurrentOption(option);
    setAnswerText(option.option_text);
    setIsCorrect(option.is_correct);
    setIsModalOpen(true);
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (option, e) => {
    e.stopPropagation();
    setCurrentOption(option);
    setIsDeleteModalOpen(true);
  };

  // Close Add/Edit Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setAnswerText("");
    setIsCorrect(false);
    setCurrentOption(null);
  };

  // Close Delete Modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentOption(null);
  };

  // Add a New Answer
  const handleAddAnswer = async () => {
    if (answerText.trim() === "") {
      setError("❌ يرجى إدخال نص الإجابة");
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

      console.log("Sending answer:", {
        options: [
          {
            option_text: answerText,
            is_correct: isCorrect,
          },
        ],
      }); // Debug
      const response = await api.post(`create_option/${questionId}`, {
        options: [
          {
            option_text: answerText,
            is_correct: isCorrect,
          },
        ],
      });

      console.log("Create option response:", response.data); // Debug
      setTimeout(async () => {
        await fetchOptions(); // Refresh the options list
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
      setError("❌ حدث خطأ أثناء إضافة الخيار: " + (err.response?.data?.message || err.message));
    }
  };

  // Update an Existing Answer
  const handleUpdateAnswer = async () => {
    if (answerText.trim() === "" || !currentOption) {
      setError("❌ يرجى إدخال نص الإجابة");
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

      console.log("Updating answer:", { option_text: answerText, is_correct: isCorrect }); // Debug
      const response = await api.put(`update_option/${currentOption.id}`, {
        option_text: answerText,
        is_correct: isCorrect,
      });

      console.log("Update option response:", response.data); // Debug
      setTimeout(async () => {
        await fetchOptions(); // Refresh the options list
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
      setError("❌ حدث خطأ أثناء تعديل الخيار: " + (err.response?.data.message || err.message));
    }
  };

  // Delete an Answer
  const handleDelete = async () => {
    if (!currentOption) return;

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

      const response = await api.delete(`delete_option/${currentOption.id}`);
      console.log("Delete option response:", response.data); // Debug
      setTimeout(async () => {
        await fetchOptions(); // Refresh the options list
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
      setError("❌ حدث خطأ أثناء حذف الخيار: " + (err.response?.data.message || err.message));
    }
  };

  return (
    <>
      <Navbar />
      <div style={dashboardContainer}>
        <Sidebar />
        <div style={mainContent}>
          <h1 style={pageTitle}>إجابات السؤال {questionId}</h1>

          {error && (
            <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>
          )}

          <div style={questionBoxStyle}>
            {question?.question_text || "جاري التحميل..."}
          </div>

          <div style={buttonContainer}>
            <button style={addButtonStyle} onClick={openAddModal}>
              + إضافة إجابة
            </button>
            <button style={backButtonStyle} onClick={() => navigate(`/exam/${question?.exam_id}/questions`)}>
              العودة للأسئلة
            </button>
          </div>

          <div style={headerStyle}>
            <FaEdit /> الإجابات:
          </div>

          <div>
            {loading ? (
              <div style={{ textAlign: 'center' }}>جاري التحميل...</div>
            ) : options.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666' }}>
                لا توجد إجابات حاليًا
              </div>
            ) : (
              options.map((option) => (
                <div key={option.id} style={rowStyle}>
                  <span style={circleStyle}>{option.id}</span>
                  <span style={answerTextStyle}>{option.option_text}</span>
                  <span style={isCorrectStyle}>
                    {option.is_correct ? "صحيح" : "خاطئ"}
                  </span>
                  <div style={buttonContainerStyle}>
                    <button style={editButtonStyle} onClick={(e) => openEditModal(option, e)}>
                      <FaEdit /> تعديل
                    </button>
                    <button style={deleteButtonStyle} onClick={(e) => openDeleteModal(option, e)}>
                      <Trash2 /> حذف
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal for Adding/Editing Answers */}
          {isModalOpen && (
            <div style={modalStyle}>
              <div style={modalContentStyle}>
                <button style={closeButtonStyle} onClick={closeModal}>
                  <FaTimes />
                </button>
                <h2 style={modalTitleStyle}>{isEditing ? "تعديل الإجابة" : "إضافة إجابة"}</h2>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  style={textareaStyle}
                  placeholder="اكتب الإجابة هنا..."
                />
                <div style={checkboxContainerStyle}>
                  <label style={{ marginLeft: '10px' }}>الإجابة الصحيحة:</label>
                  <input
                    type="checkbox"
                    checked={isCorrect}
                    onChange={(e) => setIsCorrect(e.target.checked)}
                  />
                </div>
                <div style={modalButtonContainerStyle}>
                  <button
                    style={submitButtonStyle}
                    onClick={isEditing ? handleUpdateAnswer : handleAddAnswer}
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
                <p style={deleteText}>هل أنت متأكد من حذف هذه الإجابة؟</p>
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
const questionBoxStyle = { backgroundColor: "#f0f0f0", padding: "15px", borderRadius: "12px", marginBottom: "20px", textAlign: "right", fontSize: "18px" };
const headerStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "15px", borderRadius: "12px", fontSize: "20px", textAlign: "right", width: "95%", marginBottom: "10px" };
const rowStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", padding: "15px", borderRadius: "12px", marginBottom: "10px", width: "95%", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" };
const circleStyle = { display: "inline-block", width: "30px", height: "30px", backgroundColor: "#1EC8A0", color: "#fff", borderRadius: "50%", textAlign: "center", lineHeight: "30px", fontSize: "16px", marginLeft: "15px" };
const addButtonStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", border: "none", display: "flex", alignItems: "center", gap: "5px", fontSize: "18px" };
const backButtonStyle = { backgroundColor: "#ccc", color: "#fff", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", border: "none", marginRight: "10px", fontSize: "18px" };

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
const checkboxContainerStyle = { textAlign: "right", margin: "10px 0" };

const answerTextStyle = { flex: 1, textAlign: "right", fontSize: "18px" };
const isCorrectStyle = { width: "100px", textAlign: "center", fontSize: "18px" };
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

export default ExamAnswers;