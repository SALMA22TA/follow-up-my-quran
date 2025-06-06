import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, CalendarDays, BookOpen, User2, PlayCircle, Share2, MessageCircle, Save } from "lucide-react";
import Navbar from "../Components/DashboardNavbar";
import Sidebar from "../Components/StudentSidebar";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const VideoDetailsPage = () => {
  const { courseId, videoId } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [videoDuration, setVideoDuration] = useState("0:00");

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 1024);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`http://localhost:8000/api/v1/student/get_video/${videoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        console.log("Video Data:", response.data.data);
        console.log("Related Videos:", response.data.data.related_videos);
        console.log("Current Video ID:", videoId);
        setVideoData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching video data:", error);
        setError("Failed to load video data. Please try again later.");
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  // Handle saving notes
  const handleSaveNotes = () => {
    setIsSaving(true);
    // Simulate API call to save notes
    setTimeout(() => {
      setIsSaving(false);
      // Here you would typically make an API call to save the notes
      console.log("Notes saved:", notes);
    }, 1000);
  };

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
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <div style={{
              width: "32px",
              height: "32px",
              border: "3px solid #f3f3f3",
              borderTop: "3px solid #1EC8A0",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
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
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "red"
          }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!videoData) {
    return null;
  }

  // Get the current video's index in related videos
  const currentVideoIndex = videoData.related_videos.findIndex(video => video.id === parseInt(videoId));
  const lessonNumber = currentVideoIndex !== -1 ? currentVideoIndex + 1 : 1;

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
          padding: "20px",
          transition: "margin-right 0.3s ease"
        }}>
          {/* Breadcrumb */}
          <div style={{ 
            padding: "20px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#666"
          }}>
            <Link 
              to={`/course/${courseId}`}
              className="course-link"
              style={{ 
                color: "#666",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#1EC8A0";
                e.currentTarget.style.transform = "translateX(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#666";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              {videoData.video.course.title}
              <ArrowLeft size={20} />
            </Link>
            <span style={{ color: "#333", fontWeight: "500" }}>{videoData.video.title}</span>
          </div>

          <div style={{ 
            display: "flex", 
            gap: "20px",
            flexDirection: window.innerWidth < 768 ? "column" : "row"
          }}>
            {/* Main Content */}
            <div style={{ 
              flex: 1,
              minWidth: window.innerWidth < 768 ? "100%" : "0"
            }}>
              {/* Video Title and Metadata Section */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}>
                {/* Title */}
                <h1 style={{ 
                  margin: "0 0 15px 0",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#333"
                }}>{videoData.video.title}</h1>

                {/* Metadata and Badges */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  {/* Time and Date */}
                  <div style={{ 
                    display: "flex",
                    gap: "20px",
                    color: "#666",
                    fontSize: "14px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Clock size={16} />
                      <span>{videoDuration}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <CalendarDays size={16} />
                      <span>{new Date(videoData.video.created_at).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{
                      backgroundColor: "#F5F5F5",
                      color: "#666",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}>
                      {videoData.video.course.title}
                    </div>
                    <div style={{
                      backgroundColor: "#EAF8F4",
                      color: "#1EC8A0",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}>
                      الدرس {lessonNumber}
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Player Section */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}>
                <div style={{
                  width: "100%",
                  paddingTop: "56.25%",
                  position: "relative",
                  backgroundColor: "#000"
                }}>
                  <video
                    controls
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%"
                    }}
                    src={`http://localhost:8000/videos/${videoData.video.video_path.split('/').pop()}`}
                    onLoadedMetadata={(e) => {
                      const duration = e.target.duration;
                      const minutes = Math.floor(duration / 60);
                      const seconds = Math.floor(duration % 60);
                      setVideoDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Teacher Info Section */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "15px"
                }}>
                  <div style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    backgroundColor: "#EAF8F4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <User2 size={32} color="#1EC8A0" />
                  </div>
                  <div>
                    <h3 style={{ 
                      margin: "0 0 5px 0",
                      fontSize: "18px",
                      color: "#333"
                    }}>{videoData.video.course.teacher.teacherinfo.fname} {videoData.video.course.teacher.teacherinfo.lname}</h3>
                    <p style={{ 
                      margin: 0,
                      color: "#666"
                    }}>{videoData.video.course.teacher.teacherinfo.specialty}</p>
                  </div>
                </div>
                <p style={{ 
                  color: "#666",
                  lineHeight: "1.6",
                  margin: 0,
                  fontFamily: !videoData.video.course.description ? "Arial, sans-serif" : "inherit"
                }}>
                  {videoData.video.course.description || "لا يوجد وصف للمعلم"}
                </p>
              </div>

              {/* Tabs Section */}
              <div>
                {/* Tabs Header */}
                <div style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "20px"
                }}>
                  <button
                    onClick={() => setActiveTab("details")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "8px",
                      backgroundColor: activeTab === "details" ? "#1EC8A0" : "#fff",
                      color: activeTab === "details" ? "#fff" : "#333",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    <BookOpen size={18} />
                    تفاصيل الدرس
                  </button>
                  <button
                    onClick={() => setActiveTab("comments")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "8px",
                      backgroundColor: activeTab === "comments" ? "#1EC8A0" : "#fff",
                      color: activeTab === "comments" ? "#fff" : "#333",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    <MessageCircle size={18} />
                    التعليقات
                  </button>
                  <button
                    onClick={() => setActiveTab("notes")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "8px",
                      backgroundColor: activeTab === "notes" ? "#1EC8A0" : "#fff",
                      color: activeTab === "notes" ? "#fff" : "#333",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    <Save size={18} />
                    الملاحظات
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === "details" && (
                  <div style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "20px"
                  }}>
                    <div style={{ marginBottom: "20px" }}>
                      <h3 style={{ marginBottom: "15px" }}>وصف الدرس</h3>
                      <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "20px" }}>
                        {videoData.video.title}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "comments" && (
                  <div style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "20px"
                  }}>
                    <div style={{ 
                      display: "flex", 
                      flexDirection: "column",
                      gap: "20px"
                    }}>
                      <div style={{
                        padding: "20px",
                        backgroundColor: "#f8f8f8",
                        borderRadius: "8px",
                        textAlign: "center",
                        color: "#666"
                      }}>
                        لا توجد تعليقات حتى الآن
                      </div>
                      
                      <div>
                        <textarea
                          placeholder="أضف تعليقاً..."
                          style={{
                            width: "80%",
                            minHeight: "100px",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #eee",
                            resize: "vertical",
                            fontFamily: "inherit"
                          }}
                        />
                        <button style={{
                          marginTop: "10px",
                          padding: "8px 16px",
                          backgroundColor: "#1EC8A0",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}>
                          <MessageCircle size={18} />
                          إضافة تعليق
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notes" && (
                  <div style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "20px"
                  }}>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="اكتب ملاحظاتك هنا..."
                      style={{
                        width: "80%",
                        minHeight: "200px",
                        padding: "15px",
                        borderRadius: "8px",
                        border: "1px solid #eee",
                        resize: "vertical",
                        fontFamily: "inherit",
                        marginBottom: "15px"
                      }}
                    />
                    <button 
                      onClick={handleSaveNotes}
                      disabled={isSaving}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#1EC8A0",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        opacity: isSaving ? 0.7 : 1
                      }}
                    >
                      <Save size={18} />
                      {isSaving ? "جارٍ الحفظ..." : "حفظ الملاحظات"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Course Lessons */}
            <div style={{ 
              width: window.innerWidth < 768 ? "100%" : "300px",
              minWidth: window.innerWidth < 768 ? "100%" : "300px"
            }}>
              <div style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px"
                }}>
                  <BookOpen size={20} color="#1EC8A0" />
                  <h3 style={{ margin: 0, fontSize: "16px" }}>دروس الدورة</h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {videoData.related_videos.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      to={`/course/${courseId}/video/${lesson.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        textDecoration: "none",
                        color: lesson.id === parseInt(videoId) ? "#1EC8A0" : "#333",
                        backgroundColor: lesson.id === parseInt(videoId) ? "#EAF8F4" : "transparent",
                        borderRadius: "8px",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        if (lesson.id !== parseInt(videoId)) {
                          e.currentTarget.style.backgroundColor = "#f5f5f5";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (lesson.id !== parseInt(videoId)) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <PlayCircle size={20} color={lesson.id === parseInt(videoId) ? "#1EC8A0" : "#666"} />
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: "14px",
                          fontWeight: lesson.id === parseInt(videoId) ? "600" : "normal",
                          marginBottom: "4px"
                        }}>
                          {lesson.title}
                        </div>
                        <div style={{ 
                          fontSize: "12px",
                          color: "#666",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          <Clock size={12} />
                          الدرس {index + 1}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailsPage; 