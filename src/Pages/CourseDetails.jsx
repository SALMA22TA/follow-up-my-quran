import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import Sidebar from "../Components/Sidebar"
import Navbar from "../Components/DashboardNavbar"
import { FaEdit, FaTrash, FaTimes, FaPlay, FaVideo, FaPlus, FaArrowLeft } from "react-icons/fa"

const CourseDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("") // "delete" or "edit"
  const [selectedVideoId, setSelectedVideoId] = useState(null)
  const [editVideoTitle, setEditVideoTitle] = useState("")

  useEffect(() => {
    const fetchCourse = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) {
        setError("الرجاء تسجيل الدخول أولاً")
        setTimeout(() => {
          navigate("/login")
        }, 1000)
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8000/api/v1/teacher/get_course/${id}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token")
            setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.")
            setTimeout(() => {
              navigate("/login")
            }, 1000)
            return
          }
          throw new Error("فشل في جلب تفاصيل الكورس")
        }

        const data = await response.json()
        console.log("Course data:", data) // Debug
        setCourse(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id, navigate])

  const fetchVideos = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      setError("الرجاء تسجيل الدخول أولاً")
      setTimeout(() => {
        navigate("/login")
      }, 1000)
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/teacher/get_videos/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token")
          setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.")
          setTimeout(() => {
            navigate("/login")
          }, 1000)
          return
        }
        throw new Error("فشل في جلب الفيديوهات")
      }

      const data = await response.json()
      console.log("Videos data:", data) // Debug
      setVideos(data.data?.data || [])
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (course) {
      fetchVideos()
    }
  }, [course, navigate])

  // حذف فيديو
  const handleDeleteVideo = async (videoId) => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      setError("الرجاء تسجيل الدخول أولاً")
      setTimeout(() => {
        navigate("/login")
      }, 1000)
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/teacher/delete_video/${videoId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token")
          setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.")
          setTimeout(() => {
            navigate("/login")
          }, 1000)
          return
        }
        throw new Error("فشل في حذف الفيديو")
      }

      const data = await response.json()
      console.log("Delete video response:", data) // Debug

      setVideos(videos.filter((video) => video.id !== videoId))
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  // تعديل فيديو
  const handleUpdateVideo = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      setError("الرجاء تسجيل الدخول أولاً")
      setTimeout(() => {
        navigate("/login")
      }, 1000)
      return
    }

    if (!editVideoTitle.trim()) {
      setError("يرجى إدخال عنوان للفيديو")
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/teacher/update_video/${selectedVideoId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editVideoTitle }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token")
          setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.")
          setTimeout(() => {
            navigate("/login")
          }, 1000)
          return
        }
        throw new Error("فشل في تعديل الفيديو")
      }

      const data = await response.json()
      console.log("Update video response:", data) // Debug
      setVideos(videos.map((video) => (video.id === selectedVideoId ? { ...video, title: editVideoTitle } : video)))
      setError(null)
      closeModal()
    } catch (err) {
      setError(err.message)
    }
  }

  const openModal = (type, videoId, videoTitle) => {
    setModalType(type)
    setSelectedVideoId(videoId)
    if (type === "edit") {
      setEditVideoTitle(videoTitle)
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedVideoId(null)
    setModalType("")
    setEditVideoTitle("")
  }

  const confirmAction = () => {
    if (modalType === "delete") {
      handleDeleteVideo(selectedVideoId)
    } else if (modalType === "edit") {
      handleUpdateVideo()
    }
    closeModal()
  }

  // Styles
  const dashboardContainerStyle = {
    display: "flex",
    flexDirection: "row-reverse",
    direction: "rtl",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f5f9f8",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  }

  const mainContentStyle = {
    padding: "20px",
    width: "100%",
    boxSizing: "border-box",
    marginRight: "220px",
  }

  const pageTitleStyle = {
    textAlign: "right",
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#20c997",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "right",
    marginRight:"20px",
    gap: "12px",
  }

  const loadingStyle = {
    textAlign: "center",
    padding: "60px 20px",
    fontSize: "1.25rem",
    fontWeight: "500",
    color: "#20c997",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  }

  const errorStyle = {
    color: "#e53e3e",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#fed7d7",
    border: "1px solid #feb2b2",
    borderRadius: "12px",
    marginBottom: "24px",
    fontWeight: "500",
  }

  const courseDetailsContainerStyle = {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(32, 201, 151, 0.15)",
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    border: "1px solid #e0f0ed",
  }

  const courseImageStyle = {
    width: "100%",
    maxWidth: "800px",
    height: "250px",
    borderRadius: "16px",
    marginBottom: "20px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    objectFit: "cover",
    border: "3px solid #e0f0ed",
    boxShadow: "0 8px 20px rgba(32, 201, 151, 0.1)",
  }

  const courseTitleStyle = {
    fontSize: "1.5rem",
    textAlign: "right",
    marginBottom: "12px",
    color: "#333",
    fontWeight: "700",
    lineHeight: "1.4",
  }

  const courseDescriptionStyle = {
    fontSize: "1rem",
    textAlign: "right",
    color: "#666",
    marginBottom: "20px",
    lineHeight: "1.8",
    padding: "16px",
    backgroundColor: "#f9fffd",
    borderRadius: "12px",
    border: "1px solid #e0f0ed",
  }

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  }

  const addButtonStyle = {
    backgroundColor: "#20c997",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(32, 201, 151, 0.3)",
  }

  const addButtonHoverStyle = {
    backgroundColor: "#1db386",
    // transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(32, 201, 151, 0.4)",
  }

  const backButtonStyle = {
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    transition: "all 0.3s ease",
  }

  const backButtonHoverStyle = {
    backgroundColor: "#4b5563",
    // transform: "translateY(-2px)",
  }

  const sectionTitleStyle = {
    fontSize: "1.4rem",
    textAlign: "right",
    margin: "24px 0 16px",
    color: "#20c997",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "12px",
  }

  const noVideosStyle = {
    textAlign: "center",
    color: "#666",
    fontSize: "1.125rem",
    padding: "60px 20px",
    backgroundColor: "#f9fffd",
    borderRadius: "16px",
    border: "2px dashed #c8e8e0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  }

  const tableContainerStyle = {
    width: "100%",
    overflowX: "auto",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(32, 201, 151, 0.1)",
    border: "1px solid #e0f0ed",
  }

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "right",
    minWidth: "700px",
  }

  const tableHeaderRowStyle = {
    background: "linear-gradient(135deg, #20c997, #1db386)",
  }

  const tableHeaderCellStyle = {
    padding: "12px 16px",
    textAlign: "right",
    fontWeight: "700",
    color: "white",
    fontSize: "1rem",
    borderBottom: "none",
  }

  const tableRowStyle = {
    borderBottom: "1px solid #e0f0ed",
    transition: "background-color 0.3s ease",
  }

  const tableRowHoverStyle = {
    backgroundColor: "#f9fffd",
  }

  const tableCellStyle = {
    padding: "12px 16px",
    fontSize: "1rem",
    color: "#333",
    verticalAlign: "middle",
  }

  const actionButtonBaseStyle = {
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.9375rem",
    fontWeight: "600",
    textDecoration: "none",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  }

  const playButtonStyle = {
    ...actionButtonBaseStyle,
    backgroundColor: "#20c997",
    color: "white",
  }

  const playButtonHoverStyle = {
    backgroundColor: "#1db386",
    // transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(32, 201, 151, 0.3)",
  }

  const editButtonStyle = {
    ...actionButtonBaseStyle,
    backgroundColor: "transparent",
    color: "#20c997",
    border: "2px solid #20c997",
  }

  const editButtonHoverStyle = {
    backgroundColor: "#20c997",
    color: "white",
    // transform: "translateY(-1px)",
  }

  const deleteButtonStyle = {
    ...actionButtonBaseStyle,
    backgroundColor: "transparent",
    color: "#dc3545",
    border: "2px solid #dc3545",
  }

  const deleteButtonHoverStyle = {
    backgroundColor: "#dc3545",
    color: "white",
    // transform: "translateY(-1px)",
  }

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  }

  const modalStyle = {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    width: "90%",
    maxWidth: "400px",
    position: "relative",
    border: "1px solid #e0f0ed",
  }

  const closeButtonStyle = {
    background: "transparent",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    position: "absolute",
    top: "16px",
    left: "16px",
    color: "#666",
    padding: "8px",
    borderRadius: "50%",
    transition: "all 0.3s ease",
  }

  const closeButtonHoverStyle = {
    backgroundColor: "#f1f1f1",
    color: "#333",
  }

  const modalTitleStyle = {
    textAlign: "right",
    fontSize: "1.5rem",
    marginBottom: "24px",
    color: "#20c997",
    fontWeight: "700",
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #e0f0ed",
    borderRadius: "12px",
    textAlign: "right",
    fontSize: "1rem",
    marginBottom: "24px",
    backgroundColor: "#f9fffd",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  }

  const inputFocusStyle = {
    outline: "none",
    borderColor: "#20c997",
    boxShadow: "0 0 0 3px rgba(32, 201, 151, 0.2)",
    backgroundColor: "white",
  }

  const modalButtonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginTop: "24px",
  }

  const confirmButtonStyle = {
    backgroundColor: "#20c997",
    color: "white",
    padding: "10px 16px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    flex: 1,
    transition: "all 0.3s ease",
  }

  const confirmButtonHoverStyle = {
    backgroundColor: "#1db386",
    // transform: "translateY(-1px)",
  }

  const cancelButtonStyle = {
    backgroundColor: "#6b7280",
    color: "white",
    padding: "10px 16px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    flex: 1,
    transition: "all 0.3s ease",
  }

  const cancelButtonHoverStyle = {
    backgroundColor: "#4b5563",
    // transform: "translateY(-1px)",
  }

  const deleteConfirmStyle = {
    fontSize: "1.25rem",
    marginBottom: "32px",
    color: "#333",
    lineHeight: "1.6",
  }

  const spinnerStyle = {
    width: "24px",
    height: "24px",
    border: "3px solid #c6f6d5",
    borderTop: "3px solid #20c997",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  }

  return (
    <>
      <Navbar />
      <div style={dashboardContainerStyle}>
        <Sidebar />
        <div style={mainContentStyle}>
          <h1 style={pageTitleStyle}>
            <FaVideo />
            تفاصيل الدورة
          </h1>

          {loading && (
            <div style={loadingStyle}>
              <div style={spinnerStyle}></div>
              جاري التحميل...
            </div>
          )}

          {error && <div style={errorStyle}>{error}</div>}

          {course && !loading && !error && (
            <div style={courseDetailsContainerStyle}>
              {course.cover_image && (
                <img src={`http://localhost:8000${course.cover_image}`} alt={course.title} style={courseImageStyle} />
              )}

              <h2 style={courseTitleStyle}>{course.title}</h2>
              <p style={courseDescriptionStyle}>{course.description}</p>

              <div style={buttonContainerStyle}>
                <Link
                  to={`/add-video/${id}`}
                  style={addButtonStyle}
                  onMouseEnter={(e) => Object.assign(e.target.style, addButtonHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.target.style, addButtonStyle)}
                >
                  <FaPlus />
                  إضافة فيديو
                </Link>
                <Link
                  to="/courses"
                  style={backButtonStyle}
                  onMouseEnter={(e) => Object.assign(e.target.style, backButtonHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.target.style, backButtonStyle)}
                >
                  <FaArrowLeft />
                  العودة للدورات
                </Link>
              </div>

              <h3 style={sectionTitleStyle}>
                <FaVideo />
                الفيديوهات ({videos.length})
              </h3>

              {videos.length === 0 ? (
                <div style={noVideosStyle}>
                  <FaVideo size={48} color="#c8e8e0" />
                  <span>لا توجد فيديوهات حاليًا</span>
                  <span style={{ fontSize: "0.9375rem", color: "#999" }}>ابدأ بإضافة أول فيديو لهذه الدورة</span>
                </div>
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
                        <tr
                          key={video.id}
                          style={tableRowStyle}
                          onMouseEnter={(e) => Object.assign(e.currentTarget.style, tableRowHoverStyle)}
                          onMouseLeave={(e) => Object.assign(e.currentTarget.style, tableRowStyle)}
                        >
                          <td style={tableCellStyle}>
                            <div
                              style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "right" }}
                            >
                              <FaVideo color="#20c997" />
                              <span>{video.title}</span>
                            
                            </div>
                          </td>
                          <td style={tableCellStyle}>
                            <a
                              href={`http://localhost:8000/${video.video_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={playButtonStyle}
                              onMouseEnter={(e) => Object.assign(e.target.style, playButtonHoverStyle)}
                              onMouseLeave={(e) => Object.assign(e.target.style, playButtonStyle)}
                            >
                              <FaPlay />
                              تشغيل
                            </a>
                          </td>
                          <td style={tableCellStyle}>
                            <button
                              style={editButtonStyle}
                              onClick={() => openModal("edit", video.id, video.title)}
                              onMouseEnter={(e) => Object.assign(e.target.style, editButtonHoverStyle)}
                              onMouseLeave={(e) => Object.assign(e.target.style, editButtonStyle)}
                            >
                              <FaEdit />
                              تعديل
                            </button>
                          </td>
                          <td style={tableCellStyle}>
                            <button
                              style={deleteButtonStyle}
                              onClick={() => openModal("delete", video.id)}
                              onMouseEnter={(e) => Object.assign(e.target.style, deleteButtonHoverStyle)}
                              onMouseLeave={(e) => Object.assign(e.target.style, deleteButtonStyle)}
                            >
                              <FaTrash />
                              حذف
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
                    <p style={deleteConfirmStyle}>هل أنت متأكد أنك تريد حذف الفيديو؟</p>
                    <div style={modalButtonContainerStyle}>
                      <button
                        onClick={confirmAction}
                        style={confirmButtonStyle}
                        onMouseEnter={(e) => Object.assign(e.target.style, confirmButtonHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, confirmButtonStyle)}
                      >
                        نعم، احذف
                      </button>
                      <button
                        onClick={closeModal}
                        style={cancelButtonStyle}
                        onMouseEnter={(e) => Object.assign(e.target.style, cancelButtonHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, cancelButtonStyle)}
                      >
                        إلغاء
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      style={closeButtonStyle}
                      onClick={closeModal}
                      onMouseEnter={(e) => Object.assign(e.target.style, closeButtonHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.target.style, closeButtonStyle)}
                    >
                      <FaTimes />
                    </button>
                    <h2 style={modalTitleStyle}>تعديل عنوان الفيديو</h2>
                    <input
                      type="text"
                      value={editVideoTitle}
                      onChange={(e) => setEditVideoTitle(e.target.value)}
                      style={inputStyle}
                      placeholder="أدخل العنوان الجديد..."
                      onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                      onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                    />
                    <div style={modalButtonContainerStyle}>
                      <button
                        onClick={confirmAction}
                        style={confirmButtonStyle}
                        onMouseEnter={(e) => Object.assign(e.target.style, confirmButtonHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, confirmButtonStyle)}
                      >
                        حفظ التعديل
                      </button>
                      <button
                        onClick={closeModal}
                        style={cancelButtonStyle}
                        onMouseEnter={(e) => Object.assign(e.target.style, cancelButtonHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.target.style, cancelButtonStyle)}
                      >
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

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  )
}

export default CourseDetails/********************************************************************************************* */
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";
// import { FaEdit, FaTrash, FaTimes, FaPlay } from "react-icons/fa";

// const CourseDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState(""); // "delete" or "edit"
//   const [selectedVideoId, setSelectedVideoId] = useState(null);
//   const [editVideoTitle, setEditVideoTitle] = useState("");

//   useEffect(() => {
//     const fetchCourse = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
        
//         setError("الرجاء تسجيل الدخول أولاً");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await fetch(`http://localhost:8000/api/v1/teacher/get_course/${id}`, {
//           method: "GET",
//           headers: {
//             "Accept": "application/json",
//             "Authorization": `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             localStorage.removeItem("access_token");
            
//             setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//             setTimeout(() => {
//               navigate("/login");
//             }, 1000);
//             return;
//           }
//           throw new Error("فشل في جلب تفاصيل الكورس");
//         }

//         const data = await response.json();
//         console.log("Course data:", data); // Debug
//         setCourse(data.data);
//       } catch (err) {
        
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourse();
//   }, [id, navigate]);

//   const fetchVideos = async () => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
      
//       setError("الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/teacher/get_videos/${id}`, {
//         method: "GET",
//         headers: {
//           "Accept": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token");
          
//           setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
//         throw new Error("فشل في جلب الفيديوهات");
//       }

//       const data = await response.json();
//       console.log("Videos data:", data); // Debug
//       setVideos(data.data?.data || []);
//     } catch (err) {
      
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     if (course) {
//       fetchVideos();
//     }
//   }, [course, navigate]);

//   // حذف فيديو
  
//   const handleDeleteVideo = async (videoId) => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
      
//       setError("الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/teacher/delete_video/${videoId}`, {
//         method: "DELETE",
//         headers: {
//           "Accept": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token");
          
//           setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
//         throw new Error("فشل في حذف الفيديو");
//       }

//       const data = await response.json();
//       console.log("Delete video response:", data); // Debug
      
//       setVideos(videos.filter((video) => video.id !== videoId));
//       setError(null);
//     } catch (err) {
      
//       setError(err.message);
//     }
//   };

//   // تعديل فيديو
//   const handleUpdateVideo = async () => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
      
//       setError("الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       return;
//     }

//     if (!editVideoTitle.trim()) {
      
//       setError("يرجى إدخال عنوان للفيديو");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/teacher/update_video/${selectedVideoId}`, {
//         method: "PUT",
//         headers: {
//           "Accept": "application/json",
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ title: editVideoTitle }),
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token");
          
//           setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
//         throw new Error("فشل في تعديل الفيديو");
//       }

//       const data = await response.json();
//       console.log("Update video response:", data); // Debug
//       setVideos(
        
//         videos.map((video) => video.id === selectedVideoId ? { ...video, title: editVideoTitle } : video
//         )
//       );
//       setError(null);
//       closeModal();
//     } catch (err) {
      
//       setError(err.message);
//     }
//   };

  
//   const openModal = (type, videoId, videoTitle) => {
//     setModalType(type);
//     setSelectedVideoId(videoId);
//     if (type === "edit") {
//       setEditVideoTitle(videoTitle);
//     }
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedVideoId(null);
//     setModalType("");
//     setEditVideoTitle("");
//   };

//   const confirmAction = () => {
//     if (modalType === "delete") {
//       handleDeleteVideo(selectedVideoId);
//     } else if (modalType === "edit") {
//       handleUpdateVideo();
//     }
//     closeModal();
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={dashboardContainer}>
//         <Sidebar />
//         <div style={mainContent}>
//           <h1 style={pageTitle}>تفاصيل الدورة</h1>

//           {loading && <p>جاري التحميل...</p>}
//           {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

//           {course && !loading && !error && (
//             <div style={courseDetailsContainer}>
//               {course.cover_image && (
//                 <img
//                 src={`http://localhost:8000${course.cover_image}`}
//                 alt={course.title}
//                 style={courseImageStyle}
//                 />
//               )}
//               <h2 style={courseTitle}>{course.title}</h2>
//               <p style={courseDescription}>{course.description}</p>
//               <div style={buttonContainer}>
//                 <Link to={`/add-video/${id}`} style={addButtonStyle}>
//                   + إضافة فيديو
//                 </Link>
//                 <Link to="/courses" style={backButtonStyle}>
//                   العودة للدورات
//                 </Link>
//               </div>

//               <h3 style={sectionTitle}>الفيديوهات</h3>
//               {videos.length === 0 ? (
//                 <p style={{ textAlign: "center", color: "#666" }}>لا توجد فيديوهات حاليًا</p>
//               ) : (
//                 <div 

//                 style={tableContainerStyle}>
//                   <table 

//                   style={tableStyle}>
//                     <thead>
//                       <tr style={tableHeaderRowStyle}>
//                         <th 

//                         style={tableHeaderCellStyle}>العنوان</th>
//                         <th 

//                         style={tableHeaderCellStyle}>تشغيل</th>
//                         <th 

//                         style={tableHeaderCellStyle}>تعديل</th>
//                         <th 

//                         style={tableHeaderCellStyle}>حذف</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {videos.map((video) => (
//                         <tr key={video.id} style={tableRowStyle}>
//                           <td style={tableCellStyle}>{video.title}</td>
//                           <td style={tableCellStyle}>
//                             <a
                              
//                               href={`http://localhost:8000/${video.video_path}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               style={playButtonStyle}
//                             >
//                               <FaPlay /> تشغيل
//                             </a>
//                           </td>
//                           <td style={tableCellStyle}>
//                             <button
//                               style={editButtonStyle}
                              
//                               onClick={() => openModal("edit", video.id, video.title)}
//                             >
//                               <FaEdit /> تعديل
//                             </button>
//                           </td>
//                           <td style={tableCellStyle}>
//                             <button
//                               style={deleteButtonStyle}
                              
//                               onClick={() => openModal("delete", video.id)}
//                             >
//                               <FaTrash /> حذف
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//           {showModal && (
//             <div 

//             style={modalOverlayStyle}>
//               <div 

//               style={modalStyle}>
//                 {modalType === "delete" ? (
//                   <>
//                     <p style={{ fontSize: "18px", marginBottom: "20px" }}>
//                       هل أنت متأكد أنك تريد حذف الفيديو؟
//                     </p>
//                     <div style={{ display: "flex", justifyContent: "space-around" }}>
//                       <button onClick={confirmAction} style={yesButtonStyle}>
//                         نعم
//                       </button>
//                       <button onClick={closeModal} style={noButtonStyle}>
//                         لا
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <button 

//                     style={closeButtonStyle} onClick={closeModal}>
//                       <FaTimes />
//                     </button>
//                     <h2 

//                     style={modalTitleStyle}>تعديل عنوان الفيديو</h2>
//                     <input
//                       type="text"
//                       value={editVideoTitle}
//                       onChange={(e) => setEditVideoTitle(e.target.value)}
                      
//                       style={inputStyle}
//                       placeholder="أدخل العنوان الجديد..."
//                     />
//                     <div style={modalButtonContainerStyle}>
//                       <button onClick={confirmAction} style={submitButtonStyle}>
//                         تعديل
//                       </button>
//                       <button onClick={closeModal} style={cancelButtonStyle}>
//                         إلغاء
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// const dashboardContainer = {
//   display: "flex",
//   flexDirection: "row-reverse",
//   direction: "rtl",
//   width: "100%",
//   minHeight: "100vh",
// };

// const mainContent = {
//   padding: "20px",
//   width: "100%",
//   boxSizing: "border-box",
//   marginRight: "220px",
//   "@media (max-width: 768px)": {
//     marginRight: "0",
//   },
// };

// const pageTitle = {
//   textAlign: "right",
//   fontSize: "1.8rem",
//   marginBottom: "20px",
//   "@media (max-width: 768px)": {
//     fontSize: "1.5rem",
//   },
// };

// const courseDetailsContainer = {
//   backgroundColor: "#fff",
//   padding: "20px",
//   borderRadius: "10px",
//   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//   width: "100%",
//   maxWidth: "1200px",
//   margin: "0 auto",
// };

// const courseImageStyle = {
//   width: "100%", 
//   maxWidth: "1000px", 
//   height: "300px", 
//   borderRadius: "10px",
//   marginBottom: "20px", 
//   display: "block",
//   marginLeft: "auto",
//   marginRight: "auto",
//   "@media (max-width: 768px)": {
//     maxWidth: "100%", // Ensures the image doesn't overflow on smaller screens
//     width: "100%", // Takes full width on smaller screens
//   },
// };

// const courseTitle = {
//   fontSize: "1.5rem",
//   textAlign: "right",
//   marginBottom: "10px",
//   "@media (max-width: 768px)": {
//     fontSize: "1.2rem",
//   },
// };

// const courseDescription = {
//   fontSize: "1rem",
//   textAlign: "right",
//   color: "#666",
//   marginBottom: "20px",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//   },
// };

// const sectionTitle = {
//   fontSize: "1.25rem",
//   textAlign: "right",
//   margin: "20px 0 10px",
//   "@media (max-width: 768px)": {
//     fontSize: "1.1rem",
//   },
// };

// const buttonContainer = {
//   display: "flex",
//   justifyContent: "flex-end",
//   gap: "10px",
//   marginBottom: "20px",
//   flexWrap: "wrap",
// };

// const addButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "10px 15px",
//   borderRadius: "5px",
//   fontSize: "1rem",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   textDecoration: "none",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "8px 12px",
//   },
// };

// const backButtonStyle = {
//   backgroundColor: "#ccc",
//   color: "#fff",
//   border: "none",
//   padding: "10px 15px",
//   borderRadius: "5px",
//   fontSize: "1rem",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   textDecoration: "none",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "8px 12px",
//   },
// };

// const tableContainerStyle = {
//   width: "100%",
//   overflowX: "auto",
//   backgroundColor: "#fff",
//   borderRadius: "10px",
//   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//   padding: "15px",
// };

// const tableStyle = {
//   width: "100%",
//   borderCollapse: "collapse",
//   textAlign: "right",
//   minWidth: "600px",
// };

// const tableHeaderRowStyle = {
//   backgroundColor: "#f8f9fa",
// };

// const tableHeaderCellStyle = {
//   padding: "12px",
//   textAlign: "right",
//   fontWeight: "bold",
//   borderBottom: "2px solid #ddd",
//   "@media (max-width: 768px)": {
//     padding: "8px",
//     fontSize: "0.9rem",
//   },
// };

// const tableRowStyle = {
//   borderBottom: "1px solid #ddd",
// };

// const tableCellStyle = {
//   padding: "12px",
//   "@media (max-width: 768px)": {
//     padding: "8px",
//     fontSize: "0.9rem",
//   },
// };

// const playButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "7px 15px",
//   borderRadius: "5px",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   gap: "5px",
//   fontSize: "1rem",
//   textDecoration: "none",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "6px 12px",
//   },
// };

// const editButtonStyle = {
//   backgroundColor: "transparent",
//   color: "#1EC8A0",
//   border: "2px solid #1EC8A0",
//   padding: "7px 15px",
//   borderRadius: "5px",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   gap: "5px",
//   fontSize: "1rem",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "6px 12px",
//   },
// };

// const deleteButtonStyle = {
//   backgroundColor: "transparent",
//   color: "#dc3545",
//   border: "2px solid #dc3545",
//   padding: "7px 15px",
//   borderRadius: "5px",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   gap: "5px",
//   fontSize: "1rem",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "6px 12px",
//   },
// };

// const modalOverlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100vw",
//   height: "100vh",
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 1000,
// };

// const modalStyle = {
//   backgroundColor: "#fff",
//   padding: "20px",
//   borderRadius: "10px",
//   boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
//   textAlign: "center",
//   width: "90%",
//   maxWidth: "400px",
//   "@media (max-width: 768px)": {
//     padding: "15px",
//     maxWidth: "90%",
//   },
// };

// const yesButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "10px 20px",
//   borderRadius: "5px",
//   fontWeight: "bold",
//   cursor: "pointer",
//   "@media (max-width: 768px)": {
//     padding: "8px 15px",
//     fontSize: "0.9rem",
//   },
// };

// const noButtonStyle = {
//   backgroundColor: "#ccc",
//   color: "#000",
//   border: "none",
//   padding: "10px 20px",
//   borderRadius: "5px",
//   fontWeight: "bold",
//   cursor: "pointer",
//   "@media (max-width: 768px)": {
//     padding: "8px 15px",
//     fontSize: "0.9rem",
//   },
// };

// const closeButtonStyle = {
//   background: "transparent",
//   border: "none",
//   fontSize: "1.2rem",
//   cursor: "pointer",
//   float: "left",
//   "@media (max-width: 768px)": {
//     fontSize: "1rem",
//   },
// };

// const modalTitleStyle = {
//   textAlign: "right",
//   fontSize: "1.4rem",
//   marginBottom: "10px",
//   "@media (max-width: 768px)": {
//     fontSize: "1.2rem",
//   },
// };

// const inputStyle = {
//   width: "100%",
//   padding: "10px",
//   border: "1px solid #1EC8A0",
//   borderRadius: "5px",
//   textAlign: "right",
//   fontSize: "1rem",
//   marginBottom: "15px",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "8px",
//   },
// };

// const modalButtonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "10px",
//   "@media (max-width: 768px)": {
//     flexDirection: "column",
//     gap: "10px",
//   },
// };

// const submitButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   padding: "10px",
//   borderRadius: "5px",
//   border: "none",
//   cursor: "pointer",
//   "@media (max-width: 768px)": {
//     padding: "8px",
//     fontSize: "0.9rem",
//   },
// };

// const cancelButtonStyle = {
//   backgroundColor: "#ccc",
//   color: "#fff",
//   padding: "10px",
//   borderRadius: "5px",
//   border: "none",
//   cursor: "pointer",
//   "@media (max-width: 768px)": {
//     padding: "8px",
//     fontSize: "0.9rem",
//   },
// };

// export default CourseDetails;
/********************************************************************************** */
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";
// import { FaEdit, FaTrash, FaTimes, FaPlay } from "react-icons/fa";

// const CourseDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState(""); // "delete" or "edit"
//   const [selectedVideoId, setSelectedVideoId] = useState(null);
//   const [editVideoTitle, setEditVideoTitle] = useState("");

//   // جلب تفاصيل الكورس
//   useEffect(() => {
//     const fetchCourse = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         setError("الرجاء تسجيل الدخول أولاً");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await fetch(`http://localhost:8000/api/v1/teacher/get_course/${id}`, {
//           method: "GET",
//           headers: {
//             "Accept": "application/json",
//             "Authorization": `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             localStorage.removeItem("access_token");
//             setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//             setTimeout(() => {
//               navigate("/login");
//             }, 1000);
//             return;
//           }
//           throw new Error("فشل في جلب تفاصيل الكورس");
//         }

//         const data = await response.json();
//         console.log("Course data:", data); // Debug
//         setCourse(data.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourse();
//   }, [id, navigate]);

//   // جلب الفيديوهات الخاصة بالكورس
//   const fetchVideos = async () => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setError("الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/teacher/get_videos/${id}`, {
//         method: "GET",
//         headers: {
//           "Accept": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token");
//           setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
//         throw new Error("فشل في جلب الفيديوهات");
//       }

//       const data = await response.json();
//       console.log("Videos data:", data); // Debug
//       setVideos(data.data?.data || []);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     if (course) {
//       fetchVideos();
//     }
//   }, [course, navigate]);

//   // حذف فيديو
//   const handleDeleteVideo = async (videoId) => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setError("الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/teacher/delete_video/${videoId}`, {
//         method: "DELETE",
//         headers: {
//           "Accept": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token");
//           setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
//         throw new Error("فشل في حذف الفيديو");
//       }

//       const data = await response.json();
//       console.log("Delete video response:", data); // Debug
//       setVideos(videos.filter((video) => video.id !== videoId));
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // تعديل فيديو
//   const handleUpdateVideo = async () => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setError("الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       return;
//     }

//     if (!editVideoTitle.trim()) {
//       setError("يرجى إدخال عنوان للفيديو");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/teacher/update_video/${selectedVideoId}`, {
//         method: "PUT",
//         headers: {
//           "Accept": "application/json",
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ title: editVideoTitle }),
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token");
//           setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
//         throw new Error("فشل في تعديل الفيديو");
//       }

//       const data = await response.json();
//       console.log("Update video response:", data); // Debug
//       setVideos(
//         videos.map((video) =>
//           video.id === selectedVideoId ? { ...video, title: editVideoTitle } : video
//         )
//       );
//       setError(null);
//       closeModal();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const openModal = (type, videoId, videoTitle) => {
//     setModalType(type);
//     setSelectedVideoId(videoId);
//     if (type === "edit") {
//       setEditVideoTitle(videoTitle);
//     }
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedVideoId(null);
//     setModalType("");
//     setEditVideoTitle("");
//   };

//   const confirmAction = () => {
//     if (modalType === "delete") {
//       handleDeleteVideo(selectedVideoId);
//     } else if (modalType === "edit") {
//       handleUpdateVideo();
//     }
//     closeModal();
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={dashboardContainer}>
//         <Sidebar />
//         <div style={mainContent}>
//           <h1 style={pageTitle}>تفاصيل الدورة</h1>

//           {loading && <p>جاري التحميل...</p>}
//           {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

//           {course && !loading && !error && (
//             <div style={courseDetailsContainer}>
//               {course.cover_image && (
//                 <img
//                   src={`http://localhost:8000${course.cover_image}`}
//                   alt={course.title}
//                   style={courseImageStyle}
//                 />
//               )}
//               <h2 style={courseTitle}>{course.title}</h2>
//               <p style={courseDescription}>{course.description}</p>
//               <div style={buttonContainer}>
//                 <Link to={`/add-video/${id}`} style={addButtonStyle}>
//                   + إضافة فيديو
//                 </Link>
//                 <Link to="/courses" style={backButtonStyle}>
//                   العودة للدورات
//                 </Link>
//               </div>

//               <h3 style={sectionTitle}>الفيديوهات</h3>
//               {videos.length === 0 ? (
//                 <p style={{ textAlign: "center", color: "#666" }}>لا توجد فيديوهات حاليًا</p>
//               ) : (
//                 <div style={tableContainerStyle}>
//                   <table style={tableStyle}>
//                     <thead>
//                       <tr style={tableHeaderRowStyle}>
//                         <th style={tableHeaderCellStyle}>العنوان</th>
//                         <th style={tableHeaderCellStyle}>تشغيل</th>
//                         <th style={tableHeaderCellStyle}>تعديل</th>
//                         <th style={tableHeaderCellStyle}>حذف</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {videos.map((video) => (
//                         <tr key={video.id} style={tableRowStyle}>
//                           <td style={tableCellStyle}>{video.title}</td>
//                           <td style={tableCellStyle}>
//                             <a
//                               href={`http://localhost:8000/${video.video_path}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               style={playButtonStyle}
//                             >
//                               <FaPlay /> تشغيل
//                             </a>
//                           </td>
//                           <td style={tableCellStyle}>
//                             <button
//                               style={editButtonStyle}
//                               onClick={() => openModal("edit", video.id, video.title)}
//                             >
//                               <FaEdit /> تعديل
//                             </button>
//                           </td>
//                           <td style={tableCellStyle}>
//                             <button
//                               style={deleteButtonStyle}
//                               onClick={() => openModal("delete", video.id)}
//                             >
//                               <FaTrash /> حذف
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//           {showModal && (
//             <div style={modalOverlayStyle}>
//               <div style={modalStyle}>
//                 {modalType === "delete" ? (
//                   <>
//                     <p style={{ fontSize: "18px", marginBottom: "20px" }}>
//                       هل أنت متأكد أنك تريد حذف الفيديو؟
//                     </p>
//                     <div style={{ display: "flex", justifyContent: "space-around" }}>
//                       <button onClick={confirmAction} style={yesButtonStyle}>
//                         نعم
//                       </button>
//                       <button onClick={closeModal} style={noButtonStyle}>
//                         لا
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <button style={closeButtonStyle} onClick={closeModal}>
//                       <FaTimes />
//                     </button>
//                     <h2 style={modalTitleStyle}>تعديل عنوان الفيديو</h2>
//                     <input
//                       type="text"
//                       value={editVideoTitle}
//                       onChange={(e) => setEditVideoTitle(e.target.value)}
//                       style={inputStyle}
//                       placeholder="أدخل العنوان الجديد..."
//                     />
//                     <div style={modalButtonContainerStyle}>
//                       <button onClick={confirmAction} style={submitButtonStyle}>
//                         تعديل
//                       </button>
//                       <button onClick={closeModal} style={cancelButtonStyle}>
//                         إلغاء
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// const dashboardContainer = {
//   display: "flex",
//   flexDirection: "row-reverse",
//   direction: "rtl",
//   width: "100%",
//   minHeight: "100vh",
// };

// const mainContent = {
//   padding: "20px",
//   width: "100%",
//   boxSizing: "border-box",
//   marginRight: "220px", // الافتراضي للشاشات الكبيرة
//   "@media (max-width: 768px)": {
//     marginRight: "0", // إزالة الهامش على الشاشات الصغيرة
//   },
// };

// const pageTitle = {
//   textAlign: "right",
//   fontSize: "1.8rem", // استخدام rem بدلاً من px
//   marginBottom: "20px",
//   "@media (max-width: 768px)": {
//     fontSize: "1.5rem",
//   },
// };

// const courseDetailsContainer = {
//   backgroundColor: "#fff",
//   padding: "20px",
//   borderRadius: "10px",
//   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//   width: "100%",
//   maxWidth: "1200px",
//   margin: "0 auto",
// };

// const courseImageStyle = {
//   width: "100%",
//   maxWidth: "300px",
//   height: "auto",
//   borderRadius: "10px",
//   marginBottom: "15px",
//   display: "block",
//   marginLeft: "auto",
//   marginRight: "auto",
// };

// const courseTitle = {
//   fontSize: "1.5rem",
//   textAlign: "right",
//   marginBottom: "10px",
//   "@media (max-width: 768px)": {
//     fontSize: "1.2rem",
//   },
// };

// const courseDescription = {
//   fontSize: "1rem",
//   textAlign: "right",
//   color: "#666",
//   marginBottom: "20px",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//   },
// };

// const sectionTitle = {
//   fontSize: "1.25rem",
//   textAlign: "right",
//   margin: "20px 0 10px",
//   "@media (max-width: 768px)": {
//     fontSize: "1.1rem",
//   },
// };

// const buttonContainer = {
//   display: "flex",
//   justifyContent: "flex-end",
//   gap: "10px",
//   marginBottom: "20px",
//   flexWrap: "wrap", // السماح للأزرار بالانتقال إلى السطر التالي على الشاشات الصغيرة
// };

// const addButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "10px 15px",
//   borderRadius: "5px",
//   fontSize: "1rem",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   textDecoration: "none",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "8px 12px",
//   },
// };

// const backButtonStyle = {
//   backgroundColor: "#ccc",
//   color: "#fff",
//   border: "none",
//   padding: "10px 15px",
//   borderRadius: "5px",
//   fontSize: "1rem",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   textDecoration: "none",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "8px 12px",
//   },
// };

// const tableContainerStyle = {
//   width: "100%",
//   overflowX: "auto", // السماح بالتمرير الأفقي على الشاشات الصغيرة
//   backgroundColor: "#fff",
//   borderRadius: "10px",
//   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//   padding: "15px",
// };

// const tableStyle = {
//   width: "100%",
//   borderCollapse: "collapse",
//   textAlign: "right",
//   minWidth: "600px", // ضمان أن الجدول لا يصبح صغيرًا جدًا
// };

// const tableHeaderRowStyle = {
//   backgroundColor: "#f8f9fa",
// };

// const tableHeaderCellStyle = {
//   padding: "12px",
//   textAlign: "right",
//   fontWeight: "bold",
//   borderBottom: "2px solid #ddd",
//   "@media (max-width: 768px)": {
//     padding: "8px",
//     fontSize: "0.9rem",
//   },
// };

// const tableRowStyle = {
//   borderBottom: "1px solid #ddd",
// };

// const tableCellStyle = {
//   padding: "12px",
//   "@media (max-width: 768px)": {
//     padding: "8px",
//     fontSize: "0.9rem",
//   },
// };

// const playButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "7px 15px",
//   borderRadius: "5px",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   gap: "5px",
//   fontSize: "1rem",
//   textDecoration: "none",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "6px 12px",
//   },
// };

// const editButtonStyle = {
//   backgroundColor: "transparent",
//   color: "#1EC8A0",
//   border: "2px solid #1EC8A0",
//   padding: "7px 15px",
//   borderRadius: "5px",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   gap: "5px",
//   fontSize: "1rem",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "6px 12px",
//   },
// };

// const deleteButtonStyle = {
//   backgroundColor: "transparent",
//   color: "#dc3545",
//   border: "2px solid #dc3545",
//   padding: "7px 15px",
//   borderRadius: "5px",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   gap: "5px",
//   fontSize: "1rem",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "6px 12px",
//   },
// };

// const modalOverlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100vw",
//   height: "100vh",
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 1000,
// };

// const modalStyle = {
//   backgroundColor: "#fff",
//   padding: "20px",
//   borderRadius: "10px",
//   boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
//   textAlign: "center",
//   width: "90%",
//   maxWidth: "400px",
//   "@media (max-width: 768px)": {
//     padding: "15px",
//     maxWidth: "90%",
//   },
// };

// const yesButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "10px 20px",
//   borderRadius: "5px",
//   fontWeight: "bold",
//   cursor: "pointer",
//   "@media (max-width: 768px)": {
//     padding: "8px 15px",
//     fontSize: "0.9rem",
//   },
// };

// const noButtonStyle = {
//   backgroundColor: "#ccc",
//   color: "#000",
//   border: "none",
//   padding: "10px 20px",
//   borderRadius: "5px",
//   fontWeight: "bold",
//   cursor: "pointer",
//   "@media (max-width: 768px)": {
//     padding: "8px 15px",
//     fontSize: "0.9rem",
//   },
// };

// const closeButtonStyle = {
//   background: "transparent",
//   border: "none",
//   fontSize: "1.2rem",
//   cursor: "pointer",
//   float: "left",
//   "@media (max-width: 768px)": {
//     fontSize: "1rem",
//   },
// };

// const modalTitleStyle = {
//   textAlign: "right",
//   fontSize: "1.4rem",
//   marginBottom: "10px",
//   "@media (max-width: 768px)": {
//     fontSize: "1.2rem",
//   },
// };

// const inputStyle = {
//   width: "100%",
//   padding: "10px",
//   border: "1px solid #1EC8A0",
//   borderRadius: "5px",
//   textAlign: "right",
//   fontSize: "1rem",
//   marginBottom: "15px",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "8px",
//   },
// };

// const modalButtonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "10px",
//   "@media (max-width: 768px)": {
//     flexDirection: "column",
//     gap: "10px",
//   },
// };

// const submitButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   padding: "10px",
//   borderRadius: "5px",
//   border: "none",
//   cursor: "pointer",
//   "@media (max-width: 768px)": {
//     padding: "8px",
//     fontSize: "0.9rem",
//   },
// };

// const cancelButtonStyle = {
//   backgroundColor: "#ccc",
//   color: "#fff",
//   padding: "10px",
//   borderRadius: "5px",
//   border: "none",
//   cursor: "pointer",
//   "@media (max-width: 768px)": {
//     padding: "8px",
//     fontSize: "0.9rem",
//   },
// };

// export default CourseDetails;
/********************************************************************************* */
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";
// import { FaEdit, FaTrash, FaTimes, FaPlay } from "react-icons/fa";

// const CourseDetails = () => {
//   const { id } = useParams(); 
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState(""); // "delete" or "edit"
//   const [selectedVideoId, setSelectedVideoId] = useState(null);
//   const [editVideoTitle, setEditVideoTitle] = useState("");

//   // جلب تفاصيل الكورس
//   useEffect(() => {
//     const fetchCourse = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         setError("الرجاء تسجيل الدخول أولاً");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await fetch(`http://localhost:8000/api/v1/teacher/get_course/${id}`, {
//           method: "GET",
//           headers: {
//             "Accept": "application/json",
//             "Authorization": `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             localStorage.removeItem("access_token");
//             setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//             setTimeout(() => {
//               navigate("/login");
//             }, 1000);
//             return;
//           }
//           throw new Error("فشل في جلب تفاصيل الكورس");
//         }

//         const data = await response.json();
//         console.log("Course data:", data); // Debug
//         setCourse(data.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourse();
//   }, [id, navigate]);

//   // جلب الفيديوهات الخاصة بالكورس
//   const fetchVideos = async () => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setError("الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/teacher/get_videos/${id}`, {
//         method: "GET",
//         headers: {
//           "Accept": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token");
//           setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
//         throw new Error("فشل في جلب الفيديوهات");
//       }

//       const data = await response.json();
//       console.log("Videos data:", data); // Debug
//       setVideos(data.data?.data || []); 
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     if (course) {
//       fetchVideos();
//     }
//   }, [course, navigate]);

//   // حذف فيديو
//   const handleDeleteVideo = async (videoId) => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setError("الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/teacher/delete_video/${videoId}`, {
//         method: "DELETE",
//         headers: {
//           "Accept": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token");
//           setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
//         throw new Error("فشل في حذف الفيديو");
//       }

//       const data = await response.json();
//       console.log("Delete video response:", data); // Debug
//       setVideos(videos.filter((video) => video.id !== videoId));
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // تعديل فيديو
//   const handleUpdateVideo = async () => {
//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setError("الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       return;
//     }

//     if (!editVideoTitle.trim()) {
//       setError("يرجى إدخال عنوان للفيديو");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/v1/teacher/update_video/${selectedVideoId}`, {
//         method: "PUT",
//         headers: {
//           "Accept": "application/json",
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ title: editVideoTitle }),
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token");
//           setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
//         throw new Error("فشل في تعديل الفيديو");
//       }

