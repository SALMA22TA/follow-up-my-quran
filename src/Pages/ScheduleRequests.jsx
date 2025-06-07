import { useState, useEffect } from "react"
import Sidebar from "../Components/Sidebar"
import Navbar from "../Components/DashboardNavbar"
import { useNavigate } from "react-router-dom"

const API_BASE_URL = "http://localhost:8000/api/v1/teacher"

const ScheduleRequests = () => {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalAction, setModalAction] = useState(null)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [selectedRequestName, setSelectedRequestName] = useState("")

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) {
        setError("❌ الرجاء تسجيل الدخول أولاً")
        setTimeout(() => {
          navigate("/login")
        }, 1000)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`${API_BASE_URL}/get_schedules_requests`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token")
            setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.")
            setTimeout(() => {
              navigate("/login")
            }, 1000)
            return
          }
          throw new Error("فشل في جلب الطلبات")
        }

        const result = await response.json()
        console.log("Schedule requests response:", JSON.stringify(result, null, 2))
        if (result?.data?.data) {
          setRequests(result.data.data)
        } else {
          setRequests([])
        }
      } catch (error) {
        setError("❌ حدث خطأ أثناء جلب الطلبات: " + error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [navigate])

  const getStudentName = (session) => {
    return session.student?.fullName || session.users?.fullName || session.fullName || "غير معروف"
  }

  const openConfirmationModal = (action, requestId, request) => {
    setModalAction(action)
    setSelectedRequestId(requestId)
    setSelectedRequestName(getStudentName(request))
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalAction(null)
    setSelectedRequestId(null)
    setSelectedRequestName("")
  }

  const confirmAction = async () => {
    if (modalAction === "delete") {
      await handleDelete(selectedRequestId)
    } else {
      await handleAction(selectedRequestId, modalAction)
    }
    closeModal()
  }

  const handleAction = async (id, action) => {
    const url = `${API_BASE_URL}/${action}_schedule/${id}`
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        setError("❌ الرجاء تسجيل الدخول أولاً")
        setTimeout(() => {
          navigate("/login")
        }, 1000)
        return
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      const result = await response.json()
      console.log(`${action} schedule response:`, result)
      if (response.ok) {
        setRequests((prev) => prev.filter((request) => request.id !== id))
        setError(null)
      } else {
        if (response.status === 401) {
          localStorage.removeItem("access_token")
          setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.")
          setTimeout(() => {
            navigate("/login")
          }, 1000)
          return
        }
        setError(`❌ خطأ: ${result.message || "حدث خطأ ما"}`)
      }
    } catch (error) {
      setError(`❌ فشل العملية: ${error.message}`)
    }
  }

  const handleDelete = async (id) => {
    const url = `${API_BASE_URL}/delete_schedule/${id}`
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        setError("❌ الرجاء تسجيل الدخول أولاً")
        setTimeout(() => {
          navigate("/login")
        }, 1000)
        return
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      const result = await response.json()
      console.log("Delete schedule response:", result)
      if (response.ok) {
        setRequests((prev) => prev.filter((request) => request.id !== id))
        setError(null)
      } else {
        if (response.status === 401) {
          localStorage.removeItem("access_token")
          setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.")
          setTimeout(() => {
            navigate("/login")
          }, 1000)
          return
        }
        setError(`❌ خطأ: ${result.message || "حدث خطأ ما"}`)
      }
    } catch (error) {
      setError(`❌ فشل العملية: ${error.message}`)
    }
  }

  const getModalMessage = () => {
    switch (modalAction) {
      case "accept":
        return `هل أنت متأكد من قبول طلب الجدولة من الطالب ${selectedRequestName}؟`
      case "reject":
        return `هل أنت متأكد من رفض طلب الجدولة من الطالب ${selectedRequestName}؟`
      case "delete":
        return `هل أنت متأكد من حذف طلب الجدولة من الطالب ${selectedRequestName}؟`
      default:
        return `هل أنت متأكد من هذا الإجراء؟ (طالب: ${selectedRequestName})`
    }
  }

  const mainContainerStyle = {
    display: "flex",
    flexDirection: "row-reverse",
    direction: "rtl",
    minHeight: "100vh",
    backgroundColor: "#f5f9f8",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  }

  const contentContainerStyle = {
    marginRight: "220px",
    padding: "24px",
    width: "100%",
    boxSizing: "border-box",
  }

  const titleStyle = {
    textAlign: "right",
    fontWeight: "700",
    marginBottom: "24px",
    fontSize: "2rem",
    color: "#20c997",
    margin: "0 0 24px 0",
  }

  const errorMessageStyle = {
    textAlign: "center",
    color: "#e53e3e",
    marginBottom: "20px",
    padding: "12px 16px",
    backgroundColor: "#fed7d7",
    border: "1px solid #feb2b2",
    borderRadius: "8px",
    fontWeight: "500",
  }

  const mainCardStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 6px rgba(32, 201, 151, 0.1)",
    border: "1px solid #e0f0ed",
  }

  const loadingStyle = {
    textAlign: "center",
    padding: "40px 20px",
    fontSize: "1.125rem",
    fontWeight: "500",
    color: "#20c997",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  }

  const emptyStateStyle = {
    textAlign: "center",
    padding: "40px 20px",
    fontSize: "1.125rem",
    fontWeight: "500",
    color: "#6b7280",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  }

  const requestCardStyle = {
    backgroundColor: "#f9fffd",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e0f0ed",
    transition: "all 0.3s ease",
    flexWrap: "wrap",
    gap: "16px",
  }

  const requestCardHoverStyle = {
    ...requestCardStyle,
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(32, 201, 151, 0.15)",
  }

  const requestInfoStyle = {
    flex: "1",
    minWidth: "250px",
  }

  const requestNameStyle = {
    margin: "0 0 8px 0",
    fontWeight: "600",
    fontSize: "1.25rem",
    color: "#333",
  }

  const requestDetailsStyle = {
    margin: "6px 0",
    color: "#666",
    fontSize: "0.9375rem",
    lineHeight: "1.5",
  }

  const buttonContainerStyle = {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  }

  const baseButtonStyle = {
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.875rem",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    whiteSpace: "nowrap",
  }

  const acceptButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: "#20c997",
    color: "white",
  }

  const acceptButtonHoverStyle = {
    backgroundColor: "#1db386",
    transform: "translateY(-1px)",
    boxShadow: "0 2px 8px rgba(32, 201, 151, 0.3)",
  }

  const rejectButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: "#ff6b6b",
    color: "white",
  }

  const rejectButtonHoverStyle = {
    backgroundColor: "#fa5252",
    transform: "translateY(-1px)",
    boxShadow: "0 2px 8px rgba(255, 107, 107, 0.3)",
  }

  const deleteButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: "#6b7280",
    color: "white",
  }

  const deleteButtonHoverStyle = {
    backgroundColor: "#4b5563",
    transform: "translateY(-1px)",
    boxShadow: "0 2px 8px rgba(107, 114, 128, 0.3)",
  }

  const spinnerStyle = {
    width: "20px",
    height: "20px",
    border: "2px solid #c6f6d5",
    borderTop: "2px solid #20c997",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
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
    padding: "32px",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    width: "90%",
    maxWidth: "450px",
    border: "1px solid #e0f0ed",
  }

  const modalMessageStyle = {
    fontSize: "1.25rem",
    marginBottom: "32px",
    color: "#333",
    lineHeight: "1.6",
    textAlign: "right",
  }

  const modalButtonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
  }

  const confirmButtonStyle = {
    backgroundColor: "#20c997",
    color: "white",
    padding: "12px 24px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "1.125rem",
    fontWeight: "600",
    flex: 1,
    transition: "all 0.3s ease",
  }

  const confirmButtonHoverStyle = {
    backgroundColor: "#1db386",
    transform: "translateY(-1px)",
  }

  const cancelButtonStyle = {
    backgroundColor: "#6b7280",
    color: "white",
    padding: "12px 24px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "1.125rem",
    fontWeight: "600",
    flex: 1,
    transition: "all 0.3s ease",
  }

  const cancelButtonHoverStyle = {
    backgroundColor: "#4b5563",
    transform: "translateY(-1px)",
  }

  return (
    <>
      <Navbar />
      <div style={mainContainerStyle}>
        <Sidebar />
        <div style={contentContainerStyle}>
          <h1 style={titleStyle}>جميع طلبات الجدولة</h1>

          {error && <div style={errorMessageStyle}>{error}</div>}

          <div style={mainCardStyle}>
            {loading ? (
              <div style={loadingStyle}>
                <div style={spinnerStyle}></div>
                جاري تحميل الطلبات...
              </div>
            ) : requests.length === 0 ? (
              <div style={emptyStateStyle}>
                <span style={{ fontSize: "3rem" }}>📅</span>
                <span>لا يوجد طلبات جدولة حالياً</span>
                <span style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                  ستظهر هنا جميع طلبات الجدولة الجديدة من الطلاب
                </span>
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  style={requestCardStyle}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, requestCardHoverStyle)
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, requestCardStyle)
                  }}
                >
                  <div style={requestInfoStyle}>
                    <p style={requestNameStyle}>👤 {getStudentName(request)}</p>
                    <p style={requestDetailsStyle}>
                      <span style={{ fontWeight: "500" }}>📅 الأيام:</span> {request.days || "غير محدد"} -{" "}
                      <span style={{ fontWeight: "500" }}>⏰ الساعة:</span> {request.time || "غير محدد"}
                    </p>
                    <p style={requestDetailsStyle}>
                      <span style={{ fontWeight: "500" }}>⏱️ المدة:</span> {request.duration || "غير محدد"}
                    </p>
                  </div>
                  <div style={buttonContainerStyle}>
                    <button
                      onClick={() => openConfirmationModal("accept", request.id, request)}
                      style={acceptButtonStyle}
                      onMouseEnter={(e) => Object.assign(e.target.style, acceptButtonHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.target.style, acceptButtonStyle)}
                    >
                      <span>✅</span> قبول
                    </button>
                    <button
                      onClick={() => openConfirmationModal("reject", request.id, request)}
                      style={rejectButtonStyle}
                      onMouseEnter={(e) => Object.assign(e.target.style, rejectButtonHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.target.style, rejectButtonStyle)}
                    >
                      <span>❌</span> رفض
                    </button>
                    <button
                      onClick={() => openConfirmationModal("delete", request.id, request)}
                      style={deleteButtonStyle}
                      onMouseEnter={(e) => Object.assign(e.target.style, deleteButtonHoverStyle)}
                      onMouseLeave={(e) => Object.assign(e.target.style, deleteButtonStyle)}
                    >
                      <span>🗑️</span> حذف
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <p style={modalMessageStyle}>{getModalMessage()}</p>
            <div style={modalButtonContainerStyle}>
              <button
                onClick={confirmAction}
                style={confirmButtonStyle}
                onMouseEnter={(e) => Object.assign(e.target.style, confirmButtonHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.target.style, confirmButtonStyle)}
              >
                نعم، متأكد
              </button>
              <button
                onClick={closeModal}
                style={cancelButtonStyle}
                onMouseEnter={(e) => Object.assign(e.target.style, cancelButtonHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.target.style, cancelButtonStyle)}
              >
                لا، إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

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

