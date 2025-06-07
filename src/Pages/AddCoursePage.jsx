import { useState } from "react"
import { PlusCircle } from "lucide-react"
import Sidebar from "../Components/Sidebar"
import Navbar from "../Components/DashboardNavbar"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function AddCoursePage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [coverImage, setCoverImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const API_URL = "http://localhost:8000/api/v1/teacher/"

  const handleAddCourse = async () => {
    setLoading(true)
    setMessage("")

    const token = localStorage.getItem("access_token")
    if (!token) {
      setMessage("❌ الرجاء تسجيل الدخول أولاً")
      setTimeout(() => {
        navigate("/login")
      }, 1000)
      setLoading(false)
      return
    }

    // Client-side validation
    if (!title.trim()) {
      setMessage("❌ الرجاء إدخال عنوان الدورة")
      setLoading(false)
      return
    }

    if (!description.trim()) {
      setMessage("❌ الرجاء إدخال وصف الدورة")
      setLoading(false)
      return
    }

    if (!coverImage) {
      setMessage("❌ الرجاء رفع صورة للدورة")
      setLoading(false)
      return
    }

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(coverImage.type)) {
      setMessage("❌ يجب أن تكون الصورة بصيغة JPG أو PNG")
      setLoading(false)
      return
    }

    if (coverImage.size > maxSize) {
      setMessage("❌ حجم الصورة يجب ألا يتجاوز 5 ميجابايت")
      setLoading(false)
      return
    }

    // Create FormData object to handle file upload
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("cover_image", coverImage)

    // Log FormData contents for debugging
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }

    try {
      const response = await axios.post(`${API_URL}create_course`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      })

      setMessage("✅ الدورة أضيفت بنجاح!")
      console.log("Response Data:", response.data)
      setTitle("")
      setDescription("")
      setCoverImage(null)
      setTimeout(() => {
        navigate("/courses")
      }, 1000)
    } catch (error) {
      console.error("Error:", error)

      if (error.response?.status === 401) {
        setMessage("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.")
        localStorage.removeItem("access_token")
        setTimeout(() => {
          navigate("/login")
        }, 1000)
      } else if (error.response?.status === 403) {
        setMessage("❌ ليس لديك الصلاحية لإضافة دورة.")
      } else {
        const errorMsg = error.response?.data?.message || "خطأ غير معروف"
        setMessage(`❌ فشل الإضافة: ${errorMsg}`)
      }
    } finally {
      setLoading(false)
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

  const headerStyle = {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    width: "100%",
    maxWidth: "700px",
    marginBottom: "24px",
  }

  const headerTitleStyle = {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#20c997",
    margin: 0,
  }

  const cardStyle = {
    padding: "32px",
    width: "100%",
    maxWidth: "700px",
    boxShadow: "0 10px 25px rgba(32, 201, 151, 0.15)",
    borderRadius: "16px",
    border: "1px solid #e0f0ed",
    backgroundColor: "white",
  }

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "24px",
    color: "#20c997",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    gap: "8px",
  }

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  }

  const fieldContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  }

  const labelStyle = {
    display: "block",
    fontWeight: "600",
    fontSize: "1rem",
    color: "#444",
    textAlign: "right",
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #e0f0ed",
    borderRadius: "10px",
    textAlign: "right",
    fontSize: "1rem",
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

  const textareaStyle = {
    ...inputStyle,
    minHeight: "120px",
    resize: "vertical",
    fontFamily: "inherit",
  }

  const fileInputStyle = {
    ...inputStyle,
    padding: "8px 12px",
    cursor: "pointer",
  }

  const buttonStyle = {
    width: "100%",
    backgroundColor: loading ? "#c8e8e0" : "#20c997",
    color: loading ? "#8fbfb5" : "white",
    fontWeight: "600",
    fontSize: "1.125rem",
    padding: "16px",
    borderRadius: "10px",
    border: "none",
    cursor: loading ? "not-allowed" : "pointer",
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
    padding: "12px 16px",
    borderRadius: "8px",
    fontWeight: "500",
    marginTop: "16px",
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

  const fileInfoStyle = {
    fontSize: "0.875rem",
    color: "#666",
    marginTop: "4px",
    textAlign: "right",
  }

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <Sidebar />
        <main style={mainStyle}>
          <div style={headerStyle}>
            <h1 style={headerTitleStyle}>إضافة دورة جديدة</h1>
          </div>
          <div style={cardStyle}>
            <h2 style={titleStyle}>
              إضافة دورة
              <PlusCircle size={24} />
            </h2>
            <div style={formStyle}>
              <div style={fieldContainerStyle}>
                <label style={labelStyle}>العنوان</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="أدخل عنوان الدورة"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </div>

              <div style={fieldContainerStyle}>
                <label style={labelStyle}>الوصف</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="أدخل وصف الدورة"
                  rows={4}
                  style={textareaStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, textareaStyle)}
                ></textarea>
              </div>

              <div style={fieldContainerStyle}>
                <label style={labelStyle}>صورة الدورة</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  style={fileInputStyle}
                />
                <div style={fileInfoStyle}>
                  الحد الأقصى: 5 ميجابايت | الصيغ المدعومة: JPG, PNG
                  {coverImage && (
                    <div style={{ marginTop: "8px", color: "#20c997", fontWeight: "500" }}>
                      ✅ تم اختيار الملف: {coverImage.name}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleAddCourse}
                style={buttonStyle}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    Object.assign(e.target.style, buttonHoverStyle)
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    Object.assign(e.target.style, buttonStyle)
                  }
                }}
              >
                {loading && <div style={loadingSpinnerStyle}></div>}
                {loading ? "جاري الإضافة..." : "إضافة الدورة"}
              </button>

              {message && <div style={message.includes("✅") ? successMessageStyle : errorMessageStyle}>{message}</div>}
            </div>
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
/******************************************************************************************* */
// import { useState } from "react";
// import { PlusCircle } from "lucide-react";
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function AddCoursePage() {
//   const navigate = useNavigate();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [coverImage, setCoverImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const API_URL = "http://localhost:8000/api/v1/teacher/";

//   const handleAddCourse = async () => {
//     setLoading(true);
//     setMessage("");

//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setMessage("❌ الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       setLoading(false);
//       return;
//     }

//     // Client-side validation
//     if (!title.trim()) {
//       setMessage("❌ الرجاء إدخال عنوان الدورة");
//       setLoading(false);
//       return;
//     }

//     if (!description.trim()) {
//       setMessage("❌ الرجاء إدخال وصف الدورة");
//       setLoading(false);
//       return;
//     }

//     if (!coverImage) {
//       setMessage("❌ الرجاء رفع صورة للدورة");
//       setLoading(false);
//       return;
//     }

//     // Validate file type and size
//     const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//     const maxSize = 5 * 1024 * 1024; // 5MB
    
//     if (!allowedTypes.includes(coverImage.type)) {
//       setMessage("❌ يجب أن تكون الصورة بصيغة JPG أو PNG");
//       setLoading(false);
//       return;
//     }
    
//     if (coverImage.size > maxSize) {
//       setMessage("❌ حجم الصورة يجب ألا يتجاوز 5 ميجابايت");
//       setLoading(false);
//       return;
//     }

//     // Create FormData object to handle file upload
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("cover_image", coverImage);

//     // Log FormData contents for debugging
    
//     for (let [key, value] of formData.entries()) {
//       console.log(`${key}:`, value);
//     }

//     try {
//       const response = await axios.post(`${API_URL}create_course`, formData, {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Accept": "application/json",
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setMessage("✅ الدورة أضيفت بنجاح!");
//       console.log("Response Data:", response.data);
//       setTitle("");
//       setDescription("");
//       setCoverImage(null);
//       setTimeout(() => {
//         navigate("/courses");
//       }, 1000);
//     } catch (error) {
//       console.error("Error:", error);

      
//       if (error.response?.status === 401) {
//         setMessage("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//         localStorage.removeItem("access_token");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
      
//       } else if (error.response?.status === 403) {
//         setMessage("❌ ليس لديك الصلاحية لإضافة دورة.");
//       } else {
        
//         const errorMsg = error.response?.data?.message || "خطأ غير معروف";
//         setMessage(`❌ فشل الإضافة: ${errorMsg}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div 

//       style={styles.container}>
//         <Sidebar />
//         <main 

//         style={styles.main}>
//           <div style={styles.header}>
//             <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>إضافة دورة جديدة</h1>
//           </div>
//           <div style={styles.card}>
//             <h2 style={styles.title}>
//               إضافة دورة <PlusCircle style={{ marginLeft: "8px" }} />
//             </h2>
//             <div 

//             style={styles.form}>
//               <div>
//                 <label style={styles.label}>العنوان</label>
//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="أدخل عنوان الدورة"
                  
//                   style={styles.input}
//                 />
//               </div>
//               <div>
//                 <label style={styles.label}>الوصف</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="أدخل وصف الدورة"
//                   rows={4}
                  
//                   style={styles.input}
//                 ></textarea>
//               </div>
//               <div>
//                 <label style={styles.label}>صورة الدورة</label>
//                 <input
//                   type="file"
//                   accept="image/jpeg,image/png,image/jpg"
                  
//                   onChange={(e) => setCoverImage(e.target.files[0])}
                  
//                   style={styles.input}
//                 />
//               </div>
//               <button
//                 onClick={handleAddCourse}
//                 style={styles.button}
//                 disabled={loading}
//               >
//                 {loading ? "جاري الإضافة..." : "إضافة الدورة"}
//               </button>
//               {message && (
//                 <p
//                   style={{
//                     textAlign: "center",
//                     color: message.includes("✅") ? "green" : "red",
//                   }}
//                 >
//                   {message}
//                 </p>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }

// const styles = {
//   container: {
//     display: "flex",
//     height: "100vh",
//     backgroundColor: "#fff",
//     color: "#000",
//     flexDirection: "row-reverse",
//     fontFamily: "Tajawal",
//   },
//   main: {
//     flex: 1,
//     padding: "40px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     textAlign: "right",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "end",
//     alignItems: "center",
//     width: "100%",
//     maxWidth: "600px",
//     marginBottom: "20px",
//   },
//   card: {
//     padding: "30px",
//     width: "100%",
//     maxWidth: "600px",
//     boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
//     borderRadius: "12px",
//     border: "1px solid #ddd",
//     backgroundColor: "#D5E7E1",
//   },
//   title: {
//     fontSize: "20px",
//     fontWeight: "bold",
//     marginBottom: "20px",
//     color: "rgb(30, 200, 160)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "end",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "15px",
//   },
//   label: {
//     display: "block",
//     fontWeight: "700",
//     marginBottom: "5px",
//   },
//   input: {
//     width: "90%",
//     padding: "10px",
//     border: "1px solid #ccc",
//     borderRadius: "8px",
//     textAlign: "right",
//     fontFamily: "Tajawal",
//   },
//   button: {
//     width: "100%",
//     backgroundColor: "#1EC8A0",
//     color: "#fff",
//     fontWeight: "bold",
//     padding: "12px",
//     borderRadius: "8px",
//     border: "none",
//     cursor: "pointer",
//   },
// };
/******************************************************************************* */
// import { useState } from "react";
// import { PlusCircle } from "lucide-react";
// import Sidebar from "../Components/Sidebar";
// import Navbar from "../Components/DashboardNavbar";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function AddCoursePage() {
//   const navigate = useNavigate();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const API_URL = "http://localhost:8000/api/v1/teacher/";

//   const handleAddCourse = async () => {
//     setLoading(true);
//     setMessage("");

//     const token = localStorage.getItem("access_token");
//     if (!token) {
//       setMessage("❌ الرجاء تسجيل الدخول أولاً");
//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${API_URL}create_course`,
//         { title, description },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//             "Accept": "application/json",
//           },
//         }
//       );

//       setMessage("✅ الدورة أضيفت بنجاح!");
//       console.log("Response Data:", response.data);
//       setTitle("");
//       setDescription("");
//       setTimeout(() => {
//         navigate("/courses");
//       }, 1000);
//     } catch (error) {
//       console.error("Error:", error);

//       if (error.response?.status === 401) {
//         setMessage("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
//         localStorage.removeItem("access_token");
//         setTimeout(() => {
//           navigate("/login");
//         }, 1000);
//       } else if (error.response?.status === 403) {
//         setMessage("❌ ليس لديك الصلاحية لإضافة دورة.");
//       } else {
//         setMessage(`❌ فشل الإضافة: ${error.response?.data?.message || "خطأ غير معروف"}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={styles.container}>
//         <Sidebar />
//         <main style={styles.main}>
//           <div style={styles.header}>
//             <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>إضافة دورة جديدة</h1>
//           </div>
//           <div style={styles.card}>
//             <h2 style={styles.title}>
//               إضافة دورة <PlusCircle style={{ marginLeft: "8px" }} />
//             </h2>
//             <div style={styles.form}>
//               <div>
//                 <label style={styles.label}>العنوان</label>
//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="أدخل عنوان الدورة"
//                   style={styles.input}
//                 />
//               </div>
//               <div>
//                 <label style={styles.label}>الوصف</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="أدخل وصف الدورة"
//                   rows={4}
//                   style={styles.input}
//                 ></textarea>
//               </div>
//               <button
//                 onClick={handleAddCourse}
//                 style={styles.button}
//                 disabled={loading}
//               >
//                 {loading ? "جاري الإضافة..." : "إضافة الدورة"}
//               </button>
//               {message && (
//                 <p
//                   style={{
//                     textAlign: "center",
//                     color: message.includes("✅") ? "green" : "red",
//                   }}
//                 >
//                   {message}
//                 </p>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }

// const styles = {
//   container: {
//     display: "flex",
//     height: "100vh",
//     backgroundColor: "#fff",
//     color: "#000",
//     flexDirection: "row-reverse",
//     fontFamily: "Tajawal",
//   },
//   main: {
//     flex: 1,
//     padding: "40px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     textAlign: "right",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "end",
//     alignItems: "center",
//     width: "100%",
//     maxWidth: "600px",
//     marginBottom: "20px",
//   },
//   card: {
//     padding: "30px",
//     width: "100%",
//     maxWidth: "600px",
//     boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
//     borderRadius: "12px",
//     border: "1px solid #ddd",
//     backgroundColor: "#D5E7E1",
//   },
//   title: {
//     fontSize: "20px",
//     fontWeight: "bold",
//     marginBottom: "20px",
//     color: "rgb(30, 200, 160)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "end",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "15px",
//   },
//   label: {
//     display: "block",
//     fontWeight: "700",
//     marginBottom: "5px",
//   },
//   input: {
//     width: "90%",
//     padding: "10px",
//     border: "1px solid #ccc",
//     borderRadius: "8px",
//     textAlign: "right",
//     fontFamily: "Tajawal",
//   },
//   button: {
//     width: "100%",
//     backgroundColor: "#1EC8A0",
//     color: "#fff",
//     fontWeight: "bold",
//     padding: "12px",
//     borderRadius: "8px",
//     border: "none",
//     cursor: "pointer",
//   },
// };