//       const data = await response.json();
//       console.log("Update video response:", data); // Debug
//       setVideos(videos.map((video) =>
//         video.id === selectedVideoId ? { ...video, title: editVideoTitle } : video
//       ));
//       setError(null);
//       closeModal();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const openModal = (type, videoId, videoTitle) => {
//     setModalType(type);
//     setSelectedVideoId(videoId);
//     if (type === "edit") {
//       setEditVideoTitle(videoTitle);
//     }
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedVideoId(null);
//     setModalType("");
//     setEditVideoTitle("");
//   };

//   const confirmAction = () => {
//     if (modalType === "delete") {
//       handleDeleteVideo(selectedVideoId);
//     } else if (modalType === "edit") {
//       handleUpdateVideo();
//     }
//     closeModal();
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={dashboardContainer}>
//         <Sidebar />
//         <div style={mainContent}>
//           <h1 style={pageTitle}>تفاصيل الدورة</h1>

//           {loading && <p>جاري التحميل...</p>}
//           {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

//           {course && !loading && !error && (
//             <div style={courseDetailsContainer}>
//               <h2 style={courseTitle}>{course.title}</h2>
//               <p style={courseDescription}>{course.description}</p>
//               <div style={buttonContainer}>
//                 <Link to={`/add-video/${id}`} style={addButtonStyle}>
//                   + إضافة فيديو
//                 </Link>
//                 <Link to="/courses" style={backButtonStyle}>
//                   العودة للدورات
//                 </Link>
//               </div>

