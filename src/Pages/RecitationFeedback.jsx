import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "../Components/DashboardNavbar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import "../styles/recitation-feedback.css"

const RecitationFeedback = () => {
  const { state } = useLocation()
  const { feedback, surahName, verseNumber } = state || {}
  const navigate = useNavigate()

  // Map API response to expected fields
  const { actual_text: actualVerse, model_transcription: studentRead, word_match } = feedback?.data || {}
  
  // Derive overall correctness from word_match
  // @ts-ignore
  const isCorrect = word_match ? word_match.every(item => item.correct) : false

  // Split studentRead into words for individual styling
  const studentWords = studentRead ? studentRead.split(' ') : []

  return (
    <>
      <Navbar />
      <div dir="rtl" className="feedback-container">
        <div className="feedback-card">
          <h1 className="feedback-title"> <FontAwesomeIcon icon={faComment} /> ملاحظات حول التلاوة </h1>

          <div className="notification-box">
            <p className="notification-text">تم حفظ التسجيل. راجع الملاحظات أدناه.</p>
          </div>

          <div className="verse-section">
            <h2 className="section-title">النص الأصلي</h2>
            <p className="verse-text">{actualVerse || "غير متاح"}</p>
            <p className="verse-info">
              {surahName}، آية {verseNumber}
            </p>
          </div>

          <div className="verse-section">
            <h2 className="section-title">تسميع الطالب</h2>
            <p className="verse-text">
              {studentWords.length > 0 ? (
                // @ts-ignore
                studentWords.map((word, index) => {
                  // Find the corresponding word in word_match
                  const match = word_match && word_match[index] ? word_match[index] : { correct: false }
                  return (
                    <span key={index} className={`word ${match.correct ? "correct" : "incorrect"}`}>
                      {word}{' '}
                    </span>
                  )
                })
              ) : (
                "تعذر تحويل التسجيل إلى نص"
              )}
            </p>
            <p className="verse-info">
              {surahName}، آية {verseNumber}
            </p>
          </div>

          <div className="verse-section">
            <h2 className="section-title">تشابه</h2>
            <p className="verse-text">
              {isCorrect ? "الأداء صحيح" : "الأداء غير صحيح"}
            </p>
            {word_match && word_match.length > 0 && (
              <div className="word-match-details">
                <h3 className="section-title">تفاصيل الكلمات</h3>
                <ul>
                  {word_match.map((
// @ts-ignore
                  item, index) => (
                    <li key={index} className={item.correct ? "correct" : "incorrect"}>
                      {item.word}: {item.correct ? "صحيح" : "غير صحيح"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button onClick={() => navigate("/select-verse")} className="action-button">
            اختر آية جديدة
          </button>
        </div>
      </div>
    </>
  )
}

export default RecitationFeedback
/**************************************************************************** */
// import { useLocation, useNavigate } from "react-router-dom"
// import Navbar from "../Components/DashboardNavbar"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faComment } from '@fortawesome/free-solid-svg-icons';
// import "../styles/recitation-feedback.css"

// const RecitationFeedback = () => {
//   const { state } = useLocation()
//   const { feedback, surahName, verseNumber } = state || {}
//   const navigate = useNavigate()

//   // Map API response to expected fields
//   const { actual_text: actualVerse, model_transcription: studentRead, word_match } = feedback?.data || {}
  
//   // Derive overall correctness from word_match
//   // @ts-ignore
//   const isCorrect = word_match ? word_match.every(item => item.correct) : false

//   return (
//     <>
//       <Navbar />
//       <div dir="rtl" className="feedback-container">
//         <div className="feedback-card">
//           <h1 className="feedback-title"> <FontAwesomeIcon icon={faComment} /> ملاحظات حول التلاوة </h1>

//           <div className="notification-box">
//             <p className="notification-text">تم حفظ التسجيل. راجع الملاحظات أدناه.</p>
//           </div>

//           <div className="verse-section">
//             <h2 className="section-title">النص الأصلي</h2>
//             <p className="verse-text">{actualVerse || "غير متاح"}</p>
//             <p className="verse-info">
//               {surahName}، آية {verseNumber}
//             </p>
//           </div>

//           <div className="verse-section">
//             <h2 className="section-title">تسميع الطالب</h2>
//             <p className={`verse-text ${isCorrect ? "correct" : "incorrect"}`}>
//               {studentRead || "تعذر تحويل التسجيل إلى نص"}
//             </p>
//             <p className="verse-info">
//               {surahName}، آية {verseNumber}
//             </p>
//           </div>

//           <div className="verse-section">
//             <h2 className="section-title">تشابه</h2>
//             <p className="verse-text">
//               {isCorrect ? "الأداء صحيح" : "الأداء غير صحيح"}
//             </p>
//             {word_match && word_match.length > 0 && (
//               <div className="word-match-details">
//                 <h3 className="section-title">تفاصيل الكلمات</h3>
//                 <ul>
//                   {word_match.map((
// // @ts-ignore
//                   item, index) => (
//                     <li key={index} className={item.correct ? "correct" : "incorrect"}>
//                       {item.word}: {item.correct ? "صحيح" : "غير صحيح"}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           <button onClick={() => navigate("/select-verse")} className="action-button">
//             اختر آية جديدة
//           </button>
//         </div>
//       </div>
//     </>
//   )
// }

// export default RecitationFeedback
/************************************************************************************** */
// import { useLocation, useNavigate } from "react-router-dom"
// import Navbar from "../Components/DashboardNavbar"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faComment} from '@fortawesome/free-solid-svg-icons';
// import "../styles/recitation-feedback.css"

// const RecitationFeedback = () => {
//   const { state } = useLocation()
//   const { feedback, surahName, verseNumber } = state || {}
//   const navigate = useNavigate()

//   const { actualVerse, studentRead, correct } = feedback || {}

//   return (
//     <>
//       <Navbar />
//       <div dir="rtl" className="feedback-container">
//         <div className="feedback-card">
//           <h1 className="feedback-title"> <FontAwesomeIcon icon={faComment} /> ملاحظات حول التلاوة </h1>

//           <div className="notification-box">
//             <p className="notification-text">تم حفظ التسجيل. راجع الملاحظات أدناه.</p>
//           </div>

//           <div className="verse-section">
//             <h2 className="section-title">النص الأصلي</h2>
//             <p className="verse-text">{actualVerse || "غير متاح"}</p>
//             <p className="verse-info">
//               {surahName}، آية {verseNumber}
//             </p>
//           </div>

//           <div className="verse-section">
//             <h2 className="section-title">تسميع الطالب</h2>
//             <p className={`verse-text ${correct === true ? "correct" : correct === false ? "incorrect" : ""}`}>
//               {studentRead || "تعذر تحويل التسجيل إلى نص"}
//             </p>
//             <p className="verse-info">
//               {surahName}، آية {verseNumber}
//             </p>
//           </div>

//           <div className="verse-section">
//             <h2 className="section-title">تشابه</h2>
//             <p className="verse-text">
//               {correct === true ? "الأداء صحيح" : correct === false ? "الأداء غير صحيح" : "غير متاح"}
//             </p>
//           </div>

//           <button onClick={() => navigate("/select-verse")} className="action-button">
//             اختر آية جديدة
//           </button>
//         </div>
//       </div>
//     </>
//   )
// }

// export default RecitationFeedback
/******************************************************************* */
// import { useLocation, useNavigate } from "react-router-dom"
// import Navbar from "../Components/DashboardNavbar"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faComment} from '@fortawesome/free-solid-svg-icons';
// import "../styles/recitation-feedback.css"

// const RecitationFeedback = () => {
//   const { state } = useLocation()
//   const { feedback, surahName, verseNumber } = state || {}
//   const navigate = useNavigate()

//   const { actualVerse, studentRead, correct } = feedback || {}

//   return (
//     <><Navbar /><div dir="rtl" className="feedback-container">
//       <div className="feedback-card">
//         <h1 className="feedback-title"> <FontAwesomeIcon icon={faComment} /> ملاحظات حول التلاوة </h1>

//         <div className="notification-box">
//           <p className="notification-text">تم حفظ التسجيل. راجع الملاحظات أدناه.</p>
//         </div>

//         <div className="verse-section">
//           <h2 className="section-title">النص الأصلي</h2>
//           <p className="verse-text">{actualVerse}</p>
//           <p className="verse-info">
//             {surahName}، آية {verseNumber}
//           </p>
//         </div>

//         <div className="verse-section">
//           <h2 className="section-title">تسميع الطالب</h2>
//           <p className={`verse-text ${correct ? "correct" : "incorrect"}`}>{studentRead}</p>
//           <p className="verse-info">
//             {surahName}، آية {verseNumber}
//           </p>
//         </div>

//         <button onClick={() => navigate("/select-verse")} className="action-button">
//           اختر آية جديدة
//         </button>
//       </div>
//     </div></>
//   )
// }

// export default RecitationFeedback
