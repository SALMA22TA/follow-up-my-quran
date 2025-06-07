import { useState } from "react"
import { Upload, Video } from "lucide-react"
import Sidebar from "../Components/Sidebar"
import Navbar from "../Components/DashboardNavbar"
import { useParams, useNavigate } from "react-router-dom"

export default function UploadVideoPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [videoTitle, setVideoTitle] = useState("")
  const [videoFile, setVideoFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const handleUpload = (event) => {
    setVideoFile(event.target.files[0])
  }

  const handleSubmit = async () => {
    if (!videoFile || !videoTitle) {
      setMessage("❌ يرجى إدخال عنوان الفيديو واختيار ملف!")
      return
    }

    const token = localStorage.getItem("access_token")
    if (!token) {
      setMessage("❌ الرجاء تسجيل الدخول أولاً")
      setTimeout(() => {
        navigate("/login")
      }, 1000)
      return
    }

    setUploading(true)
    setMessage("")

    const formData = new FormData()
    formData.append("title", videoTitle)
    formData.append("video_path", videoFile)

    try {
      const response = await fetch(`http://localhost:8000/api/v1/teacher/upload_video/${courseId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const result = await response.json()
      console.log("Upload video response:", result)

      if (response.ok) {
        setMessage(`✅ تم رفع الفيديو بنجاح: ${result.data.title}`)
        setVideoTitle("")
        setVideoFile(null)
      } else {
        if (response.status === 401) {
          localStorage.removeItem("access_token")
          setMessage("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.")
          setTimeout(() => {
            navigate("/login")
          }, 1000)
          return
        }
        setMessage(`❌ فشل في رفع الفيديو: ${result.message}`)
      }
    } catch (error) {
      setMessage("❌ حدث خطأ أثناء رفع الفيديو")
      console.error("Error:", error)
    } finally {
      setUploading(false)
    }
  }

  // Enhanced styles following the mint green theme
  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f9f8",
    color: "#333",
    flexDirection: "row-reverse",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  }

  const mainStyle = {
    flex: 1,
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "right",
    minHeight: "100vh",
  }

  const cardStyle = {
    padding: "40px",
    width: "100%",
    maxWidth: "700px",
    boxShadow: "0 10px 25px rgba(32, 201, 151, 0.15)",
    borderRadius: "20px",
    border: "1px solid #e0f0ed",
    backgroundColor: "white",
    position: "relative",
    overflow: "hidden",
  }

  const decorativeStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #20c997, #1db386)",
    borderBottomRightRadius: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const decorativeIconStyle = {
    color: "white",
    marginTop: "20px",
    marginLeft: "20px",
  }

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "32px",
    textAlign: "center",
    color: "#20c997",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  }

  const inputStyle = {
    width: "100%",
    padding: "16px 20px",
    border: "1px solid #e0f0ed",
    borderRadius: "12px",
    textAlign: "right",
    marginBottom: "24px",
    fontSize: "1.125rem",
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

  const uploadBoxStyle = {
    width: "100%",
    padding: "60px 40px",
    border: videoFile ? "2px solid #20c997" : "2px dashed #c8e8e0",
    borderRadius: "16px",
    textAlign: "center",
    color: videoFile ? "#20c997" : "#666",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    backgroundColor: videoFile ? "#f0fdf4" : "#f9fffd",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  }

  const uploadBoxHoverStyle = {
    borderColor: "#20c997",
    backgroundColor: "#f0fdf4",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(32, 201, 151, 0.15)",
  }

  const uploadIconStyle = {
    color: videoFile ? "#20c997" : "#c8e8e0",
    marginBottom: "16px",
    transition: "color 0.3s ease",
  }

  const uploadTextStyle = {
    fontSize: "1.125rem",
    fontWeight: "500",
    color: videoFile ? "#20c997" : "#666",
  }

  const fileInfoStyle = {
    fontSize: "0.875rem",
    color: "#20c997",
    marginTop: "8px",
    fontWeight: "500",
  }

  const hiddenInputStyle = {
    display: "none",
  }

  const buttonStyle = {
    width: "100%",
    backgroundColor: uploading ? "#c8e8e0" : "#20c997",
    color: uploading ? "#8fbfb5" : "white",
    fontWeight: "600",
    padding: "18px",
    borderRadius: "12px",
    border: "none",
    cursor: uploading ? "not-allowed" : "pointer",
    fontSize: "1.125rem",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  }

  const buttonHoverStyle = {
    backgroundColor: "#1db386",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(32, 201, 151, 0.3)",
  }

  const messageStyle = {
    textAlign: "center",
    padding: "16px 20px",
    borderRadius: "10px",
    fontWeight: "500",
    marginTop: "20px",
  }

  const successMessageStyle = {
    ...messageStyle,
    backgroundColor: "#e8f5e8",
    color: "#20c997",
    border: "1px solid #c6f6d5",
  }

  const errorMessageStyle = {
    ...messageStyle,
    backgroundColor: "#fee",
    color: "#c53030",
    border: "1px solid #fed7d7",
  }

  const loadingSpinnerStyle = {
    width: "20px",
    height: "20px",
    border: "2px solid transparent",
    borderTop: "2px solid currentColor",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <Sidebar />
        <main style={mainStyle}>
          <div style={cardStyle}>
            <div style={decorativeStyle}>
              <Video size={24} style={decorativeIconStyle} />
            </div>

            <h1 style={titleStyle}>
              رفع فيديو جديد
              <Upload size={28} />
            </h1>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#444",
                  marginBottom: "8px",
                  textAlign: "right",
                }}
              >
                عنوان الفيديو
              </label>
              <input
                type="text"
                placeholder="أدخل عنوان الفيديو"
                style={inputStyle}
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#444",
                  marginBottom: "8px",
                  textAlign: "right",
                }}
              >
                ملف الفيديو
              </label>
              <label
                style={uploadBoxStyle}
                onMouseEnter={(e) => {
                  if (!videoFile) {
                    Object.assign(e.currentTarget.style, uploadBoxHoverStyle)
                  }
                }}
                onMouseLeave={(e) => {
                  if (!videoFile) {
                    Object.assign(e.currentTarget.style, uploadBoxStyle)
                  }
                }}
              >
                <Upload size={50} style={uploadIconStyle} />
                <span style={uploadTextStyle}>{videoFile ? "تم اختيار الملف بنجاح" : "اضغط هنا لرفع الفيديو"}</span>
                {videoFile && (
                  <div style={fileInfoStyle}>
                    <div>📹 {videoFile.name}</div>
                    <div>📊 {formatFileSize(videoFile.size)}</div>
                  </div>
                )}
                <input type="file" accept="video/*" style={hiddenInputStyle} onChange={handleUpload} />
              </label>
            </div>

            <button
              style={buttonStyle}
              onClick={handleSubmit}
              disabled={uploading}
              onMouseEnter={(e) => {
                if (!uploading) {
                  Object.assign(e.target.style, buttonHoverStyle)
                }
              }}
              onMouseLeave={(e) => {
                if (!uploading) {
                  Object.assign(e.target.style, buttonStyle)
                }
              }}
            >
              {uploading && <div style={loadingSpinnerStyle}></div>}
              {uploading ? "جارٍ الرفع..." : "أضف الفيديو"}
            </button>

            {message && <div style={message.includes("✅") ? successMessageStyle : errorMessageStyle}>{message}</div>}
          </div>
        </main>
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
/********************************************************************************** */
// import { useState } from "react";
// import { Upload } from "lucide-react";
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";
// import { useParams, useNavigate } from "react-router-dom"; // أضيفي useParams و useNavigate

// export default function UploadVideoPage() {
//     const { courseId } = useParams(); // جيبي الـ course ID من الـ URL
//     const navigate = useNavigate(); // للـ redirect لو فيه مشكلة
//     const [videoTitle, setVideoTitle] = useState("");
//     const [videoFile, setVideoFile] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const [message, setMessage] = useState(""); // لعرض رسائل النجاح أو الخطأ

    
//     const handleUpload = (event) => {
//         setVideoFile(event.target.files[0]);
//     };

//     const handleSubmit = async () => {
//         if (!videoFile || !videoTitle) {
//             setMessage("❌ يرجى إدخال عنوان الفيديو واختيار ملف!");
//             return;
//         }

//         const token = localStorage.getItem("access_token");
//         if (!token) {
//             setMessage("❌ الرجاء تسجيل الدخول أولاً");
//             setTimeout(() => {
//                 navigate("/login");
//             }, 1000);
//             return;
//         }

//         setUploading(true);
//         setMessage(""); // امسحي أي رسائل قديمة

//         const formData = new FormData();
//         formData.append("title", videoTitle);
//         formData.append("video_path", videoFile);

//         try {
//             const response = await fetch(`http://localhost:8000/api/v1/teacher/upload_video/${courseId}`, {
//                 method: "POST",
//                 headers: {
//                     "Accept": "application/json",
//                     "Authorization": `Bearer ${token}`, // استخدمي الـ token من localStorage
//                 },
//                 body: formData,
//             });

//             const result = await response.json();
//             console.log("Upload video response:", result); // Debug

//             if (response.ok) {
//                 setMessage(`✅ تم رفع الفيديو بنجاح: ${result.data.title}`);
//                 setVideoTitle("");
//                 setVideoFile(null);
//             } else {
//                 if (response.status === 401) {
//                     localStorage.removeItem("access_token");
//                     setMessage("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//                     setTimeout(() => {
//                         navigate("/login");
//                     }, 1000);
//                     return;
//                 }
//                 setMessage(`❌ فشل في رفع الفيديو: ${result.message}`);
//             }
//         } catch (error) {
//             setMessage("❌ حدث خطأ أثناء رفع الفيديو");
//             console.error("Error:", error);
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <>
//             <Navbar />
//             <div 

//             style={styles.container}>
//                 <Sidebar />
//                 <main 

//                 style={styles.main}>
//                     <div 

//                     style={styles.card}>
//                         <div 

//                         style={styles.decorative}></div>
//                         <h1 

//                         style={styles.title}>رفع فيديو جديد</h1>

//                         <input
//                             type="text"
//                             placeholder="عنوان الفيديو"
                            
//                             style={styles.input}
//                             value={videoTitle}
//                             onChange={(e) => setVideoTitle(e.target.value)}
//                         />

//                         <label 

//                         style={styles.uploadBox}>
//                             <Upload size={50} style={{ color: "#1EC8A0", marginBottom: "10px" }} />
//                             <span>{videoFile ? videoFile.name : "اضغط هنا لرفع الفيديو"}</span>
//                             <input type="file" accept="video/*" style={styles.hiddenInput} onChange={handleUpload} />
//                         </label>

//                         <button style={styles.button} onClick={handleSubmit} disabled={uploading}>
//                             {uploading ? "جارٍ الرفع..." : "أضف الفيديو"}
//                         </button>

//                         {message && (
//                             <p
//                                 style={{
//                                     textAlign: "center",
//                                     color: message.includes("✅") ? "green" : "red",
//                                     marginTop: "10px",
//                                 }}
//                             >
//                                 {message}
//                             </p>
//                         )}
//                     </div>
//                 </main>
//             </div>
//         </>
//     );
// }

// const styles = {
//     container: {
//         display: "flex",
//         height: "100vh",
//         backgroundColor: '#fff',
//         color: "#000",
//         flexDirection: "row-reverse",
//         fontFamily: "Tajawal",
//     },
//     main: {
//         flex: 1,
//         padding: "40px",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         textAlign: "right",
//     },
//     card: {
//         padding: "30px",
//         width: "100%",
//         maxWidth: "600px",
//         boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
//         borderRadius: "12px",
//         border: "1px solid #ddd",
//         backgroundColor: '#D5E7E1',
//         position: "relative",
//     },
//     decorative: {
//         position: "absolute",
//         top: "0",
//         left: "0",
//         width: "60px",
//         height: "60px",
//         backgroundColor: 'black',
//         borderBottomRightRadius: "100%",
//     },
//     title: {
//         fontSize: "24px",
//         fontWeight: "bold",
//         marginBottom: "20px",
//         textAlign: "center",
//         color: "#333",
//         fontFamily: "Tajawal",
//     },
//     input: {
//         width: "90%",
//         padding: "12px",
//         border: "1px solid #ccc",
//         borderRadius: "8px",
//         textAlign: "right",
//         marginBottom: "15px",
//         fontSize: "16px",
//         fontFamily: "Tajawal",
//     },
//     uploadBox: {
//         width: "77.5%",
//         padding: "50px",
//         border: "2px dashed #666",
//         borderRadius: "8px",
//         textAlign: "center",
//         color: "#444",
//         cursor: "pointer",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         marginBottom: "20px",
//         backgroundColor: "#f9f9f9",
//         fontFamily: "Tajawal",
//         marginLeft: "auto",
//     },
//     hiddenInput: {
//         display: "none",
//     },
//     button: {
//         width: "100%",
//         backgroundColor: "#1EC8A0",
//         color: "#fff",
//         fontWeight: "bold",
//         padding: "12px",
//         borderRadius: "8px",
//         border: "none",
//         cursor: "pointer",
//         fontSize: "16px",
//         fontFamily: "Tajawal",
//     },
// };
/**************************************************************************** */

// import { useState } from "react";
// // import { Link } from "react-router-dom";
// import { Upload } from "lucide-react";
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";

// export default function UploadVideoPage() {
//     // const [sidebarOpen, setSidebarOpen] = useState(true);
//     const [videoTitle, setVideoTitle] = useState("");
//     const [videoDescription, setVideoDescription] = useState("");
//     const [videoFile, setVideoFile] = useState(null);

//     const handleUpload = (event) => {
//         setVideoFile(event.target.files[0]);
//     };

//     const handleSubmit = () => {
//         if (videoFile) {
//             alert(`تم رفع الفيديو: ${videoTitle || "بدون عنوان"}`);
//             setVideoTitle("");
//             setVideoDescription("");
//             setVideoFile(null);
//         } else {
//             alert("يرجى اختيار فيديو قبل الإضافة!");
//         }
//     };

//     return (
//         <><Navbar /><div style={styles.container}>
//             {/* Sidebar */}
//             <Sidebar/>

//             {/* Main Content */}
//             <main style={styles.main}>
//                 <div style={styles.card}>
//                     <div style={styles.decorative}></div>
//                     <h1 style={styles.title}>رفع فيديو جديد</h1>

//                     <input
//                         type="text"
//                         placeholder="عنوان الفيديو"
//                         style={styles.input}
//                         value={videoTitle}
//                         onChange={(e) => setVideoTitle(e.target.value)}
//                     />

//                     <textarea
//                         placeholder="وصف الفيديو"
//                         style={styles.textarea}
//                         value={videoDescription}
//                         onChange={(e) => setVideoDescription(e.target.value)}
//                     ></textarea>

//                     <label style={styles.uploadBox}>
//                         <Upload size={50} style={{ color: "#1EC8A0", marginBottom: "10px" }} />
//                         <span>{videoFile ? videoFile.name : "اضغط هنا لرفع الفيديو"}</span>
//                         <input type="file" accept="video/*" style={styles.hiddenInput} onChange={handleUpload} />
//                     </label>

//                     <button style={styles.button} onClick={handleSubmit}>أضف الفيديو</button>
//                 </div>
//             </main>
//         </div></>
//     );
// }

// const styles = {
//     container: {
//         display: "flex",
//         height: "100vh",
//         backgroundColor: '#fff',
//         color: "#000",
//         flexDirection: "row-reverse",
//         fontFamily: "Tajawal",
//     },
//     main: {
//         flex: 1,
//         padding: "40px",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         textAlign: "right",
//     },
//     card: {
//         padding: "30px",
//         width: "100%",
//         maxWidth: "600px",
//         boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
//         borderRadius: "12px",
//         border: "1px solid #ddd",
//         // backgroundColor: "#fff",
//         backgroundColor: '#D5E7E1',
//         position: "relative",
//     },
//     decorative: {
//         position: "absolute",
//         top: "0",
//         left: "0",
//         width: "60px",
//         height: "60px",
//         backgroundColor: 'black',
//         borderBottomRightRadius: "100%",
//     },
//     title: {
//         fontSize: "24px",
//         fontWeight: "bold",
//         marginBottom: "20px",
//         textAlign: "center",
//         color: "#333",
//         fontFamily: "Tajawal",
//     },
//     input: {
//         width: "90%",
//         padding: "12px",
//         border: "1px solid #ccc",
//         borderRadius: "8px",
//         textAlign: "right",
//         marginBottom: "15px",
//         fontSize: "16px",
//         fontFamily: "Tajawal",
//     },
//     textarea: {
//         width: "90%",
//         padding: "12px",
//         border: "1px solid #ccc",
//         borderRadius: "8px",
//         textAlign: "right",
//         marginBottom: "15px",
//         fontSize: "16px",
//         resize: "none",
//         fontFamily: "Tajawal",
//     },
//     uploadBox: {
//         width: "77.5%",
//         padding: "50px",
//         border: "2px dashed #666",
//         borderRadius: "8px",
//         textAlign: "center",
//         color: "#444",
//         cursor: "pointer",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         marginBottom: "20px",
//         backgroundColor: "#f9f9f9",
//         fontFamily: "Tajawal",
//         marginLeft: "auto",
//     }
//     ,
//   hiddenInput: {
//         display: "none",
//     },
//     button: {
//         width: "100%",
//         // backgroundColor: "green",
//         backgroundColor: "#1EC8A0",
//         color: "#fff",
//         fontWeight: "bold",
//         padding: "12px",
//         borderRadius: "8px",
//         border: "none",
//         cursor: "pointer",
//         fontSize: "16px",
//         fontFamily: "Tajawal",
//     },
// };