//               <h3 style={sectionTitle}>الفيديوهات</h3>
//               {videos.length === 0 ? (
//                 <p style={{ textAlign: "center", color: "#666" }}>لا توجد فيديوهات حاليًا</p>
//               ) : (
//                 <div style={tableContainerStyle}>
//                   <table style={tableStyle}>
//                     <thead>
//                       <tr style={tableHeaderRowStyle}>
//                         <th style={tableHeaderCellStyle}>العنوان</th>
//                         <th style={tableHeaderCellStyle}>تشغيل</th>
//                         <th style={tableHeaderCellStyle}>تعديل</th>
//                         <th style={tableHeaderCellStyle}>حذف</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {videos.map((video) => (
//                         <tr key={video.id} style={tableRowStyle}>
//                           <td style={tableCellStyle}>{video.title}</td>
//                           <td style={tableCellStyle}>
//                             <a
//                               href={`http://localhost:8000/${video.video_path}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               style={playButtonStyle}
//                             >
//                               <FaPlay /> تشغيل
//                             </a>
//                           </td>
//                           <td style={tableCellStyle}>
//                             <button
//                               style={editButtonStyle}
//                               onClick={() => openModal("edit", video.id, video.title)}
//                             >
//                               <FaEdit /> تعديل
//                             </button>
//                           </td>
//                           <td style={tableCellStyle}>
//                             <button
//                               style={deleteButtonStyle}
//                               onClick={() => openModal("delete", video.id)}
//                             >
//                               <FaTrash /> حذف
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//           {showModal && (
//             <div style={modalOverlayStyle}>
//               <div style={modalStyle}>
//                 {modalType === "delete" ? (
//                   <>
//                     <p style={{ fontSize: "18px", marginBottom: "20px" }}>
//                       هل أنت متأكد أنك تريد حذف الفيديو؟
//                     </p>
//                     <div style={{ display: "flex", justifyContent: "space-around" }}>
//                       <button onClick={confirmAction} style={yesButtonStyle}>
//                         نعم
//                       </button>
//                       <button onClick={closeModal} style={noButtonStyle}>
//                         لا
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <button style={closeButtonStyle} onClick={closeModal}>
//                       <FaTimes />
//                     </button>
//                     <h2 style={modalTitleStyle}>تعديل عنوان الفيديو</h2>
//                     <input
//                       type="text"
//                       value={editVideoTitle}
//                       onChange={(e) => setEditVideoTitle(e.target.value)}
//                       style={inputStyle}
//                       placeholder="أدخل العنوان الجديد..."
//                     />
//                     <div style={modalButtonContainerStyle}>
//                       <button onClick={confirmAction} style={submitButtonStyle}>
//                         تعديل
//                       </button>
//                       <button onClick={closeModal} style={cancelButtonStyle}>
//                         إلغاء
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// // CourseDetails.js (مع التعديلات للـ Responsiveness)

