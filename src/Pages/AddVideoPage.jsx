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
import { useState } from "react";
import { Upload } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/DashboardNavbar";

export default function UploadVideoPage() {
    const [videoTitle, setVideoTitle] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = (event) => {
        setVideoFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!videoFile || !videoTitle) {
            alert("يرجى إدخال عنوان الفيديو واختيار ملف!");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("title", videoTitle);
        formData.append("video_path", videoFile);

        try {
            const response = await fetch("https://graduation-main-0wwkv3.laravel.cloud/api/v1/teacher/upload_video/3", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2dyYWR1YXRpb24tbWFpbi0wd3drdjMubGFyYXZlbC5jbG91ZC9hcGkvYXV0aC9sb2dpbiIsImlhdCI6MTc0MTA5ODEwMCwiZXhwIjoxNzQxMTAxNzAwLCJuYmYiOjE3NDEwOTgxMDAsImp0aSI6ImJXUXdkekU5VFJjUkJVdEkiLCJzdWIiOiI5IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.ejJNkc3wpT5socKxcslEPV92uCBDw_L4lEi6ULCHZLw"
                },
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                alert("تم رفع الفيديو بنجاح: " + result.data.title);
                console.log("Message: ", result);
                setVideoTitle("");
                setVideoFile(null);
            } else {
                alert("فشل في رفع الفيديو: " + result.message);
            }
        } catch (error) {
            alert("حدث خطأ أثناء رفع الفيديو");
        } finally {
            setUploading(false);
        }
    };

    return (
        <><Navbar /><div style={styles.container}>
            <Sidebar/>
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
                </div>
            </main>
        </div></>
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
