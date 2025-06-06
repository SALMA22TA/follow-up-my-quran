import React, { useState, useEffect } from "react";
import Navbar from "../Components/DashboardNavbar";
import Sidebar from "../Components/StudentSidebar";
import { User, Clock, FileText, Send, AlertCircle, X, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const StdExamQuestions = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [selected, setSelected] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'confirm', 'warning', 'result'
  const [showWarning, setShowWarning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`http://localhost:8000/api/v1/student/get_exam/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Transform questions and options
        const formattedExam = {
          ...response.data.data,
          questions: (response.data.data.questions || []).map(q => ({
            ...q,
            text: q.question_text,
            options: (q.choices || []).map(choice => choice.option_text)
          }))
        };
        setExam(formattedExam);
      } catch (err) {
        setExam(null);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const questions = exam?.questions || [];
  const totalQuestions = questions.length;
  const answeredCount = Object.values(selected).filter(v => v !== undefined && v !== null).length;
  const progress = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // Auto-hide warning after 3 seconds
  useEffect(() => {
    if (showWarning) {
      const timer = setTimeout(() => {
        setShowWarning(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWarning]);

  const handleSubmit = () => {
    if (answeredCount < totalQuestions) {
      setShowWarning(true);
    } else {
      setModalType('confirm');
      setShowModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      const token = localStorage.getItem("access_token");
      // Prepare answers as { question_id, option_id }
      const answers = Object.entries(selected).map(([qid, idx]) => {
        const question = exam.questions.find(q => q.id === Number(qid));
        const optionId = question && question.choices && question.choices[idx] ? question.choices[idx].id : null;
        return { question_id: Number(qid), option_id: optionId };
      }).filter(ans => ans.option_id !== null);

      console.log('Submitting answers:', answers, 'Total:', answers.length, 'Expected:', exam.questions.length);

      if (answers.length !== exam.questions.length) {
        setShowWarning(true);
        return;
      }
      const response = await axios.post("http://localhost:8000/api/v1/student/submit_exam", {
        exam_id: exam.id,
        answers,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.message); // Log success message
      setResult(response.data.data);
      setModalType('result');
    } catch (err) {
      setShowModal(false);
      setModalType(null);
      setShowWarning(true);
    }
  };

  // Sidebar minimize handler
  const handleMinimize = () => {
    setSidebarOpen(false);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 100 }}>جاري التحميل...</div>;
  }
  if (!exam) {
    return <div style={{ textAlign: 'center', marginTop: 100, color: 'red' }}>تعذر تحميل الامتحان</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "row-reverse", direction: "rtl", marginTop: 90 }}>
        {sidebarOpen && <Sidebar />}
        <div style={{
          marginRight: 120,
          width: "100%",
          boxSizing: "border-box",
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#fff',
          borderRadius: 18,
          minHeight: 400
        }}>
          {/* Exam Info Card */}
          <div style={{
            background: "#F8F8F8",
            border: "1.5px solid #B6F0DF",
            borderRadius: 14,
            boxShadow: "0 2px 8px rgba(30,200,160,0.07)",
            padding: 24,
            marginBottom: 32,
            minWidth: 650,
            maxWidth: 1200,
            marginLeft: 0,
            marginRight: 0
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#1EC8A0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10
                }}>
                  <FileText color="#fff" size={22} />
                </div>
                <div>
                  <div style={{ color: "#111", fontWeight: 800, fontSize: 22, marginBottom: 2 }}>{exam.title}</div>
                  <div style={{ color: "#888", fontSize: 15, marginBottom: 8 }}>امتحان</div>
                </div>
              </div>
              <div style={{ background: "#EAF8F4", color: "#1EC8A0", fontWeight: 700, fontSize: 15, borderRadius: 8, padding: "4px 18px", alignSelf: "flex-start" }}>نشط</div>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 10, color: "#666", fontSize: 15, alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <User size={18} color="#1EC8A0" />
                {exam.teacher?.teacherinfo?.profile_pic && (
                  <img
                    src={exam.teacher.teacherinfo.profile_pic}
                    alt="Teacher"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #1EC8A0",
                      marginRight: 4
                    }}
                  />
                )}
                <span style={{ color: "#009B72", fontWeight: 700 }}>الشيخ</span>
                {exam.teacher?.teacherinfo?.fname || ''} {exam.teacher?.teacherinfo?.lname || ''}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><FileText size={18} color="#1EC8A0" /> <span style={{ color: "#009B72", fontWeight: 700 }}>{totalQuestions}</span> سؤال</span>
            </div>
            <div style={{ marginTop: 18 }}>
              <div style={{ background: "#EAF8F4", borderRadius: 6, height: 7, width: "100%", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, background: "#1EC8A0", height: "100%", transition: "width 0.4s" }}></div>
              </div>
              <div style={{ color: "#1EC8A0", fontSize: 14, marginTop: 4, fontWeight: 700 }}>{progress}% <span style={{ color: "#009B72", fontWeight: 700, marginRight: 12 }}>{answeredCount}/{totalQuestions}</span></div>
            </div>
          </div>
          {/* Question Cards */}
          {questions.map((q, idx) => (
            <div key={q.id} style={{ background: "#F8F8F8", borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: "0 1px 4px rgba(30,200,160,0.05)", minWidth: 650, maxWidth: 1200, marginLeft: 0, marginRight: 0 }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#1EC8A0",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 18,
                  marginLeft: 14
                }}>
                  {idx + 1}
                </div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{q.text}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {q.options && q.options.map((opt, idx) => (
                  <label key={idx} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: selected[q.id] === idx ? "#EAF8F4" : "#F8FCFA", border: selected[q.id] === idx ? "2px solid #1EC8A0" : "1px solid #EAF8F4", borderRadius: 8, padding: "10px 16px", fontSize: 16, fontWeight: selected[q.id] === idx ? 700 : 400, color: selected[q.id] === idx ? "#009B72" : undefined }}>
                    <input type="radio" name={`q${q.id}`} style={{ accentColor: "#1EC8A0" }} checked={selected[q.id] === idx} onChange={() => setSelected({ ...selected, [q.id]: idx })} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 24, flexDirection: "column", alignItems: "center" }}>
            {showWarning && (
              <div style={{
                background: "#FFF1F1",
                border: "1px solid #FFE0E0",
                borderRadius: 8,
                padding: "12px 24px",
                marginBottom: 16,
                color: "#FF4D4D",
                fontWeight: 600,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <AlertCircle size={18} color="#FF4D4D" />
                يرجى الإجابة على جميع الأسئلة قبل تقديم الامتحان
              </div>
            )}
            <button
              style={{ background: "#1EC8A0", color: "#fff", border: "none", borderRadius: 8, padding: "12px 38px", fontWeight: 700, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
              onClick={handleSubmit}
            >
              تقديم الامتحان <Send size={20} style={{ marginRight: 4 }} />
            </button>
          </div>
          {/* Modal */}
          {showModal && modalType === 'warning' && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: '#fff',
                borderRadius: 12,
                padding: '32px 28px 24px 28px',
                minWidth: 350,
                maxWidth: 420,
                boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
                position: 'relative',
                textAlign: 'center',
                direction: 'rtl'
              }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    position: 'absolute',
                    left: 18,
                    top: 18,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 22
                  }}
                  aria-label="إغلاق"
                >
                  <X size={24} color="#888" />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
                  <AlertCircle size={26} color="#F5B800" style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 800, fontSize: 22, color: '#F5B800' }}>تنبيه</span>
                </div>
                <div style={{ color: '#444', fontSize: 16, marginBottom: 28, marginTop: 8 }}>
                  يرجى الإجابة على جميع الأسئلة قبل تقديم الامتحان
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button
                    style={{ background: '#1EC8A0', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                    onClick={() => setShowModal(false)}
                  >
                    حسناً
                  </button>
                </div>
              </div>
            </div>
          )}
          {showModal && modalType === 'confirm' && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: '#fff',
                borderRadius: 12,
                padding: '32px 28px 24px 28px',
                minWidth: 350,
                maxWidth: 420,
                boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
                position: 'relative',
                textAlign: 'center',
                direction: 'rtl'
              }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    position: 'absolute',
                    left: 18,
                    top: 18,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 22
                  }}
                  aria-label="إغلاق"
                >
                  <X size={24} color="#888" />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
                  <AlertCircle size={26} color="#F5B800" style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 800, fontSize: 22, color: '#009B72' }}>تأكيد تقديم الامتحان</span>
                </div>
                <div style={{ color: '#444', fontSize: 16, marginBottom: 28, marginTop: 8 }}>
                  هل أنت متأكد من رغبتك في تقديم الامتحان؟ لن تتمكن من تعديل إجاباتك بعد التقديم.
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button
                    style={{ background: '#1EC8A0', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                    onClick={handleConfirmSubmit}
                  >
                    نعم، تقديم الامتحان
                  </button>
                  <button
                    style={{ background: '#fff', color: '#1EC8A0', border: '1.5px solid #1EC8A0', borderRadius: 8, padding: '10px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
                    onClick={() => setShowModal(false)}
                  >
                    لا، العودة للاختبار
                  </button>
                </div>
              </div>
            </div>
          )}
          {showModal && modalType === 'result' && result && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: '#fff',
                borderRadius: 12,
                padding: '32px 28px 24px 28px',
                minWidth: 350,
                maxWidth: 420,
                boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
                position: 'relative',
                textAlign: 'center',
                direction: 'rtl'
              }}>
                <button
                  onClick={() => { 
                    setShowModal(false); 
                    setModalType(null);
                    setSelected({}); // Clear all selected answers
                  }}
                  style={{
                    position: 'absolute',
                    left: 18,
                    top: 18,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 22
                  }}
                  aria-label="إغلاق"
                >
                  <X size={24} color="#888" />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
                  <CheckCircle2 size={26} color="#1EC8A0" style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 800, fontSize: 22, color: '#009B72' }}>تم تقديم الامتحان بنجاح</span>
                </div>
                <div style={{ color: '#444', fontSize: 16, marginBottom: 18, marginTop: 8 }}>
                  نتيجتك في الامتحان:
                </div>
                <div style={{ background: '#EAF8F4', borderRadius: 10, padding: '18px 0', margin: '0 auto 18px auto', maxWidth: 220 }}>
                  <div style={{ fontWeight: 800, fontSize: 36, color: '#009B72' }}>{result.score}</div>
                  <div style={{ color: '#1EC8A0', fontWeight: 700, fontSize: 16 }}>
                    {Number(result.score.replace('%','')) >= 90 ? 'ممتاز! أحسنت' : Number(result.score.replace('%','')) >= 70 ? 'جيد جداً' : 'بحاجة لتحسين'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <Link
                    to="/student-exams"
                    style={{ 
                      background: '#1EC8A0', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: 8, 
                      padding: '10px 28px', 
                      fontWeight: 700, 
                      fontSize: 16, 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8,
                      textDecoration: 'none'
                    }}
                  >
                    العودة للاختبارات
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StdExamQuestions; 