// const dashboardContainer = {
//   display: "flex",
//   flexDirection: "row-reverse",
//   direction: "rtl",
//   width: "100%",
//   minHeight: "100vh",
// };

// const mainContent = {
//   padding: "20px",
//   width: "100%",
//   boxSizing: "border-box",
//   marginRight: "220px", // الافتراضي للشاشات الكبيرة
//   "@media (max-width: 768px)": {
//     marginRight: "0", // إزالة الهامش على الشاشات الصغيرة
//   },
// };

// const pageTitle = {
//   textAlign: "right",
//   fontSize: "1.8rem", // استخدام rem بدلاً من px
//   marginBottom: "20px",
//   "@media (max-width: 768px)": {
//     fontSize: "1.5rem",
//   },
// };

// const courseDetailsContainer = {
//   backgroundColor: "#fff",
//   padding: "20px",
//   borderRadius: "10px",
//   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//   width: "100%",
//   maxWidth: "1200px",
//   margin: "0 auto",
// };

// const courseTitle = {
//   fontSize: "1.5rem",
//   textAlign: "right",
//   marginBottom: "10px",
//   "@media (max-width: 768px)": {
//     fontSize: "1.2rem",
//   },
// };

// const courseDescription = {
//   fontSize: "1rem",
//   textAlign: "right",
//   color: "#666",
//   marginBottom: "20px",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//   },
// };

