import React, { useState, useEffect } from "react";
import axios from 'axios';
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const API_URL = 'https://graduation-main-0wwkv3.laravel.cloud/api/v1/teacher/';
const BEARER_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTEwNDUxNywiZXhwIjoxNzQxMTA4MTE3LCJuYmYiOjE3NDExMDQ1MTcsImp0aSI6ImRXRTJCOXFzSjlhTDljM00iLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.ypUDldTK9iKMITrXIVvgd-HqhxgKAZM4vx_Gs2Xh8F8';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExamTitle, setNewExamTitle] = useState("");
  const [editingExamId, setEditingExamId] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('get_all_exams');
        setExams(response.data.data.data);
      } catch (err) {
        setError(err.response?.data.message || 'Error fetching exams');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  // Create new exam
  const handleAddExam = async () => {
    if (newExamTitle.trim() === "") return;

    try {
      const response = await api.post('create_exam', { title: newExamTitle });
      setExams(prevExams => [...prevExams, response.data.data]);
      closeModal();
    } catch (err) {
      setError(err.response?.data.message || 'حدث خطأ أثناء إنشاء الاختبار');
    }
  };

  // delete an existing exam
  const handleDelete = async (id) => {
    try {
      await api.delete(`delete_exam/${id}`);
      setExams(prevExams => prevExams.filter(exam => exam.id !== id));
    } catch (err) {
      setError(err.response?.data.message || 'حدث خطأ أثناء حذف الاختبار');
    }
  };
  const handleEdit = (id, title) => {
    setEditingExamId(id);
    setNewExamTitle(title);
    setIsModalOpen(true);
  };
  const handleUpdateExam = async () => {
    if (newExamTitle.trim() === "") return;
    
    try {
      const response = await api.put(`update_exam/${editingExamId}`, {
        title: newExamTitle
      });
      
      setExams(prevExams => prevExams.map(exam => 
        exam.id === editingExamId 
          ? { ...exam, title: newExamTitle }
          : exam
      ));
      
      closeModal();
    } catch (err) {
      setError(err.response?.data.message || 'حدث خطأ أثناء تحديث الاختبار');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewExamTitle("");
    setError(null);
  };

  return (
    <>
      <Navbar />
      <div style={dashboardContainer}>
        <Sidebar />
        <div style={mainContent}>
          <h1 style={pageTitle}>الاختبارات</h1>

          {error && (
            <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
            <button style={createButtonStyle} onClick={openModal}>+ إنشاء</button>
          </div>

          {/* Exams list*/}
          {loading ? (
            <div style={{ textAlign: 'center' }}>جاري التحميل...</div>
          ) : (
            <>
              <h2 style={headerStyle}>قائمة الاختبارات</h2>
              <div>
                {exams.map((exam) => (
                  <div key={exam.id} style={rowStyle}>
                    <span style={circleStyle}>{exam.id}</span>
                    <span style={examTitleStyle}>{exam.title}</span>
                    <div style={buttonContainerStyle}>
                      <button
                        style={editButtonStyle}
                        onClick={() => handleEdit(exam.id, exam.title)}
                      >
                        <FaEdit /> تعديل
                      </button>
                      <button style={deleteButtonStyle} onClick={() => handleDelete(exam.id)}>
                        <FaTrash /> حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <button onClick={closeModal} style={closeButtonStyle}>
              <FaTimes />
            </button>

            <h2 style={modalTitle}>
              {editingExamId ? 'تعديل الاختبار' : 'إنشاء اختبار'}
            </h2>

            <label style={labelStyle}>عنوان الاختبار</label>
            <input
              type="text"
              value={newExamTitle}
              onChange={(e) => setNewExamTitle(e.target.value)}
              style={inputStyle}
              placeholder="ادخل عنوان الاختبار"
            />

            <div style={buttonContainer}>
              <button onClick={closeModal} style={cancelButtonStyle}>إلغاء</button>
              <button
                onClick={editingExamId ? handleUpdateExam : handleAddExam}
                style={addButtonStyle}
              >
                {editingExamId ? 'حفظ التعديلات' : 'إضافة اختبار +'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
// Styles
const dashboardContainer = { display: "flex", flexDirection: "row-reverse", direction: "rtl" };
const mainContent = { marginRight: "250px", padding: "30px", width: "calc(100% - 250px)" };
const pageTitle = { textAlign: "right", fontSize: "30px", marginBottom: "20px" };
const createButtonStyle = { backgroundColor: "#1EC8A0", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "5px", fontSize: "18px", cursor: "pointer" };
const headerStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "15px", borderRadius: "12px", fontSize: "20px", textAlign: "right", width: "95%", marginBottom: "10px" };
const rowStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", padding: "15px", borderRadius: "12px", marginBottom: "10px", width: "95%", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" };
const examTitleStyle = { flex: 1, textAlign: "right", fontSize: "18px" };
const circleStyle = { display: "inline-block", width: "30px", height: "30px", backgroundColor: "#1EC8A0", color: "#fff", borderRadius: "50%", textAlign: "center", lineHeight: "30px", fontSize: "16px", marginLeft: "15px" };
const buttonContainerStyle = { display: "flex", gap: "10px", justifyContent: "center" };
const editButtonStyle = { backgroundColor: "transparent", color: "#1EC8A0", border: "2px solid #1EC8A0", padding: "10px 15px", borderRadius: "7px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "18px" };
const deleteButtonStyle = { backgroundColor: "transparent", color: "#dc3545", border: "2px solid #dc3545", padding: "10px 15px", borderRadius: "7px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "18px" };

// Modal Styles
const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" };
const modalStyle = { backgroundColor: "#fff", padding: "30px", borderRadius: "12px", width: "450px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", position: "relative" };
const closeButtonStyle = { position: "absolute", top: "10px", left: "10px", background: "none", border: "none", fontSize: "20px", cursor: "pointer" };
const modalTitle = { marginBottom: "10px", fontSize: "22px" };
const labelStyle = { display: "block", marginBottom: "5px", textAlign: "right" };
const inputStyle = { width: "97%", padding: "10px", border: "1px solid #1EC8A0", borderRadius: "5px", marginBottom: "15px", textAlign: "right", fontSize: "16px" };
const buttonContainer = { display: "flex", justifyContent: "space-between", marginTop: "15px" };
const cancelButtonStyle = { backgroundColor: "#ccc", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", border: "none" };
const addButtonStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", border: "none" };
export default Exams;