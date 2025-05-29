// @ts-ignore
import React, { useState, useEffect } from "react";
import axios from 'axios';
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 

const API_URL = 'http://localhost:8000/api/v1/teacher/'; 

const Exams = () => {
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
      // @ts-ignore
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
      // @ts-ignore
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        // @ts-ignore
        setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }
      // @ts-ignore
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
      // @ts-ignore
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
      // @ts-ignore
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        // @ts-ignore
        setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }
      // @ts-ignore
      setError(err.response?.data.message || '❌ حدث خطأ أثناء إنشاء الاختبار');
    }
  };

  // @ts-ignore
  const handleDelete = async (id) => {
    try {
      const api = getApiInstance();
      const response = await api.delete(`delete_exam/${id}`);
      console.log("Delete exam response:", response.data);
      await fetchExams(); 
      setError(null);
    } catch (err) {
      // @ts-ignore
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        // @ts-ignore
        setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }
      // @ts-ignore
      setError(err.response?.data.message || '❌ حدث خطأ أثناء حذف الاختبار');
    }
  };

  // @ts-ignore
  const handleEdit = (id, title) => {
    setEditingExamId(id);
    setNewExamTitle(title);
    setIsModalOpen(true);
  };

  const handleUpdateExam = async () => {
    if (newExamTitle.trim() === "") {
      // @ts-ignore
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
      // @ts-ignore
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        // @ts-ignore
        setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }
      // @ts-ignore
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
      <div 
// @ts-ignore
      style={styles.dashboardContainer}>
        {/* زر Hamburger Menu للشاشات الصغيرة */}
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

        {/* الـ Sidebar */}
        <div
          style={{
            ...styles.sidebarContainer,
            display: isSidebarOpen || window.innerWidth > 768 ? "block" : "none",
          }}
        >
          <Sidebar />
        </div>

        <div style={styles.mainContent}>
          <h1 
// @ts-ignore
          style={styles.pageTitle}>الاختبارات</h1>

          {error && (
            <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
            <button style={styles.createButtonStyle} onClick={openModal}>+ إنشاء</button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center' }}>جاري التحميل...</div>
          ) : (
            <>
              <h2 
// @ts-ignore
              style={styles.headerStyle}>قائمة الاختبارات</h2>
              <div>
                {exams.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#666' }}>
                    لا توجد اختبارات حاليًا
                  </div>
                ) : (
                  exams.map((exam) => (
                    <div key={exam.
// @ts-ignore
                    id} style={styles.rowStyle}>
                      <span 
// @ts-ignore
                      style={styles.circleStyle}>{exam.id}</span>
                      <span
                        // @ts-ignore
                        style={{ ...styles.examTitleStyle, cursor: 'pointer', color: '#1EC8A0' }}
                        // @ts-ignore
                        onClick={() => navigate(`/exam/${exam.id}/questions`)}
                      >
                        {exam.
// @ts-ignore
                        title}
                      </span>
                      <div style={styles.buttonContainerStyle}>
                        <button
                          style={styles.editButtonStyle}
                          // @ts-ignore
                          onClick={() => handleEdit(exam.id, exam.title)}
                        >
                          <FaEdit /> تعديل
                        </button>
                        <button style={styles.deleteButtonStyle} onClick={() => {
                          // @ts-ignore
                          setExamToDelete(exam.id);
                          setShowDeleteConfirm(true);
                        }}>
                          <FaTrash /> حذف
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div 
// @ts-ignore
        style={styles.overlayStyle}>
          <div 
// @ts-ignore
          style={styles.modalStyle}>
            <button onClick={closeModal} 
// @ts-ignore
            style={styles.closeButtonStyle}>
              <FaTimes />
            </button>

            <h2 style={styles.modalTitle}>
              {editingExamId ? 'تعديل الاختبار' : 'إنشاء اختبار'}
            </h2>

            <label 
// @ts-ignore
            style={styles.labelStyle}>عنوان الاختبار</label>
            <input
              type="text"
              value={newExamTitle}
              onChange={(e) => setNewExamTitle(e.target.value)}
              // @ts-ignore
              style={styles.inputStyle}
              placeholder="ادخل عنوان الاختبار"
            />

            <div style={styles.buttonContainer}>
              <button onClick={closeModal} style={styles.cancelButtonStyle}>إلغاء</button>
              <button
                onClick={editingExamId ? handleUpdateExam : handleAddExam}
                style={styles.addButtonStyle}
              >
                {editingExamId ? 'حفظ التعديلات' : 'إضافة اختبار +'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div 
// @ts-ignore
        style={styles.overlayStyle}>
          <div 
// @ts-ignore
          style={styles.modalStyle}>
            <button onClick={() => setShowDeleteConfirm(false)} 
// @ts-ignore
            style={styles.closeButtonStyle}>
              <FaTimes />
            </button>
            <h2 style={styles.modalTitle}>هل أنت متأكد أنك تريد حذف هذا الاختبار؟</h2>
            <div style={styles.buttonContainer}>
              <button
                onClick={() => {
                  handleDelete(examToDelete);
                  setShowDeleteConfirm(false);
                }}
                style={{ ...styles.addButtonStyle, backgroundColor: "#dc3545" }}
              >
                نعم
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={styles.cancelButtonStyle}
              >
                لا
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
  createButtonStyle: {
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
  labelStyle: {
    display: "block",
    marginBottom: "5px",
    textAlign: "right",
    fontSize: "16px",
    "@media (max-width: 768px)": {
      fontSize: "14px",
    },
  },
  inputStyle: {
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
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      gap: "10px",
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
  addButtonStyle: {
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
};

export default Exams;

/********************************** Latest ********************************** */
// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";
// import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
// import { useNavigate } from "react-router-dom"; 

// const API_URL = 'http://localhost:8000/api/v1/teacher/'; 

// const Exams = () => {
//   const navigate = useNavigate(); 
//   const [exams, setExams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newExamTitle, setNewExamTitle] = useState("");
//   const [editingExamId, setEditingExamId] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [examToDelete, setExamToDelete] = useState(null);

//   const getApiInstance = () => {
//     const token = localStorage.getItem("access_token");
//     return axios.create({
//       baseURL: API_URL,
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//       },
//     });
//   };

//   const fetchExams = async () => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setError("❌ الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       const api = getApiInstance();
//       const response = await api.get('get_all_exams');
//       console.log("Exams response:", response.data); // Debug
//       setExams(response.data.data.data); 
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem("access_token");
//         setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }
//       setError(err.response?.data.message || '❌ حدث خطأ أثناء جلب الاختبارات');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExams();
//   }, [navigate]);

//   // Create new exam
//   const handleAddExam = async () => {
//     if (newExamTitle.trim() === "") {
//       setError("❌ يرجى إدخال عنوان الاختبار");
//       return;
//     }

//     try {
//       const api = getApiInstance();
//       const response = await api.post('create_exam', { title: newExamTitle });
//       console.log("Create exam response:", response.data); // Debug
//       await fetchExams(); 
//       closeModal();
//       setError(null);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem("access_token");
//         setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }
//       setError(err.response?.data.message || '❌ حدث خطأ أثناء إنشاء الاختبار');
//     }
//   };

//   // Delete an existing exam
//   const handleDelete = async (id) => {
//     try {
//       const api = getApiInstance();
//       const response = await api.delete(`delete_exam/${id}`);
//       console.log("Delete exam response:", response.data); // Debug
//       await fetchExams(); 
//       setError(null);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem("access_token");
//         setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }
//       setError(err.response?.data.message || '❌ حدث خطأ أثناء حذف الاختبار');
//     }
//   };

//   // Edit an existing exam
//   const handleEdit = (id, title) => {
//     setEditingExamId(id);
//     setNewExamTitle(title);
//     setIsModalOpen(true);
//   };

//   const handleUpdateExam = async () => {
//     if (newExamTitle.trim() === "") {
//       setError("❌ يرجى إدخال عنوان الاختبار");
//       return;
//     }

//     try {
//       const api = getApiInstance();
//       const response = await api.put(`update_exam/${editingExamId}`, {
//         title: newExamTitle,
//       });
//       console.log("Update exam response:", response.data); // Debug
//       await fetchExams(); 
//       closeModal();
//       setError(null);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem("access_token");
//         setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }
//       setError(err.response?.data.message || '❌ حدث خطأ أثناء تحديث الاختبار');
//     }
//   };

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setNewExamTitle("");
//     setEditingExamId(null);
//     setError(null);
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={dashboardContainer}>
//         <Sidebar />
//         <div style={mainContent}>
//           <h1 style={pageTitle}>الاختبارات</h1>

//           {error && (
//             <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
//           )}

//           <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
//             <button style={createButtonStyle} onClick={openModal}>+ إنشاء</button>
//           </div>

//           {/* Exams list */}
//           {loading ? (
//             <div style={{ textAlign: 'center' }}>جاري التحميل...</div>
//           ) : (
//             <>
//               <h2 style={headerStyle}>قائمة الاختبارات</h2>
//               <div>
//                 {exams.length === 0 ? (
//                   <div style={{ textAlign: 'center', color: '#666' }}>
//                     لا توجد اختبارات حاليًا
//                   </div>
//                 ) : (
//                   exams.map((exam) => (
//                     <div key={exam.id} style={rowStyle}>
//                       <span style={circleStyle}>{exam.id}</span>
//                       <span
//                         style={{ ...examTitleStyle, cursor: 'pointer', color: '#1EC8A0' }}
//                         onClick={() => navigate(`/exam/${exam.id}/questions`)} // التعديل هنا: يروح مباشرة لصفحة الأسئلة
//                       >
//                         {exam.title}
//                       </span>
//                       <div style={buttonContainerStyle}>
//                         <button
//                           style={editButtonStyle}
//                           onClick={() => handleEdit(exam.id, exam.title)}
//                         >
//                           <FaEdit /> تعديل
//                         </button>
//                         <button style={deleteButtonStyle} onClick={() => {
//                           setExamToDelete(exam.id);
//                           setShowDeleteConfirm(true);
//                         }}>
//                           <FaTrash /> حذف
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {isModalOpen && (
//         <div style={overlayStyle}>
//           <div style={modalStyle}>
//             <button onClick={closeModal} style={closeButtonStyle}>
//               <FaTimes />
//             </button>

//             <h2 style={modalTitle}>
//               {editingExamId ? 'تعديل الاختبار' : 'إنشاء اختبار'}
//             </h2>

//             <label style={labelStyle}>عنوان الاختبار</label>
//             <input
//               type="text"
//               value={newExamTitle}
//               onChange={(e) => setNewExamTitle(e.target.value)}
//               style={inputStyle}
//               placeholder="ادخل عنوان الاختبار"
//             />

//             <div style={buttonContainer}>
//               <button onClick={closeModal} style={cancelButtonStyle}>إلغاء</button>
//               <button
//                 onClick={editingExamId ? handleUpdateExam : handleAddExam}
//                 style={addButtonStyle}
//               >
//                 {editingExamId ? 'حفظ التعديلات' : 'إضافة اختبار +'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showDeleteConfirm && (
//         <div style={overlayStyle}>
//           <div style={modalStyle}>
//             <button onClick={() => setShowDeleteConfirm(false)} style={closeButtonStyle}>
//               <FaTimes />
//             </button>
//             <h2 style={modalTitle}>هل أنت متأكد أنك تريد حذف هذا الاختبار؟</h2>
//             <div style={buttonContainer}>
//               <button
//                 onClick={() => {
//                   handleDelete(examToDelete);
//                   setShowDeleteConfirm(false);
//                 }}
//                 style={{ ...addButtonStyle, backgroundColor: "#dc3545" }}
//               >
//                 نعم
//               </button>
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 style={cancelButtonStyle}
//               >
//                 لا
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// // Styles
// const dashboardContainer = { display: "flex", flexDirection: "row-reverse", direction: "rtl" };
// const mainContent = { marginRight: "250px", padding: "30px", width: "calc(100% - 250px)" };
// const pageTitle = { textAlign: "right", fontSize: "30px", marginBottom: "20px" };
// const createButtonStyle = { backgroundColor: "#1EC8A0", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "5px", fontSize: "18px", cursor: "pointer" };
// const headerStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "15px", borderRadius: "12px", fontSize: "20px", textAlign: "right", width: "95%", marginBottom: "10px" };
// const rowStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", padding: "15px", borderRadius: "12px", marginBottom: "10px", width: "95%", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" };
// const examTitleStyle = { flex: 1, textAlign: "right", fontSize: "18px" };
// const circleStyle = { display: "inline-block", width: "30px", height: "30px", backgroundColor: "#1EC8A0", color: "#fff", borderRadius: "50%", textAlign: "center", lineHeight: "30px", fontSize: "16px", marginLeft: "15px" };
// const buttonContainerStyle = { display: "flex", gap: "10px", justifyContent: "center" };
// const editButtonStyle = { backgroundColor: "transparent", color: "#1EC8A0", border: "2px solid #1EC8A0", padding: "10px 15px", borderRadius: "7px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "18px" };
// const deleteButtonStyle = { backgroundColor: "transparent", color: "#dc3545", border: "2px solid #dc3545", padding: "10px 15px", borderRadius: "7px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "18px" };

// // Modal Styles
// const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" };
// const modalStyle = { backgroundColor: "#fff", padding: "30px", borderRadius: "12px", width: "450px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", position: "relative" };
// const closeButtonStyle = { position: "absolute", top: "10px", left: "10px", background: "none", border: "none", fontSize: "20px", cursor: "pointer" };
// const modalTitle = { marginBottom: "10px", fontSize: "22px" };
// const labelStyle = { display: "block", marginBottom: "5px", textAlign: "right" };
// const inputStyle = { width: "97%", padding: "10px", border: "1px solid #1EC8A0", borderRadius: "5px", marginBottom: "15px", textAlign: "right", fontSize: "16px" };
// const buttonContainer = { display: "flex", justifyContent: "space-between", marginTop: "15px" };
// const cancelButtonStyle = { backgroundColor: "#ccc", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", border: "none" };
// const addButtonStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", border: "none" };

// export default Exams;
/*********************************************************************** */
// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";
// import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const API_URL = 'http://localhost:8000/api/v1/teacher/';

// const Exams = () => {
//   const navigate = useNavigate();
//   const [exams, setExams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newExamTitle, setNewExamTitle] = useState("");
//   const [editingExamId, setEditingExamId] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [examToDelete, setExamToDelete] = useState(null);

//   const getApiInstance = () => {
//     const token = localStorage.getItem("access_token");
//     return axios.create({
//       baseURL: API_URL,
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//       },
//     });
//   };

//   const fetchExams = async () => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setError("❌ الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       const api = getApiInstance();
//       const response = await api.get('get_all_exams');
//       console.log("Exams response:", response.data); // Debug
//       setExams(response.data.data.data);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem("access_token");
//         setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }
//       setError(err.response?.data.message || '❌ حدث خطأ أثناء جلب الاختبارات');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExams();
//   }, [navigate]);

//   // Create new exam
//   const handleAddExam = async () => {
//     if (newExamTitle.trim() === "") {
//       setError("❌ يرجى إدخال عنوان الاختبار");
//       return;
//     }

//     try {
//       const api = getApiInstance();
//       const response = await api.post('create_exam', { title: newExamTitle });
//       console.log("Create exam response:", response.data); // Debug
//       await fetchExams();
//       closeModal();
//       setError(null);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem("access_token");
//         setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }
//       setError(err.response?.data.message || '❌ حدث خطأ أثناء إنشاء الاختبار');
//     }
//   };

//   // Delete an existing exam
//   const handleDelete = async (id) => {
//     try {
//       const api = getApiInstance();
//       const response = await api.delete(`delete_exam/${id}`);
//       console.log("Delete exam response:", response.data); // Debug
//       await fetchExams();
//       setError(null);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem("access_token");
//         setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }
//       setError(err.response?.data.message || '❌ حدث خطأ أثناء حذف الاختبار');
//     }
//   };

//   // Edit an existing exam
//   const handleEdit = (id, title) => {
//     setEditingExamId(id);
//     setNewExamTitle(title);
//     setIsModalOpen(true);
//   };

//   const handleUpdateExam = async () => {
//     if (newExamTitle.trim() === "") {
//       setError("❌ يرجى إدخال عنوان الاختبار");
//       return;
//     }

//     try {
//       const api = getApiInstance();
//       const response = await api.put(`update_exam/${editingExamId}`, {
//         title: newExamTitle,
//       });
//       console.log("Update exam response:", response.data); // Debug
//       await fetchExams();
//       closeModal();
//       setError(null);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem("access_token");
//         setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }
//       setError(err.response?.data.message || '❌ حدث خطأ أثناء تحديث الاختبار');
//     }
//   };

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setNewExamTitle("");
//     setEditingExamId(null);
//     setError(null);
//   };

//   // دالة جديدة للتنقل لصفحة تفاصيل الاختبار
//   const handleViewExam = (id) => {
//     navigate(`/exam/${id}`); // نتنقل لصفحة التفاصيل باستخدام الـ id
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={dashboardContainer}>
//         <Sidebar />
//         <div style={mainContent}>
//           <h1 style={pageTitle}>الاختبارات</h1>

//           {error && (
//             <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
//           )}

//           <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
//             <button style={createButtonStyle} onClick={openModal}>+ إنشاء</button>
//           </div>

//           {/* Exams list */}
//           {loading ? (
//             <div style={{ textAlign: 'center' }}>جاري التحميل...</div>
//           ) : (
//             <>
//               <h2 style={headerStyle}>قائمة الاختبارات</h2>
//               <div>
//                 {exams.length === 0 ? (
//                   <div style={{ textAlign: 'center', color: '#666' }}>
//                     لا توجد اختبارات حاليًا
//                   </div>
//                 ) : (
//                   exams.map((exam) => (
//                     // <div key={exam.id} style={rowStyle}>
//                     <div key={exam.id} style={rowStyle} onClick={() => navigate(`/exam/${exam.id}`)}>
//                       <span style={circleStyle}>{exam.id}</span>
//                       <span
//                         style={{ ...examTitleStyle, cursor: 'pointer', color: '#1EC8A0' }} // نضيف cursor ونغير اللون عشان يبقى واضح إنه قابل للضغط
//                         // onClick={() => handleViewExam(exam.id)} // لما يضغط على العنوان يروح لصفحة التفاصيل
//                       >
//                         {exam.title}
//                       </span>
//                       <div style={buttonContainerStyle}>
//                         <button
//                           style={editButtonStyle}
//                           onClick={() => handleEdit(exam.id, exam.title)}
//                         >
//                           <FaEdit /> تعديل
//                         </button>
//                         <button style={deleteButtonStyle} onClick={() => {
//                           setExamToDelete(exam.id);
//                           setShowDeleteConfirm(true);
//                         }}>
//                           <FaTrash /> حذف
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {isModalOpen && (
//         <div style={overlayStyle}>
//           <div style={modalStyle}>
//             <button onClick={closeModal} style={closeButtonStyle}>
//               <FaTimes />
//             </button>

//             <h2 style={modalTitle}>
//               {editingExamId ? 'تعديل الاختبار' : 'إنشاء اختبار'}
//             </h2>

//             <label style={labelStyle}>عنوان الاختبار</label>
//             <input
//               type="text"
//               value={newExamTitle}
//               onChange={(e) => setNewExamTitle(e.target.value)}
//               style={inputStyle}
//               placeholder="ادخل عنوان الاختبار"
//             />

//             <div style={buttonContainer}>
//               <button onClick={closeModal} style={cancelButtonStyle}>إلغاء</button>
//               <button
//                 onClick={editingExamId ? handleUpdateExam : handleAddExam}
//                 style={addButtonStyle}
//               >
//                 {editingExamId ? 'حفظ التعديلات' : 'إضافة اختبار +'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showDeleteConfirm && (
//         <div style={overlayStyle}>
//           <div style={modalStyle}>
//             <button onClick={() => setShowDeleteConfirm(false)} style={closeButtonStyle}>
//               <FaTimes />
//             </button>
//             <h2 style={modalTitle}>هل أنت متأكد أنك تريد حذف هذا الاختبار؟</h2>
//             <div style={buttonContainer}>
//               <button
//                 onClick={() => {
//                   handleDelete(examToDelete);
//                   setShowDeleteConfirm(false);
//                 }}
//                 style={{ ...addButtonStyle, backgroundColor: "#dc3545" }}
//               >
//                 نعم
//               </button>
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 style={cancelButtonStyle}
//               >
//                 لا
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// // Styles
// const dashboardContainer = { display: "flex", flexDirection: "row-reverse", direction: "rtl" };
// const mainContent = { marginRight: "250px", padding: "30px", width: "calc(100% - 250px)" };
// const pageTitle = { textAlign: "right", fontSize: "30px", marginBottom: "20px" };
// const createButtonStyle = { backgroundColor: "#1EC8A0", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "5px", fontSize: "18px", cursor: "pointer" };
// const headerStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "15px", borderRadius: "12px", fontSize: "20px", textAlign: "right", width: "95%", marginBottom: "10px" };
// const rowStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", padding: "15px", borderRadius: "12px", marginBottom: "10px", width: "95%", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" };
// const examTitleStyle = { flex: 1, textAlign: "right", fontSize: "18px" };
// const circleStyle = { display: "inline-block", width: "30px", height: "30px", backgroundColor: "#1EC8A0", color: "#fff", borderRadius: "50%", textAlign: "center", lineHeight: "30px", fontSize: "16px", marginLeft: "15px" };
// const buttonContainerStyle = { display: "flex", gap: "10px", justifyContent: "center" };
// const editButtonStyle = { backgroundColor: "transparent", color: "#1EC8A0", border: "2px solid #1EC8A0", padding: "10px 15px", borderRadius: "7px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "18px" };
// const deleteButtonStyle = { backgroundColor: "transparent", color: "#dc3545", border: "2px solid #dc3545", padding: "10px 15px", borderRadius: "7px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "18px" };

// // Modal Styles
// const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" };
// const modalStyle = { backgroundColor: "#fff", padding: "30px", borderRadius: "12px", width: "450px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", position: "relative" };
// const closeButtonStyle = { position: "absolute", top: "10px", left: "10px", background: "none", border: "none", fontSize: "20px", cursor: "pointer" };
// const modalTitle = { marginBottom: "10px", fontSize: "22px" };
// const labelStyle = { display: "block", marginBottom: "5px", textAlign: "right" };
// const inputStyle = { width: "97%", padding: "10px", border: "1px solid #1EC8A0", borderRadius: "5px", marginBottom: "15px", textAlign: "right", fontSize: "16px" };
// const buttonContainer = { display: "flex", justifyContent: "space-between", marginTop: "15px" };
// const cancelButtonStyle = { backgroundColor: "#ccc", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", border: "none" };
// const addButtonStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", border: "none" };

// export default Exams;

// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";
// import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
// import { useNavigate } from "react-router-dom"; 

// const API_URL = 'http://localhost:8000/api/v1/teacher/'; 

// const Exams = () => {
//   const navigate = useNavigate(); 
//   const [exams, setExams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newExamTitle, setNewExamTitle] = useState("");
//   const [editingExamId, setEditingExamId] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [examToDelete, setExamToDelete] = useState(null);

//   const getApiInstance = () => {
//     const token = localStorage.getItem("access_token");
//     return axios.create({
//       baseURL: API_URL,
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//       },
//     });
//   };

//   const fetchExams = async () => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setError("❌ الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       const api = getApiInstance();
//       const response = await api.get('get_all_exams');
//       console.log("Exams response:", response.data); // Debug
//       setExams(response.data.data.data); 
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem("access_token");
//         setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }
//       setError(err.response?.data.message || '❌ حدث خطأ أثناء جلب الاختبارات');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExams();
//   }, [navigate]);

//   // Create new exam
//   const handleAddExam = async () => {
//     if (newExamTitle.trim() === "") {
//       setError("❌ يرجى إدخال عنوان الاختبار");
//       return;
//     }

//     try {
//       const api = getApiInstance();
//       const response = await api.post('create_exam', { title: newExamTitle });
//       console.log("Create exam response:", response.data); // Debug
//       await fetchExams(); 
//       closeModal();
//       setError(null);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem("access_token");
//         setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }
//       setError(err.response?.data.message || '❌ حدث خطأ أثناء إنشاء الاختبار');
//     }
//   };

//   // Delete an existing exam
//   const handleDelete = async (id) => {
//     try {
//       const api = getApiInstance();
//       const response = await api.delete(`delete_exam/${id}`);
//       console.log("Delete exam response:", response.data); // Debug
//       await fetchExams(); 
//       setError(null);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem("access_token");
//         setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }
//       setError(err.response?.data.message || '❌ حدث خطأ أثناء حذف الاختبار');
//     }
//   };

//   // Edit an existing exam
//   const handleEdit = (id, title) => {
//     setEditingExamId(id);
//     setNewExamTitle(title);
//     setIsModalOpen(true);
//   };

//   const handleUpdateExam = async () => {
//     if (newExamTitle.trim() === "") {
//       setError("❌ يرجى إدخال عنوان الاختبار");
//       return;
//     }

//     try {
//       const api = getApiInstance();
//       const response = await api.put(`update_exam/${editingExamId}`, {
//         title: newExamTitle,
//       });
//       console.log("Update exam response:", response.data); // Debug
//       await fetchExams(); 
//       closeModal();
//       setError(null);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem("access_token");
//         setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }
//       setError(err.response?.data.message || '❌ حدث خطأ أثناء تحديث الاختبار');
//     }
//   };

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setNewExamTitle("");
//     setEditingExamId(null);
//     setError(null);
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={dashboardContainer}>
//         <Sidebar />
//         <div style={mainContent}>
//           <h1 style={pageTitle}>الاختبارات</h1>

//           {error && (
//             <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
//           )}

//           <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
//             <button style={createButtonStyle} onClick={openModal}>+ إنشاء</button>
//           </div>

//           {/* Exams list */}
//           {loading ? (
//             <div style={{ textAlign: 'center' }}>جاري التحميل...</div>
//           ) : (
//             <>
//               <h2 style={headerStyle}>قائمة الاختبارات</h2>
//               <div>
//                 {exams.length === 0 ? (
//                   <div style={{ textAlign: 'center', color: '#666' }}>
//                     لا توجد اختبارات حاليًا
//                   </div>
//                 ) : (
//                   exams.map((exam) => (
//                     <div key={exam.id} style={rowStyle}>
//                       <span style={circleStyle}>{exam.id}</span>
//                       <span style={examTitleStyle}>{exam.title}</span>
//                       <div style={buttonContainerStyle}>
//                         <button
//                           style={editButtonStyle}
//                           onClick={() => handleEdit(exam.id, exam.title)}
//                         >
//                           <FaEdit /> تعديل
//                         </button>
//                         <button style={deleteButtonStyle} onClick={() => {
//                           setExamToDelete(exam.id);
//                           setShowDeleteConfirm(true);
//                         }}>
//                           <FaTrash /> حذف
//                         </button>

//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {isModalOpen && (
//         <div style={overlayStyle}>
//           <div style={modalStyle}>
//             <button onClick={closeModal} style={closeButtonStyle}>
//               <FaTimes />
//             </button>

//             <h2 style={modalTitle}>
//               {editingExamId ? 'تعديل الاختبار' : 'إنشاء اختبار'}
//             </h2>

//             <label style={labelStyle}>عنوان الاختبار</label>
//             <input
//               type="text"
//               value={newExamTitle}
//               onChange={(e) => setNewExamTitle(e.target.value)}
//               style={inputStyle}
//               placeholder="ادخل عنوان الاختبار"
//             />

//             <div style={buttonContainer}>
//               <button onClick={closeModal} style={cancelButtonStyle}>إلغاء</button>
//               <button
//                 onClick={editingExamId ? handleUpdateExam : handleAddExam}
//                 style={addButtonStyle}
//               >
//                 {editingExamId ? 'حفظ التعديلات' : 'إضافة اختبار +'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showDeleteConfirm && (
//         <div style={overlayStyle}>
//           <div style={modalStyle}>
//             <button onClick={() => setShowDeleteConfirm(false)} style={closeButtonStyle}>
//               <FaTimes />
//             </button>
//             <h2 style={modalTitle}>هل أنت متأكد أنك تريد حذف هذا الاختبار؟</h2>
//             <div style={buttonContainer}>
//               <button
//                 onClick={() => {
//                   handleDelete(examToDelete);
//                   setShowDeleteConfirm(false);
//                 }}
//                 style={{ ...addButtonStyle, backgroundColor: "#dc3545" }}
//               >
//                 نعم
//               </button>
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 style={cancelButtonStyle}
//               >
//                 لا
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </>
//   );
// };

// // Styles
// const dashboardContainer = { display: "flex", flexDirection: "row-reverse", direction: "rtl" };
// const mainContent = { marginRight: "250px", padding: "30px", width: "calc(100% - 250px)" };
// const pageTitle = { textAlign: "right", fontSize: "30px", marginBottom: "20px" };
// const createButtonStyle = { backgroundColor: "#1EC8A0", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "5px", fontSize: "18px", cursor: "pointer" };
// const headerStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "15px", borderRadius: "12px", fontSize: "20px", textAlign: "right", width: "95%", marginBottom: "10px" };
// const rowStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", padding: "15px", borderRadius: "12px", marginBottom: "10px", width: "95%", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" };
// const examTitleStyle = { flex: 1, textAlign: "right", fontSize: "18px" };
// const circleStyle = { display: "inline-block", width: "30px", height: "30px", backgroundColor: "#1EC8A0", color: "#fff", borderRadius: "50%", textAlign: "center", lineHeight: "30px", fontSize: "16px", marginLeft: "15px" };
// const buttonContainerStyle = { display: "flex", gap: "10px", justifyContent: "center" };
// const editButtonStyle = { backgroundColor: "transparent", color: "#1EC8A0", border: "2px solid #1EC8A0", padding: "10px 15px", borderRadius: "7px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "18px" };
// const deleteButtonStyle = { backgroundColor: "transparent", color: "#dc3545", border: "2px solid #dc3545", padding: "10px 15px", borderRadius: "7px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "18px" };

// // Modal Styles
// const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" };
// const modalStyle = { backgroundColor: "#fff", padding: "30px", borderRadius: "12px", width: "450px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", position: "relative" };
// const closeButtonStyle = { position: "absolute", top: "10px", left: "10px", background: "none", border: "none", fontSize: "20px", cursor: "pointer" };
// const modalTitle = { marginBottom: "10px", fontSize: "22px" };
// const labelStyle = { display: "block", marginBottom: "5px", textAlign: "right" };
// const inputStyle = { width: "97%", padding: "10px", border: "1px solid #1EC8A0", borderRadius: "5px", marginBottom: "15px", textAlign: "right", fontSize: "16px" };
// const buttonContainer = { display: "flex", justifyContent: "space-between", marginTop: "15px" };
// const cancelButtonStyle = { backgroundColor: "#ccc", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", border: "none" };
// const addButtonStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", border: "none" };

// export default Exams;