// const sectionTitle = {
//   fontSize: "1.25rem",
//   textAlign: "right",
//   margin: "20px 0 10px",
//   "@media (max-width: 768px)": {
//     fontSize: "1.1rem",
//   },
// };

// const buttonContainer = {
//   display: "flex",
//   justifyContent: "flex-end",
//   gap: "10px",
//   marginBottom: "20px",
//   flexWrap: "wrap", // السماح للأزرار بالانتقال إلى السطر التالي على الشاشات الصغيرة
// };

// const addButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "10px 15px",
//   borderRadius: "5px",
//   fontSize: "1rem",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   textDecoration: "none",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "8px 12px",
//   },
// };

// const backButtonStyle = {
//   backgroundColor: "#ccc",
//   color: "#fff",
//   border: "none",
//   padding: "10px 15px",
//   borderRadius: "5px",
//   fontSize: "1rem",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   textDecoration: "none",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "8px 12px",
//   },
// };

// const tableContainerStyle = {
//   width: "100%",
//   overflowX: "auto", // السماح بالتمرير الأفقي على الشاشات الصغيرة
//   backgroundColor: "#fff",
//   borderRadius: "10px",
//   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//   padding: "15px",
// };

// const tableStyle = {
//   width: "100%",
//   borderCollapse: "collapse",
//   textAlign: "right",
//   minWidth: "600px", // ضمان أن الجدول لا يصبح صغيرًا جدًا
// };