export default ScheduleRequests
/********************************************************************************** */
// import { useState, useEffect } from "react"
// import Sidebar from "../Components/Sidebar"
// import Navbar from "../Components/DashboardNavbar"
// import { useNavigate } from "react-router-dom"

// const API_BASE_URL = "http://localhost:8000/api/v1/teacher"

// const ScheduleRequests = () => {
//   const navigate = useNavigate()
//   const [requests, setRequests] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // Modal states
//   const [showModal, setShowModal] = useState(false)
//   const [modalAction, setModalAction] = useState(null) // 'accept', 'reject', 'delete'
//   const [selectedRequestId, setSelectedRequestId] = useState(null)
//   const [/*selectedRequestName,*/ setSelectedRequestName] = useState("")

//   useEffect(() => {
//     const fetchRequests = async () => {
//       const token = localStorage.getItem("access_token")
//       if (!token) {
//         setError("❌ الرجاء تسجيل الدخول أولاً")
//         setTimeout(() => {
//           navigate("/login")
//         }, 1000)
//         return
//       }

//       try {
//         setLoading(true)
//         setError(null)
//         const response = await fetch(`${API_BASE_URL}/get_schedules_requests`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         })

//         if (!response.ok) {
//           if (response.status === 401) {
//             localStorage.removeItem("access_token")
//             setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.")
//             setTimeout(() => {
//               navigate("/login")
//             }, 1000)
//             return
//           }
//           throw new Error("فشل في جلب الطلبات")
//         }

