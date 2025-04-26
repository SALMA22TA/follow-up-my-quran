import { useState } from "react";
import { PlusCircle } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddCoursePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:8000/api/v1/teacher/";

  const handleAddCourse = async () => {
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("access_token");
    if (!token) {
      setMessage("❌ الرجاء تسجيل الدخول أولاً");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      setLoading(false);
      return;
    }

    // Client-side validation
    if (!title.trim()) {
      setMessage("❌ الرجاء إدخال عنوان الدورة");
      setLoading(false);
      return;
    }

    if (!description.trim()) {
      setMessage("❌ الرجاء إدخال وصف الدورة");
      setLoading(false);
      return;
    }

    if (!coverImage) {
      setMessage("❌ الرجاء رفع صورة للدورة");
      setLoading(false);
      return;
    }

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(coverImage.type)) {
      setMessage("❌ يجب أن تكون الصورة بصيغة JPG أو PNG");
      setLoading(false);
      return;
    }
    if (coverImage.size > maxSize) {
      setMessage("❌ حجم الصورة يجب ألا يتجاوز 5 ميجابايت");
      setLoading(false);
      return;
    }

    // Create FormData object to handle file upload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("cover_image", coverImage);

    // Log FormData contents for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post(`${API_URL}create_course`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ الدورة أضيفت بنجاح!");
      console.log("Response Data:", response.data);
      setTitle("");
      setDescription("");
      setCoverImage(null);
      setTimeout(() => {
        navigate("/courses");
      }, 1000);
    } catch (error) {
      console.error("Error:", error);

      if (error.response?.status === 401) {
        setMessage("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
        localStorage.removeItem("access_token");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error.response?.status === 403) {
        setMessage("❌ ليس لديك الصلاحية لإضافة دورة.");
      } else {
        const errorMsg = error.response?.data?.message || "خطأ غير معروف";
        setMessage(`❌ فشل الإضافة: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <Sidebar />
        <main style={styles.main}>
          <div style={styles.header}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>إضافة دورة جديدة</h1>
          </div>
          <div style={styles.card}>
            <h2 style={styles.title}>
              إضافة دورة <PlusCircle style={{ marginLeft: "8px" }} />
            </h2>
            <div style={styles.form}>
              <div>
                <label style={styles.label}>العنوان</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="أدخل عنوان الدورة"
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>الوصف</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="أدخل وصف الدورة"
                  rows={4}
                  style={styles.input}
                ></textarea>
              </div>
              <div>
                <label style={styles.label}>صورة الدورة</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  style={styles.input}
                />
              </div>
              <button
                onClick={handleAddCourse}
                style={styles.button}
                disabled={loading}
              >
                {loading ? "جاري الإضافة..." : "إضافة الدورة"}
              </button>
              {message && (
                <p
                  style={{
                    textAlign: "center",
                    color: message.includes("✅") ? "green" : "red",
                  }}
                >
                  {message}
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#fff",
    color: "#000",
    flexDirection: "row-reverse",
    fontFamily: "Tajawal",
  },
  main: {
    flex: 1,
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "right",
  },
  header: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    width: "100%",
    maxWidth: "600px",
    marginBottom: "20px",
  },
  card: {
    padding: "30px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    borderRadius: "12px",
    border: "1px solid #ddd",
    backgroundColor: "#D5E7E1",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "rgb(30, 200, 160)",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    display: "block",
    fontWeight: "700",
    marginBottom: "5px",
  },
  input: {
    width: "90%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "right",
    fontFamily: "Tajawal",
  },
  button: {
    width: "100%",
    backgroundColor: "#1EC8A0",
    color: "#fff",
    fontWeight: "bold",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
};
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