// const tableHeaderRowStyle = {
//   backgroundColor: "#f8f9fa",
// };

// const tableHeaderCellStyle = {
//   padding: "12px",
//   textAlign: "right",
//   fontWeight: "bold",
//   borderBottom: "2px solid #ddd",
//   "@media (max-width: 768px)": {
//     padding: "8px",
//     fontSize: "0.9rem",
//   },
// };

// const tableRowStyle = {
//   borderBottom: "1px solid #ddd",
// };

// const tableCellStyle = {
//   padding: "12px",
//   "@media (max-width: 768px)": {
//     padding: "8px",
//     fontSize: "0.9rem",
//   },
// };

// const playButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "7px 15px",
//   borderRadius: "5px",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   gap: "5px",
//   fontSize: "1rem",
//   textDecoration: "none",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "6px 12px",
//   },
// };

// const editButtonStyle = {
//   backgroundColor: "transparent",
//   color: "#1EC8A0",
//   border: "2px solid #1EC8A0",
//   padding: "7px 15px",
//   borderRadius: "5px",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   gap: "5px",
//   fontSize: "1rem",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "6px 12px",
//   },
// };

// const deleteButtonStyle = {
//   backgroundColor: "transparent",
//   color: "#dc3545",
//   border: "2px solid #dc3545",
//   padding: "7px 15px",
//   borderRadius: "5px",
//   cursor: "pointer",
//   display: "inline-flex",
//   alignItems: "center",
//   gap: "5px",
//   fontSize: "1rem",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "6px 12px",
//   },
// };