//         const result = await response.json()
//         console.log("Schedule requests response:", result) // Debug
//         if (result?.data?.data) {
//           setRequests(result.data.data)
//         } else {
//           setRequests([])
//         }
//       } catch (error) {
//         setError("❌ حدث خطأ أثناء جلب الطلبات: " + error.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchRequests()
//   }, [navigate])

//   // Open confirmation modal
//   const openConfirmationModal = (action, requestId, requestName) => {
//     setModalAction(action)
//     setSelectedRequestId(requestId)
//     setSelectedRequestName(requestName)
//     setShowModal(true)
//   }

//   // Close modal
//   const closeModal = () => {
//     setShowModal(false)
//     setModalAction(null)
//     setSelectedRequestId(null)
//     setSelectedRequestName("")
//   }

//   // Confirm and execute action
//   const confirmAction = async () => {
//     if (modalAction === "delete") {
//       await handleDelete(selectedRequestId)
//     } else {
//       await handleAction(selectedRequestId, modalAction)
//     }
//     closeModal()
//   }

//   const handleAction = async (id, action) => {
//     const url = `${API_BASE_URL}/${action}_schedule/${id}`
//     try {
//       const token = localStorage.getItem("access_token")
//       if (!token) {
//         setError("❌ الرجاء تسجيل الدخول أولاً")
//         setTimeout(() => {
//           navigate("/login")
//         }, 1000)
//         return
//       }

//       const response = await fetch(url, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/json",
//         },
//       })

//       const result = await response.json()
//       console.log(`${action} schedule response:`, result) // Debug
//       if (response.ok) {
//         setRequests((prev) => prev.filter((request) => request.id !== id))
//         setError(null)
//       } else {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token")
//           setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.")
//           setTimeout(() => {
//             navigate("/login")
//           }, 1000)
//           return
//         }
//         setError(`❌ خطأ: ${result.message || "حدث خطأ ما"}`)
//       }
//     } catch (error) {
//       setError(`❌ فشل العملية: ${error.message}`)
//     }
//   }

//   const handleDelete = async (id) => {
//     const url = `${API_BASE_URL}/delete_schedule/${id}`
//     try {
//       const token = localStorage.getItem("access_token")
//       if (!token) {
//         setError("❌ الرجاء تسجيل الدخول أولاً")
//         setTimeout(() => {
//           navigate("/login")
//         }, 1000)
//         return
//       }

//       const response = await fetch(url, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/json",
//         },
//       })

//       const result = await response.json()
//       console.log("Delete schedule response:", result) // Debug
//       if (response.ok) {
//         setRequests((prev) => prev.filter((request) => request.id !== id))
//         setError(null)
//       } else {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token")
//           setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.")
//           setTimeout(() => {
//             navigate("/login")
//           }, 1000)
//           return
//         }
//         setError(`❌ خطأ: ${result.message || "حدث خطأ ما"}`)
//       }
//     } catch (error) {
//       setError(`❌ فشل العملية: ${error.message}`)
//     }
//   }

//   // Get modal message based on action
//   const getModalMessage = () => {
//     switch (modalAction) {
//       case "accept":
//         return `هل أنت متأكد من قبول طلب الجدولة من طالب رقم${selectedRequestId}؟`
//       case "reject":
//         return `هل أنت متأكد من رفض طلب الجدولة من من طالب رقم${selectedRequestId}؟`
//       case "delete":
//         return `هل أنت متأكد من حذف طلب الجدولة من من طالب رقم${selectedRequestId}؟`
//       default:
//         return "هل أنت متأكد من هذا الإجراء؟"
//     }
//   }

//   // Enhanced styles following the mint green theme
//   const mainContainerStyle = {
//     display: "flex",
//     flexDirection: "row-reverse",
//     direction: "rtl",
//     minHeight: "100vh",
//     backgroundColor: "#f5f9f8",
//     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//   }

//   const contentContainerStyle = {
//     marginRight: "220px",
//     padding: "24px",
//     width: "100%",
//     boxSizing: "border-box",
//   }

//   const titleStyle = {
//     textAlign: "right",
//     fontWeight: "700",
//     marginBottom: "24px",
//     fontSize: "2rem",
//     color: "#20c997",
//     margin: "0 0 24px 0",
//   }

//   const errorMessageStyle = {
//     textAlign: "center",
//     color: "#e53e3e",
//     marginBottom: "20px",
//     padding: "12px 16px",
//     backgroundColor: "#fed7d7",
//     border: "1px solid #feb2b2",
//     borderRadius: "8px",
//     fontWeight: "500",
//   }

//   const mainCardStyle = {
//     backgroundColor: "white",
//     borderRadius: "12px",
//     padding: "24px",
//     boxShadow: "0 4px 6px rgba(32, 201, 151, 0.1)",
//     border: "1px solid #e0f0ed",
//   }

//   const loadingStyle = {
//     textAlign: "center",
//     padding: "40px 20px",
//     fontSize: "1.125rem",
//     fontWeight: "500",
//     color: "#20c997",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "12px",
//   }

//   const emptyStateStyle = {
//     textAlign: "center",
//     padding: "40px 20px",
//     fontSize: "1.125rem",
//     fontWeight: "500",
//     color: "#6b7280",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: "12px",
//   }

//   const requestCardStyle = {
//     backgroundColor: "#f9fffd",
//     borderRadius: "10px",
//     padding: "20px",
//     marginBottom: "16px",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
//     border: "1px solid #e0f0ed",
//     transition: "all 0.3s ease",
//     flexWrap: "wrap",
//     gap: "16px",
//   }

//   const requestCardHoverStyle = {
//     ...requestCardStyle,
//     transform: "translateY(-2px)",
//     boxShadow: "0 4px 12px rgba(32, 201, 151, 0.15)",
//   }

//   const requestInfoStyle = {
//     flex: "1",
//     minWidth: "250px",
//   }

//   const requestNameStyle = {
//     margin: "0 0 8px 0",
//     fontWeight: "600",
//     fontSize: "1.25rem",
//     color: "#333",
//   }

//   const requestDetailsStyle = {
//     margin: "6px 0",
//     color: "#666",
//     fontSize: "0.9375rem",
//     lineHeight: "1.5",
//   }

//   const buttonContainerStyle = {
//     display: "flex",
//     gap: "8px",
//     // flexWrap: "wrap",
//     alignItems: "center",
//   }

//   const baseButtonStyle = {
//     border: "none",
//     padding: "10px 16px",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontWeight: "600",
//     fontSize: "0.875rem",
//     transition: "all 0.3s ease",
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     whiteSpace: "nowrap",
//   }

