import { useState, useEffect } from "react"
import Sidebar from "../Components/Sidebar"
import Navbar from "../Components/DashboardNavbar"
import { Link } from "react-router-dom"

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCourses = async () => {
    setLoading(true)
    setError(null)

    try {
      const allCourses = []
      for (let i = 1; i <= 20; i++) {
        try {
          const response = await fetch(`https://graduation-main-0wwkv3.laravel.cloud/api/v1/teacher/get_course/${i}`, {
            headers: {
              Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTA0NTIxMSwiZXhwIjoxNzQxMDQ4ODExLCJuYmYiOjE3NDEwNDUyMTEsImp0aSI6InNzTzNXUHNuWkJtWXEzOWgiLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.AmgmNajuSFMk6yTFnJKo2r8vHENJsdnEawreeR-K3co`,
              Accept: "application/json",
            },
          })

          if (response.ok) {
            const data = await response.json()
            if (data && data.data) {
              allCourses.push(data.data)
            }
          }
        } catch (error) {
          console.log(`No course found with ID ${i}`)
        }
      }

      if (allCourses.length > 0) {
        setCourses(allCourses)
        setError(null)
      } else {
        setError("لم يتم العثور على أي دورات")
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
      setError("فشل في تحميل الدورات. الرجاء المحاولة مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handlePublish = (id) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) => (course.id === id ? { ...course, status: "منشور" } : course))
    )
  }

  const handleRefresh = () => {
    fetchCourses()
  }

  return (
    <>
      <Navbar />
      <div style={dashboardContainer}>
        <Sidebar />
        <div style={mainContent}>
          <h1>قائمة الدورات</h1>
          
          {error ? (
            <div style={errorStyle}>
              {error}
              <button onClick={handleRefresh} style={retryButtonStyle}>
                إعادة المحاولة
              </button>
            </div>
          ) : loading ? (
            <p>جارٍ تحميل البيانات...</p>
          ) : (
            <>
              <div style={tableContainerStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr style={tableHeaderRowStyle}>
                      <th style={tableHeaderCellStyle}>العنوان</th>
                      <th style={tableHeaderCellStyle}>الوصف</th>
                      <th style={tableHeaderCellStyle}>الحالة</th>
                      <th style={tableHeaderCellStyle}>نشر؟</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <tr key={course.id || Math.random()} style={tableRowStyle}>
                          <td style={tableCellStyle}>{course.title || "بدون عنوان"}</td>
                          <td style={tableCellStyle}>{course.description || "بدون وصف"}</td>
                          <td style={tableCellStyle}>{course.status || "غير منشور"}</td>
                          <td style={tableCellStyle}>
                            <button
                              onClick={() => handlePublish(course.id)}
                              disabled={course.status === "منشور"}
                              style={{
                                ...publishButtonStyle,
                                backgroundColor: course.status === "منشور" ? "#ccc" : "#1EC8A0",
                                cursor: course.status === "منشور" ? "not-allowed" : "pointer",
                              }}
                            >
                              {course.status === "منشور" ? "نُشر" : "نشر"}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ ...tableCellStyle, textAlign: "center" }}>
                          لا توجد دورات متاحة
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button onClick={handleRefresh} style={refreshButtonStyle} disabled={loading}>
                  تحديث القائمة
                </button>
                <Link to="/add-course" style={addButtonStyle}>
                  + إضافة دورة جديدة
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

const dashboardContainer = {
  display: "flex",
  flexDirection: "row-reverse",
  direction: "rtl",
}

const mainContent = {
  marginRight: "220px",
  padding: "20px",
  width: "100%",
  boxSizing: "border-box",
}

const addButtonStyle = {
  backgroundColor: "#1EC8A0",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
  textDecoration: "none",
}

const refreshButtonStyle = {
  ...addButtonStyle,
  backgroundColor: "#6c757d",
}

const retryButtonStyle = {
  ...addButtonStyle,
  marginTop: "10px",
  fontSize: "14px",
  padding: "8px 12px",
}

const errorStyle = {
  backgroundColor: "#fff3f3",
  color: "#dc3545",
  padding: "15px",
  borderRadius: "5px",
  textAlign: "center",
  marginBottom: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}

const tableContainerStyle = {
  width: "100%",
  overflowX: "auto",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  padding: "15px",
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "right",
}

const tableHeaderRowStyle = {
  backgroundColor: "#f8f9fa",
}

const tableHeaderCellStyle = {
  padding: "12px",
  textAlign: "right",
  fontWeight: "bold",
  borderBottom: "2px solid #ddd",
}

const tableRowStyle = {
  borderBottom: "1px solid #ddd",
}

const tableCellStyle = {
  padding: "12px",
}

const publishButtonStyle = {
  color: "#fff",
  border: "none",
  padding: "7px 15px",
  borderRadius: "5px",
  fontWeight: "bold",
}

export default Courses

