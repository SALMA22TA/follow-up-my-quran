import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Components/DashboardNavbar";
import Sidebar from "../Components/StudentSidebar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Calendar1, Calendar, Clock, User, CheckCircle, X } from "lucide-react";


const RequestSchedule = () => {


  const dashboardContainer = {
    display: "flex",
    flexDirection: "row-reverse",
    direction: "rtl",
  };
  
  const mainContent = {
    marginRight: "220px",
    padding: "20px",
    width: "100%",
    boxSizing: "border-box",
  };

  const [selectedDays, setSelectedDays] = useState([]);
  const [sessionTime, setSessionTime] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const timeInputRef = useRef(null);
  const durationInputRef = useRef(null);
  const dateFromRef = useRef(null);
  const dateToRef = useRef(null);
  const checkboxesRef = useRef([]);


  const location = useLocation();
  const teacher = location.state?.teacher || {
    name: "اسم الشيخ",
    specialty: "التخصص",
  };

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedSheikh, setSelectedSheikh] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dateError, setDateError] = useState("");

  const handleOpenConfirmation = (sheikhName) => {
    if (
      selectedDays.length === 0 ||
      !sessionTime ||
      !sessionDuration ||
      !dateFrom ||
      !dateTo
    ) {
      setErrorMessage("يرجى ملء جميع الحقول المطلوبة قبل إرسال الطلب.");
      return;
    }

    // Validate date range
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      setDateError("لا يمكن اختيار تاريخ بداية قبل اليوم");
      return;
    }

    if (startDate.toDateString() === today.toDateString()) {
      setDateError("لا يمكن اختيار تاريخ اليوم، يرجى اختيار تاريخ بداية من الغد");
      return;
    }

    if (endDate < startDate) {
      setDateError("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
      return;
    }

    setDateError("");
    setErrorMessage("");
    setSelectedSheikh(sheikhName);
    setShowConfirmation(true);
  };

  // const handleOpenConfirmation = (sheikhName) => {
  //   setSelectedSheikh(sheikhName);
  //   setShowConfirmation(true);
  // };


  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);


  const handleConfirmRequest = async () => {
    const cleanedDuration = sessionDuration.replace("دقيقة", "").trim();
    const studentId = localStorage.getItem("student_id");

    const dayTranslation = {
      "الأحد": "Sunday",
      "الإثنين": "Monday",
      "الثلاثاء": "Tuesday",
      "الأربعاء": "Wednesday",
      "الخميس": "Thursday",
      "الجمعة": "Friday",
      "السبت": "Saturday"
    };

    const englishDays = selectedDays.map(day => dayTranslation[day] || day);

    const payload = {
      teacher_id: teacher.id,
      days: englishDays,
      time: sessionTime,
      duration: cleanedDuration,
      start_date: dateFrom,
      end_date: dateTo,
      studentId: studentId,
    };

    try {
      const token = localStorage.getItem("access_token");
      console.log("Token from localStorage:", token);
      console.log("Sending payload:", payload);

      const response = await fetch("http://localhost:8000/api/v1/student/request_schedule", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Validation errors:", errorData.errors);
        alert("فشل في إرسال الطلب: " + JSON.stringify(errorData.errors));
        return;
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);
      setShowConfirmation(false);
      setShowSuccess(true);
      resetFormFields();


    } catch (error) {
      console.error("Error sending request:", error);
      alert("تعذر الاتصال بالخادم.");
    }
  };
  const resetFormFields = () => {
    setSelectedDays([]);
    setSessionTime("");
    setSessionDuration("");
    setDateFrom("");
    setDateTo("");
    checkboxesRef.current.forEach((checkbox) => {
      if (checkbox) checkbox.checked = false;
      if (checkbox) {
        checkbox.style.backgroundColor = "white";
        checkbox.style.backgroundImage = "none";
      }
    });
    
    if (timeInputRef.current) timeInputRef.current.value = "";
    if (durationInputRef.current) durationInputRef.current.value = "";
    if (dateFromRef.current) dateFromRef.current.value = "";
    if (dateToRef.current) dateToRef.current.value = "";

    checkboxesRef.current.forEach((checkbox) => {
      if (checkbox) checkbox.checked = false;
    });
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    resetFormFields();
  };





  return (
    <>
      <Navbar />
      <div style={dashboardContainer}>
        <Sidebar />

        <div style={mainContent}>
          <h1 style={{ marginBottom: "20px" }}>طلب جدول</h1>

          {/* Main Form Card */}
          <div
            style={{
              backgroundColor: "#EAF8F4",
              padding: "25px",
              borderRadius: "12px",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            {/* Sheikh Card */}


            <div
              style={{
                backgroundColor: "#E3F7F1",
                padding: "18px",
                borderRadius: "12px",
                marginBottom: "30px",
                display: "flex",
                alignItems: "center",
                direction: "rtl",
              }}
            >

              <div
                style={{
                  marginLeft: "12px",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#EAF8F4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {teacher.profileImg ? (
                  <img
                    src={teacher.profileImg}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <User size={24} color="#1EC8A0" />
                )}
              </div>

              {/* Text */}
              <div>
                <p style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
                  {teacher.name}
                </p>
                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                  {teacher.specialty}
                </p>
              </div>
            </div>




{/* Study Days */}
<div style={{ marginBottom: "20px" }}>
  <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
    <Calendar1 size={20} color="#1EC8A0" style={{ marginLeft: "8px" }} />
    <h3 style={{ margin: 0, marginLeft: "8px" }}>أيام الدراسة:</h3>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
      gap: "10px",
    }}
  >
    {[
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ].map((day, index) => (
      <label
        key={day}
        style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "8px" }}
      >
        <input
          type="checkbox"
          ref={(el) => (checkboxesRef.current[index] = el)} // 👈 store ref for each checkbox
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            width: "20px",
            height: "20px",
            border: "2px solid #1EC8A0",
            borderRadius: "6px",
            backgroundColor: "white",
            position: "relative",
            display: "inline-block",
            outline: "none",
            cursor: "pointer",
          }}
          onChange={(e) => {
            e.target.style.backgroundColor = e.target.checked ? "#1EC8A0" : "white";
            e.target.style.borderColor = e.target.checked ? "#1EC8A0" : "#1EC8A0";
            e.target.style.backgroundImage = e.target.checked
              ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='20 6 9 17 4 12' /%3E%3C/svg%3E")`
              : "none";
            e.target.style.backgroundRepeat = "no-repeat";
            e.target.style.backgroundPosition = "center";
            const isChecked = e.target.checked;
            const dayValue = day;
            setSelectedDays((prevDays) =>
              isChecked
                ? [...prevDays, dayValue]
                : prevDays.filter((d) => d !== dayValue)
            );
          }}
        />
        <span>{day}</span>
      </label>
    ))}
  </div>
