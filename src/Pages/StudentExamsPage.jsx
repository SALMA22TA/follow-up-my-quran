import React, { useState, useEffect } from "react";
import { Filter, Search, CalendarDays, User, Clock, CheckCircle, Calendar, FileText, File, Lock } from "lucide-react";
import Navbar from "../Components/DashboardNavbar";
import Sidebar from "../Components/StudentSidebar";
import { Link } from 'react-router-dom';
import axios from "axios";

const TABS = [
  { label: "الاختبارات", value: "قادمة", icon: Calendar },
  { label: "الاختبارات المكتملة", value: "مكتملة", icon: CheckCircle },
];

const ICONS = {
  "قادمة": (color = "#1EC8A0") => <Calendar size={18} color={color} style={{marginLeft: 6}} />,
  "مكتملة": (color = "#1EC8A0") => <CheckCircle size={18} color={color} style={{marginLeft: 6}} />,
};

const EMPTY_ICONS = {
  "قادمة": (color = "#888") => <Calendar size={48} color={color} style={{marginBottom: 16}} />,
  "مكتملة": (color = "#888") => <CheckCircle size={48} color={color} style={{marginBottom: 16}} />,
};

const StudentExamsPage = () => {
  const [exams, setExams] = useState({
    available: [],
    completed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("قادمة");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("جميع الاختبارات");
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultDetails, setResultDetails] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Token not found");

      console.log("Fetching available exams...");
      // Fetch available exams
      const availableResponse = await axios.get('http://localhost:8000/api/v1/student/available_exams', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Available Exams Response:", availableResponse.data);
      
      console.log("Fetching completed exams...");
      // Fetch completed exams
      const completedResponse = await axios.get('http://localhost:8000/api/v1/student/completed_exams', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Completed Exams Response:", completedResponse.data);

      const formattedAvailableExams = availableResponse.data.data.map(exam => ({
        id: exam.id,
        title: exam.title,
        course: "دورة تجويد القرآن الكريم",
        date: exam.created_at ? new Date(exam.created_at).toLocaleDateString('ar-SA') : "تاريخ غير محدد",
        questions: exam.questions_count,
        status: "قادمة",
        teacher: exam.teacher.teacherinfo ? `${exam.teacher.teacherinfo.fname || ''} ${exam.teacher.teacherinfo.lname || ''}`.trim() || "المدرس" : "المدرس",
        teacherImage: exam.teacher.teacherinfo?.profile_pic || null
      }));

      // Remove duplicates from completed exams
      const uniqueCompletedExams = completedResponse.data.data.reduce((acc, exam) => {
        if (!acc.find(e => e.id === exam.id)) {
          acc.push(exam);
        }
        return acc;
      }, []);

      const formattedCompletedExams = uniqueCompletedExams.map(exam => ({
        id: exam.id,
        title: exam.title,
        course: "دورة تجويد القرآن الكريم",
        date: exam.created_at ? new Date(exam.created_at).toLocaleDateString('ar-SA') : "تاريخ غير محدد",
        questions: exam.questions_count,
        status: "مكتملة",
        teacher: exam.teacher.teacherinfo ? `${exam.teacher.teacherinfo.fname || ''} ${exam.teacher.teacherinfo.lname || ''}`.trim() || "المدرس" : "المدرس",
        teacherImage: exam.teacher.teacherinfo?.profile_pic || null,
        score: `${exam.pivot.score}%`,
        correct_answers: exam.pivot.correct_answers
      }));

      // Set both available and completed exams in a single state update
      setExams({
        available: formattedAvailableExams,
        completed: formattedCompletedExams
      });
    } catch (error) {
      console.error("Error fetching exams:", error);
      console.error("Error details:", error.response?.data || error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setSelectedFilter("جميع الاختبارات");
  };

  // Get current tab's exams
  const currentExams = activeTab === "قادمة" ? exams.available : exams.completed;

  // Get exam titles for filter options
  const examTitles = Array.from(new Set(currentExams.map(exam => exam.title)));

  // Filter exams based on search and filter
  const filteredExams = currentExams.filter((exam) => {
    const matchesSearch = searchTerm === "" ? true : 
      exam.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "جميع الاختبارات" ? true : exam.title === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "row-reverse", direction: "rtl" }}>
        <Sidebar />
        <div style={{ marginRight: "200px", padding: "32px 40px", width: "100%", boxSizing: "border-box", marginTop: 16 }}>
          <style>
            {`
              .start-exam-btn {
                background: #1EC8A0;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 6px 18px;
                font-weight: 600;
                font-size: 15px;
                text-decoration: none;
                align-self: flex-end;
                transition: all 0.2s ease;
                cursor: pointer;
              }
              .start-exam-btn:hover {
                background: #1ab890;
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
            `}
          </style>
          <h1 style={{ color: "#111", margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>الاختبارات</h1>
          <p style={{ color: "#666", marginBottom: "32px", fontSize: 16, marginTop: 0, fontWeight: 400 }}>
            استعرض جميع الاختبارات المتاحة لك من الدورات المسجل بها
          </p>
          {/* Filter and Search */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                placeholder="ابحث عن اختبار..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "95%",
                  padding: "12px 35px 10px 10px",
                  borderRadius: "6px",
                  border: "1px solid #1EC8A0",
                }}
              />
              <Search size={18} style={{ position: "absolute", right: "10px", top: "12px", color: "#888" }} />
            </div>
            <div style={{ position: "relative", width: "180px" }}>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 10px 10px 30px",
                  paddingRight: "35px",
                  borderRadius: "6px",
                  border: "1px solid #1EC8A0",
                  appearance: "auto",
                  backgroundColor: "#fff",
                }}
              >
                <option>جميع الاختبارات</option>
                {examTitles.map((title, idx) => (
                  <option key={idx}>{title}</option>
                ))}
              </select>
              <Filter size={16} style={{ position: "absolute", right: "10px", top: "12px", color: "#888" }} />
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginBottom: "25px", width: "100%" }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.value;
              const color = isActive ? "#fff" : "#111";
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "8px",
                    backgroundColor: isActive ? "#1EC8A0" : "#EAF8F4",
                    color: color,
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    flex: 1,
                    fontSize: 16,
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={18} color={color} />
                  <span style={{ color }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
          {/* Exam Cards */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>جاري التحميل...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
              <p>حدث خطأ: {error}</p>
            </div>
          ) : filteredExams.length === 0 ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              backgroundColor: "#EAF8F4",
              borderRadius: "12px",
              marginTop: "20px"
            }}>
              {EMPTY_ICONS[activeTab]("#888")}
              <h3 style={{ margin: "0 0 10px 0", color: "#666" }}>
                {activeTab === "قادمة" ? "لا توجد اختبارات حالياً" : "لا توجد اختبارات مكتملة"}
              </h3>
              <p style={{ margin: 0, color: "#888", textAlign: "center" }}>
                {activeTab === "قادمة" 
                  ? "لم يتم العثور على اختبارات قادمة تطابق معايير البحث"
                  : "لم يتم العثور على اختبارات مكتملة تطابق معايير البحث"}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  style={{
                    background: "#EAF8F4",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "row-reverse",
                    alignItems: "stretch",
                    width: "100%",
                    minHeight: "120px",
                    position: "relative",
                    boxSizing: "border-box",
                    padding: 0,
                    justifyContent: "space-between"
                  }}
                >
                  {/* Right Side: Badge, Date, Score/Remaining, Button */}
                  <div style={{
                    minWidth: 180,
                    maxWidth: 220,
                    background: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    padding: "24px 24px 24px 16px"
                  }}>
                    <div style={{
                      backgroundColor: exam.status === "قادمة" ? "#2196F3" : "#1EC8A0",
                      color: "white",
                      padding: "4px 16px",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      fontSize: 13,
                      marginBottom: 12,
                      alignSelf: "flex-end"
                    }}>
                      {exam.status === "قادمة" ? "قادم" : "مكتمل"}
                    </div>
                    <div style={{ color: "#111", fontWeight: 600, fontSize: 15, marginBottom: 12, alignSelf: "flex-end" }}>{exam.date}</div>
                    <div style={{ color: "#1EC8A0", fontWeight: 700, fontSize: 15, marginBottom: 12, alignSelf: "flex-end" }}>
                      {/* Removed percentage above the result button */}
                    </div>
                    {exam.status === "قادمة" ? (
                      <Link
                        to={`/exam/${exam.id}/student-exams-ques`}
                        className="start-exam-btn"
                      >
                        بدء الاختبار
                      </Link>
                    ) : (
                      <button
                        style={{
                          background: "#eee",
                          color: "#666",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 18px",
                          fontWeight: 600,
                          fontSize: 15,
                          alignSelf: "flex-end",
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setResultDetails({
                            score: exam.score,
                            correct: exam.correct_answers,
                            total: exam.questions,
                          });
                          setShowResultModal(true);
                        }}
                      >
                        عرض النتيجة
                      </button>
                    )}
                  </div>
                  {/* Left Side: Exam Title and Details */}
                  <div style={{ flex: 1, padding: "24px 0 24px 32px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{
                        background: "#fff",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 16,
                        border: "2px solid #1EC8A0"
                      }}>
                        <FileText size={18} color="#1EC8A0" />
                      </span>
                      <span style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>{exam.title}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 24, color: "#666", fontSize: 15, alignSelf: "flex-start", marginRight: 40 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <File size={16} color="#888" />
                        {exam.questions} أسئلة
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <User size={16} color="#888" />
                       الشيخ {exam.teacher} 
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showResultModal && resultDetails && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', borderRadius: 12, minWidth: 320, padding: '32px 24px 24px 24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)', position: 'relative', textAlign: 'center'
          }}>
            <button
              onClick={() => setShowResultModal(false)}
              style={{ position: 'absolute', left: 16, top: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}
              aria-label="إغلاق"
            >×</button>
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>نتيجتك في الامتحان</h3>
            <div style={{ fontWeight: 800, fontSize: 36, color: '#009B72', marginBottom: 12 }}>{resultDetails.score}</div>
            <div style={{ fontSize: 18, color: '#222', marginBottom: 8 }}>
              عدد الإجابات الصحيحة: <span style={{ color: '#1EC8A0', fontWeight: 700 }}>{resultDetails.correct}</span>
            </div>
            <div style={{ fontSize: 18, color: '#222', marginBottom: 18 }}>
              عدد الأسئلة الكلي: <span style={{ color: '#1EC8A0', fontWeight: 700 }}>{resultDetails.total}</span>
            </div>
            <button
              onClick={() => setShowResultModal(false)}
              style={{
                background: '#1EC8A0', color: '#fff', border: 'none', borderRadius: 6,
                padding: '8px 28px', fontWeight: 600, fontSize: 16, cursor: 'pointer'
              }}
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentExamsPage;