//   const acceptButtonStyle = {
//     ...baseButtonStyle,
//     backgroundColor: "#20c997",
//     color: "white",
//   }

//   const acceptButtonHoverStyle = {
//     backgroundColor: "#1db386",
//     transform: "translateY(-1px)",
//     boxShadow: "0 2px 8px rgba(32, 201, 151, 0.3)",
//   }

//   const rejectButtonStyle = {
//     ...baseButtonStyle,
//     backgroundColor: "#ff6b6b",
//     color: "white",
//   }

//   const rejectButtonHoverStyle = {
//     backgroundColor: "#fa5252",
//     transform: "translateY(-1px)",
//     boxShadow: "0 2px 8px rgba(255, 107, 107, 0.3)",
//   }

//   const deleteButtonStyle = {
//     ...baseButtonStyle,
//     backgroundColor: "#6b7280",
//     color: "white",
//   }

//   const deleteButtonHoverStyle = {
//     backgroundColor: "#4b5563",
//     transform: "translateY(-1px)",
//     boxShadow: "0 2px 8px rgba(107, 114, 128, 0.3)",
//   }

//   const spinnerStyle = {
//     width: "20px",
//     height: "20px",
//     border: "2px solid #c6f6d5",
//     borderTop: "2px solid #20c997",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//   }

//   // Modal styles
//   const modalOverlayStyle = {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100vw",
//     height: "100vh",
//     backgroundColor: "rgba(0, 0, 0, 0.6)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//     backdropFilter: "blur(4px)",
//   }

//   const modalStyle = {
//     backgroundColor: "white",
//     padding: "32px",
//     borderRadius: "20px",
//     boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
//     textAlign: "center",
//     width: "90%",
//     maxWidth: "450px",
//     border: "1px solid #e0f0ed",
//   }

//   const modalMessageStyle = {
//     fontSize: "1.25rem",
//     marginBottom: "32px",
//     color: "#333",
//     lineHeight: "1.6",
//     textAlign: "right",
//   }

//   const modalButtonContainerStyle = {
//     display: "flex",
//     justifyContent: "space-between",
//     gap: "16px",
//   }

//   const confirmButtonStyle = {
//     backgroundColor: "#20c997",
//     color: "white",
//     padding: "12px 24px",
//     borderRadius: "12px",
//     border: "none",
//     cursor: "pointer",
//     fontSize: "1.125rem",
//     fontWeight: "600",
//     flex: 1,
//     transition: "all 0.3s ease",
//   }

//   const confirmButtonHoverStyle = {
//     backgroundColor: "#1db386",
//     transform: "translateY(-1px)",
//   }

//   const cancelButtonStyle = {
//     backgroundColor: "#6b7280",
//     color: "white",
//     padding: "12px 24px",
//     borderRadius: "12px",
//     border: "none",
//     cursor: "pointer",
//     fontSize: "1.125rem",
//     fontWeight: "600",
//     flex: 1,
//     transition: "all 0.3s ease",
//   }

//   const cancelButtonHoverStyle = {
//     backgroundColor: "#4b5563",
//     transform: "translateY(-1px)",
//   }

//   return (
//     <>
//       <Navbar />
//       <div style={mainContainerStyle}>
//         <Sidebar />
//         <div style={contentContainerStyle}>
//           <h1 style={titleStyle}>جميع طلبات الجدولة</h1>

//           {error && <div style={errorMessageStyle}>{error}</div>}

//           <div style={mainCardStyle}>
//             {loading ? (
//               <div style={loadingStyle}>
//                 <div style={spinnerStyle}></div>
//                 جاري تحميل الطلبات...
//               </div>
//             ) : requests.length === 0 ? (
//               <div style={emptyStateStyle}>
//                 <span style={{ fontSize: "3rem" }}>📅</span>
//                 <span>لا يوجد طلبات جدولة حالياً</span>
//                 <span style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
//                   ستظهر هنا جميع طلبات الجدولة الجديدة من الطلاب
//                 </span>
//               </div>
//             ) : (
//               requests.map((request) => (
//                 <div
//                   key={request.id}
//                   style={requestCardStyle}
//                   onMouseEnter={(e) => {
//                     Object.assign(e.currentTarget.style, requestCardHoverStyle)
//                   }}
//                   onMouseLeave={(e) => {
//                     Object.assign(e.currentTarget.style, requestCardStyle)
//                   }}
//                 >
//                   <div style={requestInfoStyle}>
//                     <p style={requestNameStyle}>👤 {request.fullName}</p>
//                     <p style={requestDetailsStyle}>
//                       <span style={{ fontWeight: "500" }}>📅 الأيام:</span> {request.days} -{" "}
//                       <span style={{ fontWeight: "500" }}>⏰ الساعة:</span> {request.time}
//                     </p>
//                     <p style={requestDetailsStyle}>
//                       <span style={{ fontWeight: "500" }}>⏱️ المدة:</span> {request.duration}
//                     </p>
//                   </div>
//                   <div style={buttonContainerStyle}>
//                     <button
//                       onClick={() => openConfirmationModal("accept", request.id, request.fullName)}
//                       style={acceptButtonStyle}
//                       onMouseEnter={(e) => Object.assign(e.target.style, acceptButtonHoverStyle)}
//                       onMouseLeave={(e) => Object.assign(e.target.style, acceptButtonStyle)}
//                     >
//                       <span>✅</span> قبول
//                     </button>
//                     <button
//                       onClick={() => openConfirmationModal("reject", request.id, request.fullName)}
//                       style={rejectButtonStyle}
//                       onMouseEnter={(e) => Object.assign(e.target.style, rejectButtonHoverStyle)}
//                       onMouseLeave={(e) => Object.assign(e.target.style, rejectButtonStyle)}
//                     >
//                       <span>❌</span> رفض
//                     </button>
//                     <button
//                       onClick={() => openConfirmationModal("delete", request.id, request.fullName)}
//                       style={deleteButtonStyle}
//                       onMouseEnter={(e) => Object.assign(e.target.style, deleteButtonHoverStyle)}
//                       onMouseLeave={(e) => Object.assign(e.target.style, deleteButtonStyle)}
//                     >
//                       <span>🗑️</span> حذف
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       {showModal && (
//         <div style={modalOverlayStyle}>
//           <div style={modalStyle}>
//             <p style={modalMessageStyle}>{getModalMessage()}</p>
//             <div style={modalButtonContainerStyle}>
//               <button
//                 onClick={confirmAction}
//                 style={confirmButtonStyle}
//                 onMouseEnter={(e) => Object.assign(e.target.style, confirmButtonHoverStyle)}
//                 onMouseLeave={(e) => Object.assign(e.target.style, confirmButtonStyle)}
//               >
//                 نعم، متأكد
//               </button>
//               <button
//                 onClick={closeModal}
//                 style={cancelButtonStyle}
//                 onMouseEnter={(e) => Object.assign(e.target.style, cancelButtonHoverStyle)}
//                 onMouseLeave={(e) => Object.assign(e.target.style, cancelButtonStyle)}
//               >
//                 لا، إلغاء
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>
//         {`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>
//     </>
//   )
// }

// export default ScheduleRequests
/******************************************************************************************* */
// import React, { useState, useEffect } from 'react';
// import Sidebar from '../Components/Sidebar';
// import Navbar from "../Components/DashboardNavbar";
// import { useNavigate } from 'react-router-dom'; 

// const API_BASE_URL = "http://localhost:8000/api/v1/teacher"; 

// const ScheduleRequests = () => {
//   const navigate = useNavigate(); 
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedAction, setSelectedAction] = useState(null);
//   const [selectedId, setSelectedId] = useState(null);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         setError("❌ الرجاء تسجيل الدخول أولاً");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         const response = await fetch(`${API_BASE_URL}/get_schedules_requests`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`, 
//             'Accept': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             localStorage.removeItem("access_token");
//             setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//             setTimeout(() => {
//               navigate("/login");
//             }, 1000);
//             return;
//           }
//           throw new Error("فشل في جلب الطلبات");
//         }

//         const result = await response.json();
//         console.log("Schedule requests response:", result);
//         if (result?.data?.data) {
//           setRequests(result.data.data);
//         } else {
//           setRequests([]);
//         }
//       } catch (error) {
//         setError("❌ حدث خطأ أثناء جلب الطلبات: " + error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, [navigate]);

//   const handleAction = async (id, action) => {
//     const url = `${API_BASE_URL}/${action}_schedule/${id}`;
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         setError("❌ الرجاء تسجيل الدخول أولاً");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }

//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       console.log(`${action} schedule response:`, result);
//       if (response.ok) {
//         setRequests(prev => prev.filter(request => request.id !== id));
//         setError(null);
//       } else {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token");
//           setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
//         setError(`❌ خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
//       setError(`❌ فشل العملية: ${error.message}`);
//     }
//   };

//   const handleDelete = async (id) => {
//     const url = `${API_BASE_URL}/delete_schedule/${id}`;
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         setError("❌ الرجاء تسجيل الدخول أولاً");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }

//       const response = await fetch(url, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       console.log("Delete schedule response:", result);
//       if (response.ok) {
//         setRequests(prev => prev.filter(request => request.id !== id));
//         setError(null);
//       } else {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token");
//           setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
//         setError(`❌ خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
//       setError(`❌ فشل العملية: ${error.message}`);
//     }
//   };

//   const openModal = (id, action) => {
//     setSelectedId(id);
//     setSelectedAction(action);
//     setShowModal(true);
//   };

//   const confirmAction = () => {
//     if (selectedAction === 'delete') {
//       handleDelete(selectedId);
//     } else {
//       handleAction(selectedId, selectedAction);
//     }
//     setShowModal(false);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedId(null);
//     setSelectedAction(null);
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
//         <Sidebar />
//         <div style={{ marginRight: '220px', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
//           <h1 style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '20px' }}>جميع طلبات الجدولة</h1>

//           {error && (
//             <p style={{ textAlign: 'center', color: 'red', marginBottom: '15px' }}>{error}</p>
//           )}

//           <div style={{ backgroundColor: '#F2F8F6', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
//             {loading ? (
//               <p style={{ textAlign: 'center', padding: '20px', fontSize: '18px', fontWeight: 'bold', color: '#777' }}>
//                 جاري تحميل الطلبات...
//               </p>
//             ) : requests.length === 0 ? (
//               <p style={{ textAlign: 'center', padding: '20px', fontSize: '18px', fontWeight: 'bold', color: '#777' }}>
//                 لا يوجد طلبات جدولة حالياً
//               </p>
//             ) : (
//               requests.map((request) => (
//                 <div key={request.id} style={{
//                   backgroundColor: '#E9F3F1', borderRadius: '8px', padding: '15px', marginBottom: '15px',
//                   display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                   boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)'
//                 }}>
//                   <div>
//                     <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{request.fullName}</p>
//                     <p style={{ margin: '5px 0' }}>الأيام: {request.days} - الساعة: {request.time}</p>
//                     <p style={{ margin: 0 }}>المدة: {request.duration}</p>
//                   </div>
//                   <div style={{ display: 'flex', gap: '10px' }}>
//                     <button onClick={() => openModal(request.id, 'accept')} style={{ backgroundColor: '#1EC8A0', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>قبول</button>
//                     <button onClick={() => openModal(request.id, 'reject')} style={{ backgroundColor: '#FF4C4C', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>رفض</button>
//                     <button onClick={() => openModal(request.id, 'delete')} style={{ backgroundColor: '#777', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>

//       {showModal && (
//         <div style={{
//           position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
//         }}>
//           <div style={{
//             backgroundColor: '#fff', padding: '20px', borderRadius: '10px', textAlign: 'center', width: '300px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
//           }}>
//             <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
//               هل أنت متأكد من {selectedAction === 'accept' ? 'قبول' : selectedAction === 'reject' ? 'رفض' : 'حذف'} هذا الطلب؟
//             </p>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
//               <button onClick={confirmAction} style={{ backgroundColor: '#1EC8A0', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>نعم</button>
//               <button onClick={closeModal} style={{ backgroundColor: '#FF4C4C', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>لا</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ScheduleRequests;
/************************************************************************************** */
// import React, { useState, useEffect } from 'react';
// import Sidebar from '../Components/Sidebar';
// import Navbar from "../Components/DashboardNavbar";
// import { useNavigate } from 'react-router-dom'; 

// const API_BASE_URL = "http://localhost:8000/api/v1/teacher"; 

// const ScheduleRequests = () => {
//   const navigate = useNavigate(); 
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
        
//         setError("❌ الرجاء تسجيل الدخول أولاً");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         const response = await fetch(`${API_BASE_URL}/get_schedules_requests`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`, 
//             'Accept': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             localStorage.removeItem("access_token");
            
//             setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//             setTimeout(() => {
//               navigate("/login");
//             }, 1000);
//             return;
//           }
//           throw new Error("فشل في جلب الطلبات");
//         }