</div>


            {/* Timing Selection */}
            <div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <Clock size={20} color="#1EC8A0" style={{ marginLeft: "8px" }} />
                <h3 style={{ margin: 0, marginLeft: "8px" }}>وقت الجلسة:</h3>

              </div>


              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {/* Duration */}
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <label style={{ fontSize: "14px" }}>مدة الجلسة</label>
                  <select
                    onChange={(e) => setSessionDuration(e.target.value)}
                    ref={durationInputRef}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      marginTop: "5px",
                    }}
                  >
                    <option>اختر المده</option>
                    <option>30 دقيقة</option>
                    <option>45 دقيقة</option>
                    <option>60 دقيقة</option>
                    <option>190 دقيقة</option>
                  </select>
                </div>

                {/* Time */}
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <label style={{ fontSize: "14px" }}>الوقت</label>
                  <input
                    type="time"
                    onChange={(e) => setSessionTime(e.target.value)}
                    ref={timeInputRef}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      marginTop: "5px",
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Study Period Section */}
            <div style={{ marginTop: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <Calendar size={20} color="#1EC8A0" style={{ marginLeft: "8px" }} />
                <h3 style={{ margin: 0, marginLeft: "8px" }}>فترة الدراسة:</h3>
              </div>

              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {/* From Date */}
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <label style={{ fontSize: "14px" }}>من</label>
                  <input
                    type="date"
                    onChange={(e) => setDateFrom(e.target.value)}
                    ref={dateFromRef}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      marginTop: "5px",
                    }}
                  />
                </div>

                {/* To Date */}
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <label style={{ fontSize: "14px" }}>إلى</label>
                  <input
                    type="date"
                    onChange={(e) => setDateTo(e.target.value)}
                    ref={dateToRef}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      marginTop: "5px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Note Box */}
            <div
              style={{
                backgroundColor: "#FFF8E6",
                border: "1px solid #FFE6A4",
                borderRadius: "10px",
                padding: "16px",
                marginTop: "25px",
                fontSize: "14px",
                color: "#4B4B4B",
                lineHeight: "1.6",
                position: "relative",
                width: "80%",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: "8px", color: "#E3A008" }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="none" viewBox="0 0 24 24" stroke="#E3A008" strokeWidth="2" style={{ marginLeft: "8px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 17h.01M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" />
                </svg>
                <strong>ملاحظة</strong>
              </div>
              سيتم إرسال الطلب إلى المعلم للموافقة عليه، يمكنك متابعة حالة الطلب من خلال صفحة "طلباتي".
            </div>

            {errorMessage && (
              <div style={{
                backgroundColor: "#FFE6E6",
                border: "1px solid #FFB3B3",
                padding: "12px",
                borderRadius: "8px",
                color: "#B00020",
                marginTop: "20px",
                textAlign: "center",
                fontSize: "14px",
                width: "81%"
              }}>
                {errorMessage}
              </div>
            )}

            {dateError && (
              <div style={{
                backgroundColor: "#FFE6E6",
                border: "1px solid #FFB3B3",
                padding: "12px",
                borderRadius: "8px",
                color: "#B00020",
                marginTop: "20px",
                textAlign: "center",
                fontSize: "14px",
                width: "81%"
              }}>
                {dateError}
              </div>
            )}

            {/* Submit Button */}
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <button
                style={{
                  backgroundColor: "#1EC8A0",
                  color: "white",
                  border: "none",
                  padding: "10px 30px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
                onClick={() => handleOpenConfirmation(teacher.name)}
              >
                إرسال الطلب
              </button>
            </div>

          </div>
        </div>
      </div>
      {showConfirmation && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "30px", borderRadius: "10px",
            maxWidth: "500px", textAlign: "center", direction: "rtl"
          }}>
            <h3 style={{ marginBottom: "20px" }}>تأكيد إرسال الطلب</h3>
            <p style={{ marginBottom: "30px" }}>
              هل أنت متأكد من رغبتك في إرسال طلب الجدولة هذا إلى  {selectedSheikh}؟
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
              <button
                style={{
                  backgroundColor: "#1EC8A0", color: "white", padding: "10px 20px",
                  border: "none", borderRadius: "5px"
                }}
                onClick={handleConfirmRequest}
              >
                نعم، إرسال الطلب
              </button>
              <button
                style={{
                  backgroundColor: "#f0f0f0", color: "#333", padding: "10px 20px",
                  border: "1px solid #ccc", borderRadius: "5px"
                }}
                onClick={() => setShowConfirmation(false)}
              >
                لا
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "500px",
              textAlign: "center",
              direction: "rtl",
            }}
          >

            <button
              onClick={() => {
                setShowSuccess(false);
                resetFormFields();
              }}
              style={{
                position: "absolute",
                top: "15px",
                left: "15px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              <X size={24} color="#888" />
            </button>


            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "20px",
                color: "#1EC8A0",
              }}
            >
              <CheckCircle size={32} />
              <h2 style={{ fontWeight: "bold", fontSize: "20px", margin: 0 }}>
                تم إرسال الطلب بنجاح
              </h2>
            </div>

            <p style={{ marginBottom: "30px" }}>تابع "طلباتي" لمعرفة حالة الطلب</p>

            <button
              style={{
                backgroundColor: "#1EC8A0",
                color: "white",
                padding: "10px 25px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => navigate("/student-requests")}
            >
              الذهاب إلى طلباتي
            </button>
          </div>
        </div>
      )}






    </>
  );
};



export default RequestSchedule;




