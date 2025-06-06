import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, CalendarDays, User2, Calendar, Info, Video } from "lucide-react";
import Navbar from "../Components/DashboardNavbar";
import Sidebar from "../Components/StudentSidebar";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const statusMapping = {
    'published': 'منشور',
    'draft': 'مسودة',
    'pending': 'قيد الانتظار',
    'completed': 'مكتمل',
    'cancelled': 'ملغي'
  };

  const statusColors = {
    'published': '#1EC8A0',
    'draft': '#FFB800',
    'pending': '#FF6B6B',
    'completed': '#4CAF50',
    'cancelled': '#9E9E9E'
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`http://localhost:8000/api/v1/student/show_course/${courseId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        console.log('Course Data:', data.data);
        console.log('Course Status:', data.data?.status);
        console.log('Course Published:', data.data?.published);
        setCourse(data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 1024);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = `
    .course-link {
      transition: all 0.2s ease;
    }
    .course-link:hover {
      color: #1EC8A0 !important;
      transform: translateX(-2px);
    }
  `;

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Navbar />
        <div style={{ 
          display: "flex", 
          flexDirection: "row-reverse", 
          direction: "rtl",
          paddingTop: "80px"
        }}>
          {isSidebarOpen && <Sidebar />}
          <div style={{ 
            marginRight: isSidebarOpen ? "220px" : "0",
            width: "100%", 
            boxSizing: "border-box",
            padding: "0 20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <p>جارٍ تحميل بيانات الدورة...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Navbar />
        <div style={{ 
          display: "flex", 
          flexDirection: "row-reverse", 
          direction: "rtl",
          paddingTop: "80px"
        }}>
          {isSidebarOpen && <Sidebar />}
          <div style={{ 
            marginRight: isSidebarOpen ? "220px" : "0",
            width: "100%", 
            boxSizing: "border-box",
            padding: "0 20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "red"
          }}>
            <p>حدث خطأ: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Navbar />
        <div style={{ 
          display: "flex", 
          flexDirection: "row-reverse", 
          direction: "rtl",
          paddingTop: "80px"
        }}>
          {isSidebarOpen && <Sidebar />}
          <div style={{ 
            marginRight: isSidebarOpen ? "220px" : "0",
            width: "100%", 
            boxSizing: "border-box",
            padding: "0 20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <div>لم يتم العثور على الدورة</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Navbar />
      <div style={{ 
        display: "flex", 
        flexDirection: "row-reverse", 
        direction: "rtl",
        paddingTop: "80px"
      }}>
        {isSidebarOpen && <Sidebar />}
        <div style={{ 
          marginRight: isSidebarOpen ? "220px" : "0",
          width: "100%", 
          boxSizing: "border-box",
          padding: "0 20px",
          transition: "margin-right 0.3s ease"
        }}>
          <div style={{ direction: "rtl", padding: "20px" }}>
            {course ? (
              <>
                {/* Breadcrumb */}
                <div style={{ 
                  padding: "20px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#666"
                }}>
                  <Link 
                    to="/student-courses" 
                    className="course-link"
                    style={{ 
                      color: "#666",
                      textDecoration: "none",
                      fontSize: "16px",
                      fontWeight: "500"
                    }}
                  >
                    الدورات
                  </Link>
                  <ArrowLeft size={20} />
                  <span style={{ 
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#333"
                  }}>{course.title}</span>
                </div>

                {/* Course Header Section */}
                <div style={{ 
                  position: "relative",
                  marginBottom: "30px",
                }}>
                  {/* Course Image Container */}
                  <div style={{
                    position: "relative",
                    width: "100%",
                    height: "260px", 
                    overflow: "hidden",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" 
                  }}>
                    <img
                      src={course.image}
                      alt={course.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {/* Dark overlay */}
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)",
                    }} />

                    {/* Course info overlay */}
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      left: 0,
                      padding: "25px",
                      color: "#fff",
                    }}>
                      {/* Title */}
                      <h1 style={{ 
                        margin: "0 0 15px 0",
                        fontSize: "28px",
                        fontWeight: "bold",
                      }}>{course.title}</h1>

                      {/* Course meta info */}
                      <div style={{ 
                        display: "flex", 
                        gap: "25px",
                        alignItems: "center",
                        color: "rgba(255,255,255,0.9)",
                        fontSize: "16px",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            backgroundColor: "#EAF8F4",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            {course?.teacher?.teacherinfo?.profile_pic ? (
                              <img 
                                src={course.teacher.teacherinfo.profile_pic} 
                                alt="صورة المدرس"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover"
                                }}
                              />
                            ) : (
                              <User2 size={20} color="#1EC8A0" />
                            )}
                          </div>
                          <span>{course?.teacher?.teacherinfo?.fname} {course?.teacher?.teacherinfo?.lname || 'المدرس'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div style={{ 
                  display: "flex", 
                  gap: "20px",
                  padding: "0 0 30px 0"
                }}>
                  {/* Left Side - Main Content */}
                  <div style={{ flex: "1" }}>
                    {/* Tabs */}
                    <div style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "20px"
                    }}>
                      <button
                        onClick={() => setActiveTab("info")}
                        style={{
                          padding: "10px 20px",
                          border: "none",
                          borderRadius: "8px",
                          backgroundColor: activeTab === "info" ? "#1EC8A0" : "#fff",
                          color: activeTab === "info" ? "#fff" : "#333",
                          cursor: "pointer",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <Info size={18} />
                        معلومات الدورة
                      </button>
                      <button
                        onClick={() => setActiveTab("content")}
                        style={{
                          padding: "10px 20px",
                          border: "none",
                          borderRadius: "8px",
                          backgroundColor: activeTab === "content" ? "#1EC8A0" : "#fff",
                          color: activeTab === "content" ? "#fff" : "#333",
                          cursor: "pointer",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <Calendar size={18} />
                        محتوى الدورة
                      </button>
                    </div>

                    {/* Content Area */}
                    <div style={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      padding: "20px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                    }}>
                      {activeTab === "info" ? (
                        <>
                          {/* Course Description */}
                          <div style={{ marginBottom: "30px" }}>
                            <h3 style={{ marginBottom: "15px" }}>وصف الدورة</h3>
                            <p style={{ color: "#666", lineHeight: "1.6" }}>
                              {course?.description || 'لا يوجد وصف للدورة'}
                            </p>
                          </div>

                          {/* Course Basic Info */}
                          <div>
                            <h3 style={{ marginBottom: "15px" }}>معلومات أساسية</h3>
                            <div style={{ 
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "15px"
                            }}>
                              <div style={{
                                backgroundColor: "#f8f8f8",
                                padding: "15px",
                                borderRadius: "8px"
                              }}>
                                <div style={{ color: "#666", marginBottom: "5px" }}>المدرس</div>
                                <div style={{ 
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px"
                                }}>
                                  <div style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    backgroundColor: "#EAF8F4",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}>
                                    {course?.teacher?.teacherinfo?.profile_pic ? (
                                      <img 
                                        src={course.teacher.teacherinfo.profile_pic} 
                                        alt="صورة المدرس"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover"
                                        }}
                                      />
                                    ) : (
                                      <User2 size={24} color="#1EC8A0" />
                                    )}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: "500" }}>
                                      {course?.teacher?.teacherinfo?.fname} {course?.teacher?.teacherinfo?.lname || 'المدرس'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{
                                backgroundColor: "#f8f8f8",
                                padding: "15px",
                                borderRadius: "8px"
                              }}>
                                <div style={{ color: "#666", marginBottom: "5px" }}>التخصص</div>
                                <div style={{ fontWeight: "500" }}>
                                  {course?.teacher?.teacherinfo?.specialty || 'غير محدد'}
                                </div>
                              </div>
                              <div style={{
                                backgroundColor: "#f8f8f8",
                                padding: "15px",
                                borderRadius: "8px"
                              }}>
                                <div style={{ color: "#666", marginBottom: "5px" }}>تاريخ البدء</div>
                                <div style={{ fontWeight: "500" }}>{course?.created_at ? new Date(course.created_at).toLocaleDateString('ar-SA') : 'غير محدد'}</div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Course Content/Videos List */
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                          {/* Lessons List Header */}
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "5px"
                          }}>
                            <h3 style={{ 
                              margin: "0",
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#333"
                            }}>قائمة الدروس</h3>
                            <span style={{
                              backgroundColor: "#E6F7F2",
                              color: "#1EC8A0",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "14px"
                            }}>
                              {course?.videos?.length || 0} دروس
                            </span>
                          </div>

                          {/* Videos List */}
                          {course?.videos?.map((video, index) => (
                            <div 
                              key={video.id} 
                              onClick={() => navigate(`/course/${courseId}/video/${video.id}`)}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                padding: "15px",
                                backgroundColor: "#f8f8f8",
                                borderRadius: "8px",
                                cursor: "pointer",
                                position: "relative",
                                transition: "all 0.2s ease",
                                border: "1px solid transparent"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#fff";
                                e.currentTarget.style.border = "1px solid #1EC8A0";
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#f8f8f8";
                                e.currentTarget.style.border = "1px solid transparent";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              {/* Video Icon */}
                              <div style={{
                                position: "absolute",
                                top: "15px",
                                left: "15px",
                                zIndex: "1"
                              }}>
                                <Video size={20} color="#666" />
                              </div>

                              {/* Video Thumbnail */}
                              <div style={{
                                width: "120px",
                                height: "68px",
                                borderRadius: "8px",
                                overflow: "hidden",
                                marginLeft: "15px",
                                flexShrink: 0,
                                backgroundColor: "#eee"
                              }}>
                                <img 
                                  src={video.thumbnail || "https://placehold.co/120x68"}
                                  alt={video.title}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                  }}
                                />
                              </div>

                              {/* Content */}
                              <div style={{ 
                                display: "flex", 
                                flexDirection: "column", 
                                gap: "8px", 
                                flex: 1
                              }}>
                                <div style={{ 
                                  fontWeight: "500", 
                                  fontSize: "16px",
                                  color: "#333"
                                }}>{video.title}</div>
                                <div style={{ 
                                  display: "flex",
                                  gap: "15px",
                                  color: "#666",
                                  fontSize: "14px"
                                }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <Clock size={14} />
                                    <span>{video.duration || 'غير محدد'}</span>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <Calendar size={14} />
                                    <span>{video.created_at ? new Date(video.created_at).toLocaleDateString('ar-SA') : 'غير محدد'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Progress Card */}
                  <div style={{ 
                    width: "300px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    height: "fit-content",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                  }}>
                    <h3 style={{ 
                      margin: "0 0 20px 0",
                      fontSize: "18px",
                      fontWeight: "600"
                    }}>تقدمك في الدورة</h3>

                    {/* Progress Section */}
                    <div style={{
                      borderRadius: "10px",
                      padding: "3px",
                      marginBottom: "20px",
                    }}>
                      <div style={{ marginBottom: "0px" }}>
                      </div>
                    </div>

                    {/* Course Stats */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                      textAlign: "center",
                      marginBottom: "20px"
                    }}>
                      <div style={{
                        backgroundColor: "#f8f8f8",
                        padding: "15px",
                        borderRadius: "8px"
                      }}>
                        <div style={{ fontWeight: "bold", fontSize: "24px", color: "#1EC8A0" }}>
                          {course?.videos?.length || 0}
                        </div>
                        <div style={{ color: "#666", fontSize: "14px" }}>إجمالي الدروس</div>
                      </div>
                      <div style={{
                        backgroundColor: "#f8f8f8",
                        padding: "15px",
                        borderRadius: "8px"
                      }}>
                        <div style={{ fontWeight: "bold", fontSize: "24px", color: "#1EC8A0" }}>
                          {course?.videos?.length || 0}
                        </div>
                        <div style={{ color: "#666", fontSize: "14px" }}>دروس متاحة</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#1EC8A0",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}>
                      متابعة الدرس
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p>جارٍ تحميل بيانات الدورة...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage; 