//         const result = await response.json();
//         console.log("Schedule requests response:", result); // Debug
//         if (result?.data?.data) {
//           setRequests(result.data.data);
//         } else {
//           setRequests([]);
//         }
//       } catch (error) {
        
//         setError("❌ حدث خطأ أثناء جلب الطلبات: " + error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, [navigate]);

  
//   const handleAction = async (id, action) => {
//     const url = `${API_BASE_URL}/${action}_schedule/${id}`;
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
        
//         setError("❌ الرجاء تسجيل الدخول أولاً");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }

//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       console.log(`${action} schedule response:`, result); // Debug
//       if (response.ok) {
        
//         setRequests(prev => prev.filter(request => request.id !== id));
//         setError(null);
//       } else {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token");
          
//           setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
        
//         setError(`❌ خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
      
//       setError(`❌ فشل العملية: ${error.message}`);
//     }
//   };

  
//   const handleDelete = async (id) => {
//     const url = `${API_BASE_URL}/delete_schedule/${id}`;
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
        
//         setError("❌ الرجاء تسجيل الدخول أولاً");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//         return;
//       }

//       const response = await fetch(url, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       console.log("Delete schedule response:", result); // Debug
//       if (response.ok) {
        
//         setRequests(prev => prev.filter(request => request.id !== id));
//         setError(null);
//       } else {
//         if (response.status === 401) {
//           localStorage.removeItem("access_token");
          
//           setError("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//           setTimeout(() => {
//             navigate("/login");
//           }, 1000);
//           return;
//         }
        
//         setError(`❌ خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
      
//       setError(`❌ فشل العملية: ${error.message}`);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
//         <Sidebar />
//         <div style={{ marginRight: '220px', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
//           <h1 style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '20px' }}>جميع طلبات الجدولة</h1>

//           {error && (
//             <p style={{ textAlign: 'center', color: 'red', marginBottom: '15px' }}>{error}</p>
//           )}

//           <div style={{ backgroundColor: '#F2F8F6', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
//             {loading ? (
//               <p style={{ textAlign: 'center', padding: '20px', fontSize: '18px', fontWeight: 'bold', color: '#777' }}>
//                 جاري تحميل الطلبات...
//               </p>
//             ) : requests.length === 0 ? (
//               <p style={{ textAlign: 'center', padding: '20px', fontSize: '18px', fontWeight: 'bold', color: '#777' }}>
//                 لا يوجد طلبات جدولة حالياً
//               </p>
//             ) : (
//               requests.map((request) => (
//                 <div key={request.id} style={{
//                   backgroundColor: '#E9F3F1', borderRadius: '8px', padding: '15px', marginBottom: '15px',
//                   display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                   boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)'
//                 }}>
//                   <div>
//                     <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{request.fullName}</p>
//                     <p style={{ margin: '5px 0' }}>الأيام: {request.days} - الساعة: {request.time}</p>
//                     <p style={{ margin: 0 }}>المدة: {request.duration}</p>
//                   </div>
//                   <div style={{ display: 'flex', gap: '10px' }}>
//                     <button onClick={() => handleAction(request.id, 'accept')} style={{ backgroundColor: '#1EC8A0', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>قبول</button>
//                     <button onClick={() => handleAction(request.id, 'reject')} style={{ backgroundColor: '#FF4C4C', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>رفض</button>
//                     <button onClick={() => handleDelete(request.id)} style={{ backgroundColor: '#777', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ScheduleRequests;
/**************************************************************************************************** */

// /******************    Fetch initial requests (mocked for now)   ******************** */
// import React, { useState, useEffect } from 'react';
// import Sidebar from '../Components/Sidebar';
// import Navbar from "../Components/DashboardNavbar";

// const API_BASE_URL = "http://localhost:8000/api/v1/teacher";
// const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTE5Nzg2OCwiZXhwIjoxNzQxMjAxNDY4LCJuYmYiOjE3NDExOTc4NjgsImp0aSI6Ik5kd25EUmt4cmtDR2JyOGQiLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.LoF7Iemws58Uot87sWDVHmbP4diTjIDx9JKgM2Vs1A4";

// const ScheduleRequests = () => {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     // Fetch initial requests (mocked for now)
//     setRequests([
//       { id: 1, name: 'أحمد علي', days: 'السبت والثلاثاء', time: '7:00 مساءً', duration: '45 دقيقة' },
//       { id: 2, name: 'سارة خالد', days: 'الإثنين والخميس', time: '5:00 مساءً', duration: '60 دقيقة' },
//       { id: 3, name: 'عمر حامد', days: 'الأربعاء والجمعة', time: '6:00 مساءً', duration: '30 دقيقة' },
//     ]);
//   }, []);

//   const handleAction = async (id, action) => {
//     const url = `${API_BASE_URL}/${action}_schedule/${id}`;
//     try {
//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${ACCESS_TOKEN}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert(`تم ${action === 'accept' ? 'قبول' : 'رفض'} الطلب بنجاح`);
//         setRequests(prev => prev.filter(request => request.id !== id));
//       } else {
//         alert(`خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
//       alert(`فشل العملية: ${error.message}`);
//     }
//   };