// const modalOverlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100vw",
//   height: "100vh",
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 1000,
// };

// const modalStyle = {
//   backgroundColor: "#fff",
//   padding: "20px",
//   borderRadius: "10px",
//   boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
//   textAlign: "center",
//   width: "90%",
//   maxWidth: "400px",
//   "@media (max-width: 768px)": {
//     padding: "15px",
//     maxWidth: "90%",
//   },
// };

// const yesButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "10px 20px",
//   borderRadius: "5px",
//   fontWeight: "bold",
//   cursor: "pointer",
//   "@media (max-width: 768px)": {
//     padding: "8px 15px",
//     fontSize: "0.9rem",
//   },
// };

// const noButtonStyle = {
//   backgroundColor: "#ccc",
//   color: "#000",
//   border: "none",
//   padding: "10px 20px",
//   borderRadius: "5px",
//   fontWeight: "bold",
//   cursor: "pointer",
//   "@media (max-width: 768px)": {
//     padding: "8px 15px",
//     fontSize: "0.9rem",
//   },
// };

// const closeButtonStyle = {
//   background: "transparent",
//   border: "none",
//   fontSize: "1.2rem",
//   cursor: "pointer",
//   float: "left",
//   "@media (max-width: 768px)": {
//     fontSize: "1rem",
//   },
// };

