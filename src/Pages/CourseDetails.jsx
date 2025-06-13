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
    backgroundColor: "#ffffff",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  }

  const mainContentStyle = {
    padding: "20px",
    width: "100%",
    boxSizing: "border-box",
    marginRight: "220px",
    backgroundColor: "#ffffff"
  }

  const pageTitleStyle = {
    textAlign: "right",
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#333333",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "12px"
  }

  const courseCardStyle = {
    backgroundColor: "#f5f5f5",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
  }

  const videoCardStyle = {
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
  }

  const modalContentStyle = {
    backgroundColor: "#f5f5f5",
    borderRadius: "12px",
    padding: "20px",
    width: "400px",
    maxWidth: "90%",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
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
    backgroundColor: "#f5f5f5",
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
    color: "#333333",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "16px"
  }

  const noVideosStyle = {
    textAlign: "center",
    color: "#666",
    fontSize: "1.125rem",
    padding: "60px 20px",
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "#f5f5f5",
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
            <FaVideo style={{ marginLeft: "8px" }} />
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

export default CourseDetails;
