// import React, { useState } from "react";

// const ExamModal = ({ isOpen, onClose, onAddExam }) => {
//   const [examTitle, setExamTitle] = useState("");

//   if (!isOpen) return null; // Hide modal when not open

//   const handleSubmit = () => {
//     if (examTitle.trim() === "") return; // Prevent adding empty titles
//     onAddExam(examTitle); // Add exam to list
//     setExamTitle(""); // Clear input field
//     onClose(); // Close modal
//   };

//   return (
//     <div style={overlayStyle}>
//       <div style={modalStyle}>
//         <h2 style={modalTitle}>إنشاء اختبار</h2>
//         <label style={labelStyle}>عنوان الاختبار</label>
//         <input
//           type="text"
//           value={examTitle}
//           onChange={(e) => setExamTitle(e.target.value)}
//           style={inputStyle}
//         />
//         <div style={buttonContainer}>
//           <button onClick={onClose} style={cancelButtonStyle}>إلغاء</button>
//           <button onClick={handleSubmit} style={addButtonStyle}>إضافة اختبار +</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Modal Styles
// const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" };
// const modalStyle = { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", width: "400px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" };
// const modalTitle = { marginBottom: "10px", fontSize: "22px" };
// const labelStyle = { display: "block", marginBottom: "5px", textAlign: "right" };
// const inputStyle = { width: "100%", padding: "10px", border: "1px solid #1EC8A0", borderRadius: "5px", marginBottom: "15px", textAlign: "right" };
// const buttonContainer = { display: "flex", justifyContent: "space-between" };
// const cancelButtonStyle = { backgroundColor: "#ccc", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", border: "none" };
// const addButtonStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", border: "none" };

// export default ExamModal;
