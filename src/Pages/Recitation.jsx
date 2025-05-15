import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "../Components/DashboardNavbar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone} from '@fortawesome/free-solid-svg-icons';
import "../styles/recitation.css"

const Recitation = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30) // 30 seconds max
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)
  const navigate = useNavigate()
  const { state } = useLocation()
  const { surahId, verseNumber, surahName } = state || {}

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [isRecording])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        console.log("Audio Blob Size:", audioBlob.size); // التأكد إن التسجيل مش فاضي
        const formData = new FormData()
        formData.append("audio", audioBlob, "recitation.webm")
        formData.append("surah_id", surahId)
        formData.append("verse_number", verseNumber)

      // mediaRecorderRef.current.onstop = async () => {
      //   const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
      //   const formData = new FormData()
      //   formData.append("audio", audioBlob, "recitation.webm")
      //   formData.append("surah_id", surahId) // Adjusted to match API expectation
      //   formData.append("verse_number", verseNumber) // Adjusted to match API expectation

        try {
          const token = localStorage.getItem("access_token") // Add token for authentication
          const response = await fetch("http://localhost:8000/api/v1/student/recitation/check", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`, // Add authentication header
            },
            body: formData,
          })

          if (!response.ok) {
            throw new Error("فشل في التحقق من التسميع")
          }

          const data = await response.json()
          console.log("API Response:", data)
          navigate("/recitation-feedback", { state: { feedback: data, surahName, verseNumber } })
        } catch (error) {
          console.error("Error submitting recitation:", error)
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setTimeLeft(30)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <>
      <Navbar />
      <div dir="rtl" className="recitation-container">
        <div className="recitation-card">
          <h1 className="recitation-title"> <FontAwesomeIcon icon={faMicrophone} /> تسميع</h1>
          <p className="recitation-description">
            هل أنت جاهز للتسميع؟ اضغط على الزر أدناه لبدء التسجيل. سيظهر النص بعد انتهاء التسجيل.
          </p>
          {!isRecording ? (
            <button onClick={startRecording} className="start-button">
              ابدأ تسميع هذه الآية
            </button>
          ) : (
            <div className="recording-container">
              <p className="timer-text">جاري التسجيل... الوقت المتبقي: {timeLeft} ثانية</p>
              <button onClick={stopRecording} className="stop-button">
                إنهاء التسجيل
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Recitation
/*************************************************************************** */
// import { useState, useEffect, useRef } from "react"
// import { useLocation, useNavigate } from "react-router-dom"
// import Navbar from "../Components/DashboardNavbar"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMicrophone} from '@fortawesome/free-solid-svg-icons';
// import "../styles/recitation.css"

// const Recitation = () => {
//   const [isRecording, setIsRecording] = useState(false)
//   const [timeLeft, setTimeLeft] = useState(30) // 30 seconds max
//   const mediaRecorderRef = useRef(null)
//   const audioChunksRef = useRef([])
//   const timerRef = useRef(null)
//   const navigate = useNavigate()
//   const { state } = useLocation()
//   const { surahId, verseNumber, surahName } = state || {}

//   useEffect(() => {
//     if (isRecording) {
//       timerRef.current = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 1) {
//             stopRecording()
//             return 0
//           }
//           return prev - 1
//         })
//       }, 1000)
//     } else {
//       clearInterval(timerRef.current)
//     }

//     return () => clearInterval(timerRef.current)
//   }, [isRecording])

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//       mediaRecorderRef.current = new MediaRecorder(stream)
//       audioChunksRef.current = []

//       mediaRecorderRef.current.ondataavailable = (event) => {
//         audioChunksRef.current.push(event.data)
//       }

//       mediaRecorderRef.current.onstop = async () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
//         const formData = new FormData()
//         formData.append("audio", audioBlob, "recitation.webm")
//         formData.append("surahId", surahId)
//         formData.append("verseNumber", verseNumber)

//         try {
//           const response = await fetch("/api/submit-recitation", {
//             method: "POST",
//             body: formData,
//           })

//           const data = await response.json()
//           navigate("/recitation-feedback", { state: { feedback: data, surahName, verseNumber } })
//         } catch (error) {
//           console.error("Error submitting recitation:", error)
//         }
//       }

//       mediaRecorderRef.current.start()
//       setIsRecording(true)
//       setTimeLeft(30)
//     } catch (error) {
//       console.error("Error starting recording:", error)
//     }
//   }

//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop()
//       setIsRecording(false)
//     }
//   }

//   return (
//     <><Navbar /><div dir="rtl" className="recitation-container">
//       <div className="recitation-card">
//         <h1 className="recitation-title"> <FontAwesomeIcon icon={faMicrophone} /> تسميع</h1>
//         <p className="recitation-description">
//           هل أنت جاهز للتسميع؟ اضغط على الزر أدناه لبدء التسجيل. سيظهر النص بعد انتهاء التسجيل.
//         </p>
//         {!isRecording ? (
//           <button onClick={startRecording} className="start-button">
//             ابدأ تسميع هذه الآية
//           </button>
//         ) : (
//           <div className="recording-container">
//             <p className="timer-text">جاري التسجيل... الوقت المتبقي: {timeLeft} ثانية</p>
//             <button onClick={stopRecording} className="stop-button">
//               إنهاء التسجيل
//             </button>
//           </div>
//         )}
//       </div>
//     </div></>
//   )
// }

// export default Recitation