// const modalTitleStyle = {
//   textAlign: "right",
//   fontSize: "1.4rem",
//   marginBottom: "10px",
//   "@media (max-width: 768px)": {
//     fontSize: "1.2rem",
//   },
// };

// const inputStyle = {
//   width: "100%",
//   padding: "10px",
//   border: "1px solid #1EC8A0",
//   borderRadius: "5px",
//   textAlign: "right",
//   fontSize: "1rem",
//   marginBottom: "15px",
//   "@media (max-width: 768px)": {
//     fontSize: "0.9rem",
//     padding: "8px",
//   },
// };

// const modalButtonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: "10px",
//   "@media (max-width: 768px)": {
//     flexDirection: "column",
//     gap: "10px",
//   },
// };

// const submitButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   padding: "10px",
//   borderRadius: "5px",
//   border: "none",
//   cursor: "pointer",
//   "@media (max-width: 768px)": {
//     padding: "8px",
//     fontSize: "0.9rem",
//   },
// };

// const cancelButtonStyle = {
//   backgroundColor: "#ccc",
//   color: "#fff",
//   padding: "10px",
//   borderRadius: "5px",
//   border: "none",
//   cursor: "pointer",
//   "@media (max-width: 768px)": {
//     padding: "8px",
//     fontSize: "0.9rem",
//   },
// };
//export default CourseDetails;
/************************************************************************************ */
// const dashboardContainer = { display: "flex", flexDirection: "row-reverse", direction: "rtl" };
// const mainContent = { marginRight: "220px", padding: "20px", width: "100%", boxSizing: "border-box" };
// const pageTitle = { textAlign: "right", fontSize: "30px", marginBottom: "20px" };
// const courseDetailsContainer = { backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" };
// const courseTitle = { fontSize: "24px", textAlign: "right", marginBottom: "10px" };
// const courseDescription = { fontSize: "16px", textAlign: "right", color: "#666", marginBottom: "20px" };
// const sectionTitle = { fontSize: "20px", textAlign: "right", margin: "20px 0 10px" };
// const buttonContainer = { display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" };
// const addButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "10px 15px",
//   borderRadius: "5px",
//   fontSize: "18px",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   textDecoration: "none",
// };
// const backButtonStyle = {
//   backgroundColor: "#ccc",
//   color: "#fff",
//   border: "none",
//   padding: "10px 15px",
//   borderRadius: "5px",
//   fontSize: "18px",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   textDecoration: "none",
// };
// const tableContainerStyle = { width: "100%", overflowX: "auto", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", padding: "15px" };
// const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "right" };
// const tableHeaderRowStyle = { backgroundColor: "#f8f9fa" };
// const tableHeaderCellStyle = { padding: "12px", textAlign: "right", fontWeight: "bold", borderBottom: "2px solid #ddd" };
// const tableRowStyle = { borderBottom: "1px solid #ddd" };
// const tableCellStyle = { padding: "12px" };
// const playButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "7px 15px",
//   borderRadius: "5px",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   gap: "5px",
//   fontSize: "16px",
//   textDecoration: "none",
// };
// const editButtonStyle = {
//   backgroundColor: "transparent",
//   color: "#1EC8A0",
//   border: "2px solid #1EC8A0",
//   padding: "7px 15px",
//   borderRadius: "5px",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   gap: "5px",
//   fontSize: "16px",
// };
// const deleteButtonStyle = {
//   backgroundColor: "transparent",
//   color: "#dc3545",
//   border: "2px solid #dc3545",
//   padding: "7px 15px",
//   borderRadius: "5px",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   gap: "5px",
//   fontSize: "16px",
// };
// const modalOverlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100vw",
//   height: "100vh",
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 1000,
// };
// const modalStyle = {
//   backgroundColor: "#fff",
//   padding: "30px",
//   borderRadius: "10px",
//   boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
//   textAlign: "center",
//   minWidth: "300px",
// };
// const yesButtonStyle = {
//   backgroundColor: "#1EC8A0",
//   color: "#fff",
//   border: "none",
//   padding: "10px 20px",
//   borderRadius: "5px",
//   fontWeight: "bold",
//   cursor: "pointer",
// };
// const noButtonStyle = {
//   backgroundColor: "#ccc",
//   color: "#000",
//   border: "none",
//   padding: "10px 20px",
//   borderRadius: "5px",
//   fontWeight: "bold",
//   cursor: "pointer",
// };
// const closeButtonStyle = { background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", float: "left" };
// const modalTitleStyle = { textAlign: "right", fontSize: "22px", marginBottom: "10px" };
// const inputStyle = { width: "100%", padding: "10px", border: "1px solid #1EC8A0", borderRadius: "5px", textAlign: "right", fontSize: "16px", marginBottom: "15px" };
// const modalButtonContainerStyle = { display: "flex", justifyContent: "space-between", marginTop: "10px" };
// const submitButtonStyle = { backgroundColor: "#1EC8A0", color: "#fff", padding: "10px", borderRadius: "5px", border: "none", cursor: "pointer" };
// const cancelButtonStyle = { backgroundColor: "#ccc", color: "#fff", padding: "10px", borderRadius: "5px", border: "none", cursor: "pointer" };

