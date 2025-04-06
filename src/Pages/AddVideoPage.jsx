import { useState } from "react";
import { Upload } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";
import { useParams, useNavigate } from "react-router-dom"; // أضيفي useParams و useNavigate

export default function UploadVideoPage() {
    const { courseId } = useParams(); // جيبي الـ course ID من الـ URL
    const navigate = useNavigate(); // للـ redirect لو فيه مشكلة
    const [videoTitle, setVideoTitle] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(""); // لعرض رسائل النجاح أو الخطأ

    const handleUpload = (event) => {
        setVideoFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!videoFile || !videoTitle) {
            setMessage("❌ يرجى إدخال عنوان الفيديو واختيار ملف!");
            return;
        }

        const token = localStorage.getItem("access_token");
        if (!token) {
            setMessage("❌ الرجاء تسجيل الدخول أولاً");
            setTimeout(() => {
                navigate("/login");
            }, 1000);
            return;
        }

        setUploading(true);
        setMessage(""); // امسحي أي رسائل قديمة

        const formData = new FormData();
        formData.append("title", videoTitle);
        formData.append("video_path", videoFile);

        try {
            const response = await fetch(`http://localhost:8000/api/v1/teacher/upload_video/${courseId}`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`, // استخدمي الـ token من localStorage
                },
                body: formData,
            });

            const result = await response.json();
            console.log("Upload video response:", result); // Debug

            if (response.ok) {
                setMessage(`✅ تم رفع الفيديو بنجاح: ${result.data.title}`);
                setVideoTitle("");
                setVideoFile(null);
            } else {
                if (response.status === 401) {
                    localStorage.removeItem("access_token");
                    setMessage("❌ انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.");
                    setTimeout(() => {
                        navigate("/login");
                    }, 1000);
                    return;
                }
                setMessage(`❌ فشل في رفع الفيديو: ${result.message}`);
            }
        } catch (error) {
            setMessage("❌ حدث خطأ أثناء رفع الفيديو");
            console.error("Error:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div style={styles.container}>
                <Sidebar />
                <main style={styles.main}>
                    <div style={styles.card}>
                        <div style={styles.decorative}></div>
                        <h1 style={styles.title}>رفع فيديو جديد</h1>

                        <input
                            type="text"
                            placeholder="عنوان الفيديو"
                            style={styles.input}
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                        />

                        <label style={styles.uploadBox}>
                            <Upload size={50} style={{ color: "#1EC8A0", marginBottom: "10px" }} />
                            <span>{videoFile ? videoFile.name : "اضغط هنا لرفع الفيديو"}</span>
                            <input type="file" accept="video/*" style={styles.hiddenInput} onChange={handleUpload} />
                        </label>

                        <button style={styles.button} onClick={handleSubmit} disabled={uploading}>
                            {uploading ? "جارٍ الرفع..." : "أضف الفيديو"}
                        </button>

                        {message && (
                            <p
                                style={{
                                    textAlign: "center",
                                    color: message.includes("✅") ? "green" : "red",
                                    marginTop: "10px",
                                }}
                            >
                                {message}
                            </p>
                        )}
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
        backgroundColor: '#fff',
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
    card: {
        padding: "30px",
        width: "100%",
        maxWidth: "600px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        border: "1px solid #ddd",
        backgroundColor: '#D5E7E1',
        position: "relative",
    },
    decorative: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "60px",
        height: "60px",
        backgroundColor: 'black',
        borderBottomRightRadius: "100%",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center",
        color: "#333",
        fontFamily: "Tajawal",
    },
    input: {
        width: "90%",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        textAlign: "right",
        marginBottom: "15px",
        fontSize: "16px",
        fontFamily: "Tajawal",
    },
    uploadBox: {
        width: "77.5%",
        padding: "50px",
        border: "2px dashed #666",
        borderRadius: "8px",
        textAlign: "center",
        color: "#444",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9",
        fontFamily: "Tajawal",
        marginLeft: "auto",
    },
    hiddenInput: {
        display: "none",
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
        fontSize: "16px",
        fontFamily: "Tajawal",
    },
};


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

