import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";
import { FaEdit, FaTrash, FaTimes, FaPlay } from "react-icons/fa";

const CourseDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "delete" or "edit"
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [editVideoTitle, setEditVideoTitle] = useState("");

  // جلب تفاصيل الكورس
  useEffect(() => {
    const fetchCourse = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("الرجاء تسجيل الدخول أولاً");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/v1/teacher/get_course/${id}`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token");
            setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
            setTimeout(() => {
              navigate("/login");
            }, 1000);
            return;
          }
          throw new Error("فشل في جلب تفاصيل الكورس");
        }

        const data = await response.json();
        console.log("Course data:", data); // Debug
        setCourse(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  // جلب الفيديوهات الخاصة بالكورس
  const fetchVideos = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("الرجاء تسجيل الدخول أولاً");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/teacher/get_videos/${id}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
          return;
        }
        throw new Error("فشل في جلب الفيديوهات");
      }

      const data = await response.json();
      console.log("Videos data:", data); // Debug
      setVideos(data.data?.data || []); 
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (course) {
      fetchVideos();
    }
  }, [course, navigate]);

  // حذف فيديو
  const handleDeleteVideo = async (videoId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("الرجاء تسجيل الدخول أولاً");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/teacher/delete_video/${videoId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
          return;
        }
        throw new Error("فشل في حذف الفيديو");
      }

      const data = await response.json();
      console.log("Delete video response:", data); // Debug
      setVideos(videos.filter((video) => video.id !== videoId));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // تعديل فيديو
  const handleUpdateVideo = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("الرجاء تسجيل الدخول أولاً");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    if (!editVideoTitle.trim()) {
      setError("يرجى إدخال عنوان للفيديو");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/teacher/update_video/${selectedVideoId}`, {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editVideoTitle }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
          return;
        }
        throw new Error("فشل في تعديل الفيديو");
      }

      const data = await response.json();
      console.log("Update video response:", data); // Debug
      setVideos(videos.map((video) =>
        video.id === selectedVideoId ? { ...video, title: editVideoTitle } : video
      ));
      setError(null);
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const openModal = (type, videoId, videoTitle) => {
    setModalType(type);
    setSelectedVideoId(videoId);
    if (type === "edit") {
      setEditVideoTitle(videoTitle);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVideoId(null);
    setModalType("");
    setEditVideoTitle("");
  };

  const confirmAction = () => {
    if (modalType === "delete") {
      handleDeleteVideo(selectedVideoId);
    } else if (modalType === "edit") {
      handleUpdateVideo();
    }
    closeModal();
  };

  return (
    <>
      <Navbar />
      <div style={dashboardContainer}>
        <Sidebar />
        <div style={mainContent}>
          <h1 style={pageTitle}>تفاصيل الدورة</h1>

          {loading && <p>جاري التحميل...</p>}
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          {course && !loading && !error && (
            <div style={courseDetailsContainer}>
              <h2 style={courseTitle}>{course.title}</h2>
              <p style={courseDescription}>{course.description}</p>
              <div style={buttonContainer}>
                <Link to={`/add-video/${id}`} style={addButtonStyle}>
                  + إضافة فيديو
                </Link>
                <Link to="/courses" style={backButtonStyle}>
                  العودة للدورات
                </Link>
              </div>

              <h3 style={sectionTitle}>الفيديوهات</h3>
              {videos.length === 0 ? (
                <p style={{ textAlign: "center", color: "#666" }}>لا توجد فيديوهات حاليًا</p>
              ) : (
                <div style={tableContainerStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr style={tableHeaderRowStyle}>
                        <th style={tableHeaderCellStyle}>العنوان</th>
                        <th style={tableHeaderCellStyle}>تشغيل</th>
                        <th style={tableHeaderCellStyle}>تعديل</th>
                        <th style={tableHeaderCellStyle}>حذف</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videos.map((video) => (
                        <tr key={video.id} style={tableRowStyle}>
                          <td style={tableCellStyle}>{video.title}</td>
                          <td style={tableCellStyle}>
                            <a
                              href={`http://localhost:8000/${video.video_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={playButtonStyle}
                            >
                              <FaPlay /> تشغيل
                            </a>
                          </td>
                          <td style={tableCellStyle}>
                            <button
                              style={editButtonStyle}
                              onClick={() => openModal("edit", video.id, video.title)}
                            >
                              <FaEdit /> تعديل
                            </button>
                          </td>
                          <td style={tableCellStyle}>
                            <button
                              style={deleteButtonStyle}
                              onClick={() => openModal("delete", video.id)}
                            >
                              <FaTrash /> حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {showModal && (
            <div style={modalOverlayStyle}>
              <div style={modalStyle}>
                {modalType === "delete" ? (
                  <>
                    <p style={{ fontSize: "18px", marginBottom: "20px" }}>
                      هل أنت متأكد أنك تريد حذف الفيديو؟
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                      <button onClick={confirmAction} style={yesButtonStyle}>
                        نعم
                      </button>
                      <button onClick={closeModal} style={noButtonStyle}>
                        لا
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button style={closeButtonStyle} onClick={closeModal}>
                      <FaTimes />
                    </button>
                    <h2 style={modalTitleStyle}>تعديل عنوان الفيديو</h2>
                    <input
                      type="text"
                      value={editVideoTitle}
                      onChange={(e) => setEditVideoTitle(e.target.value)}
                      style={inputStyle}
                      placeholder="أدخل العنوان الجديد..."
                    />
                    <div style={modalButtonContainerStyle}>
                      <button onClick={confirmAction} style={submitButtonStyle}>
                        تعديل
                      </button>
                      <button onClick={closeModal} style={cancelButtonStyle}>
                        إلغاء
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const dashboardContainer = { display: "flex", flexDirection: "row-reverse", direction: "rtl" };
const mainContent = { marginRight: "220px", padding: "20px", width: "100%", boxSizing: "border-box" };
const pageTitle = { textAlign: "right", fontSize: "30px", marginBottom: "20px" };
const courseDetailsContainer = { backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" };
const courseTitle = { fontSize: "24px", textAlign: "right", marginBottom: "10px" };
const courseDescription = { fontSize: "16px", textAlign: "right", color: "#666", marginBottom: "20px" };
const sectionTitle = { fontSize: "20px", textAlign: "right", margin: "20px 0 10px" };
const buttonContainer = { display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" };
const addButtonStyle = {
  backgroundColor: "#1EC8A0",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  fontSize: "18px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
};
const backButtonStyle = {
  backgroundColor: "#ccc",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  fontSize: "18px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
};
const tableContainerStyle = { width: "100%", overflowX: "auto", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", padding: "15px" };
const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "right" };
const tableHeaderRowStyle = { backgroundColor: "#f8f9fa" };
const tableHeaderCellStyle = { padding: "12px", textAlign: "right", fontWeight: "bold", borderBottom: "2px solid #ddd" };
const tableRowStyle = { borderBottom: "1px solid #ddd" };
const tableCellStyle = { padding: "12px" };
const playButtonStyle = {
  backgroundColor: "#1EC8A0",
  color: "#fff",
  border: "none",
  padding: "7px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "16px",
  textDecoration: "none",
};
const editButtonStyle = {
  backgroundColor: "transparent",
  color: "#1EC8A0",
  border: "2px solid #1EC8A0",
  padding: "7px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "16px",
};
const deleteButtonStyle = {
  backgroundColor: "transparent",
  color: "#dc3545",
  border: "2px solid #dc3545",
  padding: "7px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "16px",
};
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};
const modalStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
  textAlign: "center",
  minWidth: "300px",
};
const yesButtonStyle = {
  backgroundColor: "#1EC8A0",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
};
const noButtonStyle = {
  backgroundColor: "#ccc",
  color: "#000",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
};
const closeButtonStyle = { background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", float: "left" };
const modalTitleStyle = { textAlign: "right", fontSize: "22px", marginBottom: "10px" };
const inputStyle = { width: "100%", padding: "10px", border: "1px solid #1EC8A0", borderRadius: "5px", textAlign: "right", fontSize: "16px", marginBottom: "15px" };
const modalButtonContainerStyle = { display: "flex", justifyContent: "space-between", marginTop: "10px" };
const submitButtonStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "10px", borderRadius: "5px", border: "none", cursor: "pointer" };
const cancelButtonStyle = { backgroundColor: "#ccc", color: "#fff", padding: "10px", borderRadius: "5px", border: "none", cursor: "pointer" };

export default CourseDetails;