//   const handleDelete = async (id) => {
//     const url = `${API_BASE_URL}/delete_schedule/${id}`;
//     try {
//       const response = await fetch(url, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${ACCESS_TOKEN}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert('تم حذف الطلب بنجاح');
//         setRequests(prev => prev.filter(request => request.id !== id));
//       } else {
//         alert(`خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
//       alert(`فشل العملية: ${error.message}`);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
//         <Sidebar />
//         <div style={{ marginRight: '220px', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
//           <h1 style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '20px' }}>جميع طلبات الجدولة</h1>
//           <div style={{ backgroundColor: '#F2F8F6', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
//             {requests.map((request) => (
//               <div key={request.id} style={{
//                 backgroundColor: '#E9F3F1', borderRadius: '8px', padding: '15px', marginBottom: '15px',
//                 display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                 boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)'
//               }}>
//                 <div>
//                   <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{request.fullName}</p>
//                   <p style={{ margin: '5px 0' }}>الأيام: {request.days} - الساعة: {request.time}</p>
//                   <p style={{ margin: 0 }}>المدة: {request.duration}</p>
//                 </div>
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                   <button onClick={() => handleAction(request.id, 'accept')} style={{ backgroundColor: '#1EC8A0', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>قبول</button>
//                   <button onClick={() => handleAction(request.id, 'reject')} style={{ backgroundColor: '#FF4C4C', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>رفض</button>
//                   <button onClick={() => handleDelete(request.id)} style={{ backgroundColor: '#777', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ScheduleRequests;
/************************************************************************ */

/******************wooooooooooooooooooooooooooooooo************************ */
// import React, { useState, useEffect } from 'react';
// import Sidebar from '../Components/Sidebar';
// import Navbar from "../Components/DashboardNavbar";

// const API_BASE_URL = "http://localhost:8000/api/v1/teacher";
// const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTE5ODUxMCwiZXhwIjoxNzQxMjAyMTEwLCJuYmYiOjE3NDExOTg1MTAsImp0aSI6ImtmeDd3VjBnM1dQbkZVS1ciLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.q3yJqpLf_zGs3RbgIl6cLY0ly-7O37XmoxrPFgTCmZQ";

// const ScheduleRequests = () => {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     // Fetch initial requests (mocked for now)
//     setRequests([
//       { id: 1, name: 'أحمد علي', days: 'السبت والثلاثاء', time: '7:00 مساءً', duration: '45 دقيقة' },
//       { id: 2, name: 'سارة خالد', days: 'الإثنين والخميس', time: '5:00 مساءً', duration: '60 دقيقة' },
//       { id: 3, name: 'عمر حامد', days: 'الأربعاء والجمعة', time: '6:00 مساءً', duration: '30 دقيقة' },
//     ]);
//   }, []);

//   const handleAction = async (id, action) => {
//     const url = `${API_BASE_URL}/${action}_schedule/${id}`;
//     try {
//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${ACCESS_TOKEN}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert(`تم ${action === 'accept' ? 'قبول' : 'رفض'} الطلب بنجاح`);
//         setRequests(prev => prev.filter(request => request.id !== id));
//       } else {
//         alert(`خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
//       alert(`فشل العملية: ${error.message}`);
//     }
//   };

//   const handleDelete = async (id) => {
//     const url = `${API_BASE_URL}/delete_schedule/${id}`;
//     try {
//       const response = await fetch(url, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${ACCESS_TOKEN}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert('تم حذف الطلب بنجاح');
//         setRequests(prev => prev.filter(request => request.id !== id));
//       } else {
//         alert(`خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
//       alert(`فشل العملية: ${error.message}`);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
//         <Sidebar />
//         <div style={{ marginRight: '220px', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
//           <h1 style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '20px' }}>جميع طلبات الجدولة</h1>
//           <div style={{ backgroundColor: '#F2F8F6', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
//             {requests.length === 0 ? (
//               <p style={{ textAlign: 'center', padding: '20px', fontSize: '18px', fontWeight: 'bold', color: '#777' }}>
//                 لا يوجد طلبات جدولة حالياً
//               </p>
//             ) : (
//               requests.map((request) => (
//                 <div key={request.id} style={{
//                   backgroundColor: '#E9F3F1', borderRadius: '8px', padding: '15px', marginBottom: '15px',
//                   display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                   boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)'
//                 }}>
//                   <div>
//                     <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{request.fullName}</p>
//                     <p style={{ margin: '5px 0' }}>الأيام: {request.days} - الساعة: {request.time}</p>
//                     <p style={{ margin: 0 }}>المدة: {request.duration}</p>
//                   </div>
//                   <div style={{ display: 'flex', gap: '10px' }}>
//                     <button onClick={() => handleAction(request.id, 'accept')} style={{ backgroundColor: '#1EC8A0', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>قبول</button>
//                     <button onClick={() => handleAction(request.id, 'reject')} style={{ backgroundColor: '#FF4C4C', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>رفض</button>
//                     <button onClick={() => handleDelete(request.id)} style={{ backgroundColor: '#777', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ScheduleRequests;


// /******************    Fetching Actual Requests   ******************** */
// import React, { useState, useEffect } from 'react';
// import Sidebar from '../Components/Sidebar';
// import Navbar from "../Components/DashboardNavbar";

// const API_BASE_URL = "http://localhost:8000/api/v1/teacher";
// const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTE5NjI1NiwiZXhwIjoxNzQxMTk5ODU2LCJuYmYiOjE3NDExOTYyNTYsImp0aSI6IjRTV1RTMXljaUZGUjBqRnYiLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.4IfVRRYEKg4URh5T_8Kw5F1fxlzDmC_bca_HfodUe8U";

// const ScheduleRequests = () => {
//   const [requests, setRequests] = useState([]);
  
//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/schedule_requests`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${ACCESS_TOKEN}`,
//           'Accept': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch schedule requests");
//       }

//       const data = await response.json();
//       setRequests(data.requests || []); // تأكدي أن المفتاح الصحيح هو "requests"
//     } catch (error) {
//       console.error("Error fetching schedule requests:", error);
//     }
//   };

//   const handleAction = async (id, action) => {
//     const url = `${API_BASE_URL}/${action}_schedule/${id}`;
//     try {
//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${ACCESS_TOKEN}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert(`تم ${action === 'accept' ? 'قبول' : 'رفض'} الطلب بنجاح`);
//         fetchRequests(); // تحديث القائمة بعد الإجراء
//       } else {
//         alert(`خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
//       alert(`فشل العملية: ${error.message}`);
//     }
//   };

//   const handleDelete = async (id) => {
//     const url = `${API_BASE_URL}/delete_schedule/${id}`;
//     try {
//       const response = await fetch(url, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${ACCESS_TOKEN}`,
//           'Accept': 'application/json',
//         },
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert('تم حذف الطلب بنجاح');
//         fetchRequests(); // تحديث القائمة بعد الحذف
//       } else {
//         alert(`خطأ: ${result.message || 'حدث خطأ ما'}`);
//       }
//     } catch (error) {
//       alert(`فشل العملية: ${error.message}`);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={{ display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
//         <Sidebar />
//         <div style={{ marginRight: '220px', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
//           <h1 style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '20px' }}>جميع طلبات الجدولة</h1>
//           <div style={{ backgroundColor: '#F2F8F6', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
//             {requests.length > 0 ? (
//               requests.map((request) => (
//                 <div key={request.id} style={{
//                   backgroundColor: '#E9F3F1', borderRadius: '8px', padding: '15px', marginBottom: '15px',
//                   display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                   boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)'
//                 }}>
//                   <div>
//                     <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{request.student_name || "مجهول"}</p>
//                     <p style={{ margin: '5px 0' }}>الأيام: {request.days?.join(", ") || "غير محدد"} - الساعة: {request.time || "غير محددة"}</p>
//                     <p style={{ margin: 0 }}>المدة: {request.duration || "غير محددة"}</p>
//                   </div>
//                   <div style={{ display: 'flex', gap: '10px' }}>
//                     <button onClick={() => handleAction(request.id, 'accept')} style={{ backgroundColor: '#1EC8A0', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>قبول</button>
//                     <button onClick={() => handleAction(request.id, 'reject')} style={{ backgroundColor: '#FF4C4C', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>رفض</button>
//                     <button onClick={() => handleDelete(request.id)} style={{ backgroundColor: '#777', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>حذف</button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p style={{ textAlign: 'center', fontSize: '18px', color: '#555' }}>لا توجد طلبات جدولة حالياً</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ScheduleRequests;

/**************************************************************** */

// import React from 'react';
// import Sidebar from '../Components/Sidebar';
// import Navbar from "../Components/DashboardNavbar";

// const ScheduleRequests = () => {
//   const requests = [
//     { name: 'أحمد علي', days: 'السبت والثلاثاء', time: '7:00 مساءً', duration: '45 دقيقة' },
//     { name: 'سارة خالد', days: 'الإثنين والخميس', time: '5:00 مساءً', duration: '60 دقيقة' },
//     { name: 'عمر حامد', days: 'الأربعاء والجمعة', time: '6:00 مساءً', duration: '30 دقيقة' },
//   ];

//   const handleAccept = (name) => alert(`تم قبول الطلب: ${name}`);
//   const handleReject = (name) => alert(`تم رفض الطلب: ${name}`);

//   const containerStyle = {
//     display: 'flex',
//     flexDirection: 'row-reverse', // Keep sidebar on the right
//     direction: 'rtl',
//   };

//   const mainContentStyle = {
//     marginRight: '220px', // Same as dashboard
//     padding: '20px',
//     width: '100%',
//     boxSizing: 'border-box',
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={containerStyle}>
//         <Sidebar />

//         <div style={mainContentStyle}>
//           <h1 style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '20px' }}>
//             جميع طلبات الجدولة
//           </h1>

//           <div style={{
//             backgroundColor: '#F2F8F6',
//             borderRadius: '10px',
//             padding: '20px',
//             boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//           }}>
//             {requests.map((request, index) => (
//               <div key={index} style={{
//                 backgroundColor: '#E9F3F1',
//                 borderRadius: '8px',
//                 padding: '15px',
//                 marginBottom: '15px',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
//               }}>
//                 <div>
//                   <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{request.fullName}</p>
//                   <p style={{ margin: '5px 0' }}>الأيام: {request.days} - الساعة: {request.time}</p>
//                   <p style={{ margin: 0 }}>المدة: {request.duration}</p>
//                 </div>
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                   <button onClick={() => handleAccept(request.fullName)} style={{
//                     backgroundColor: '#1EC8A0',
//                     color: '#fff',
//                     border: 'none',
//                     padding: '10px 20px',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                     fontWeight: 'bold',
//                   }}>
//                     قبول
//                   </button>
//                   <button onClick={() => handleReject(request.fullName)} style={{
//                     backgroundColor: '#FF4C4C',
//                     color: '#fff',
//                     border: 'none',
//                     padding: '10px 20px',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                     fontWeight: 'bold',
//                   }}>
//                     رفض
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ScheduleRequests;


/************************ Old ********************************/
// import React from 'react';
// import Sidebar from '../Components/Sidebar';
// import Navbar from "../Components/DashboardNavbar";

// const ScheduleRequests = () => {
//   const requests = [
//     { name: 'أحمد علي', days: 'السبت والثلاثاء', time: '7:00 مساءً', duration: '45 دقيقة' },
//     { name: 'سارة خالد', days: 'الإثنين والخميس', time: '5:00 مساءً', duration: '60 دقيقة' },
//     { name: 'عمر حامد', days: 'الأربعاء والجمعة', time: '6:00 مساءً', duration: '30 دقيقة' },
//   ];

//   const handleAccept = (name) => alert(`تم قبول الطلب: ${name}`);
//   const handleReject = (name) => alert(`تم رفض الطلب: ${name}`);

//   return (
//     <>
//            <h1 style={{
//             marginBottom: '20px',
//             fontWeight: 'bold',
//             display: 'flex',
//             justifyContent: 'right',
//             alignItems: 'flex-start',
//             paddingRight:'250px',
//             paddingTop:'12px'
//           }}>
//             جميع طلبات الجدولة
//           </h1>
//         <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
//       <Sidebar />
//       <div style={{ flexGrow: 1, paddingRight: '220px' }}>
        
//         <Navbar />
//         <div
//           style={{
//             direction: 'rtl',
//             padding: '20px',
//             marginTop: '20px',
//             backgroundColor: '#F9F9F9',
//             minHeight: '100vh',
//             boxSizing: 'border-box',
//           }}
//         > 
    
          
//           <div
//             style={{
//               backgroundColor: '#F2F8F6',
//               borderRadius: '10px',
//               padding: '20px',
//               boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//             }}
//           >
//             {requests.map((request, index) => (
//               <div
//                 key={index}
//                 style={{
//                   backgroundColor: '#E9F3F1',
//                   borderRadius: '8px',
//                   padding: '15px',
//                   marginBottom: '15px',
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
//                 }}
//               >
//                 <div>
//                   <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>{request.fullName}</p>
//                   <p style={{ margin: '5px 0' }}>الأيام: {request.days} - الساعة: {request.time}</p>
//                   <p style={{ margin: 0 }}>المدة: {request.duration}</p>
//                 </div>
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                   <button
//                     onClick={() => handleAccept(request.fullName)}
//                     style={{
//                       backgroundColor: '#1EC8A0',
//                       color: '#fff',
//                       border: 'none',
//                       padding: '10px 20px',
//                       borderRadius: '5px',
//                       cursor: 'pointer',
//                       fontWeight: 'bold',
//                     }}
//                   >
//                     قبول
//                   </button>
//                   <button
//                     onClick={() => handleReject(request.fullName)}
//                     style={{
//                       backgroundColor: '#FF4C4C',
//                       color: '#fff',
//                       border: 'none',
//                       padding: '10px 20px',
//                       borderRadius: '5px',
//                       cursor: 'pointer',
//                       fontWeight: 'bold',
//                     }}
//                   >
//                     رفض
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div></>

//   );
// };

// export default ScheduleRequests;
