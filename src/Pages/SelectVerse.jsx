import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../Components/DashboardNavbar";
import "../styles/select-verse.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpenReader } from '@fortawesome/free-solid-svg-icons';

const SelectVerse = () => {
  const [surahs, setSurahs] = useState([])
  const [selectedSurah, setSelectedSurah] = useState("")
  const [verseCount, setVerseCount] = useState(0)
  const [verses, setVerses] = useState([])
  const [selectedVerse, setSelectedVerse] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Fetch Surahs from the backend
  useEffect(() => {
    const fetchSurahs = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) {
        setError("الرجاء تسجيل الدخول أولاً")
        setTimeout(() => {
          navigate("/login")
        }, 1000)
        return
      }

      try {
        const response = await fetch("http://localhost:8000/api/v1/student/surahs", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token")
            setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.")
            setTimeout(() => {
              navigate("/login")
            }, 1000)
            return
          }
          throw new Error("فشل في جلب قائمة السور")
        }

        const result = await response.json()
        if (result.status === 200) {
          setSurahs(result.data)
        } else {
          throw new Error(result.message || "فشل في جلب قائمة السور")
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSurahs()
  }, [navigate])

  // Fetch Verses when a Surah is selected
  useEffect(() => {
    const fetchVerses = async () => {
      if (!selectedSurah) {
        setVerses([])
        setVerseCount(0)
        return
      }

      const token = localStorage.getItem("access_token")
      if (!token) {
        setError("الرجاء تسجيل الدخول أولاً")
        setTimeout(() => {
          navigate("/login")
        }, 1000)
        return
      }

      try {
        const response = await fetch(`http://localhost:8000/api/v1/student/surahs/${selectedSurah}/verses`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token")
            setError("انتهت جلسة تسجيل الدخول. الرجاء تسجيل الدخول مرة أخرى.")
            setTimeout(() => {
              navigate("/login")
            }, 1000)
            return
          }
          throw new Error("فشل في جلب الآيات")
        }

        const result = await response.json()
        if (result.status === 200) {
          setVerses(result.data)
          const surah = surahs.find((s) => s.id === Number.parseInt(selectedSurah))
          setVerseCount(surah ? surah.verse_count : 0)
        } else {
          throw new Error(result.message || "فشل في جلب الآيات")
        }
      } catch (err) {
        setError(err.message)
        setVerses([])
        setVerseCount(0)
      }
    }
    fetchVerses()
  }, [selectedSurah, surahs, navigate])

  // Handle Surah selection
  const handleSurahChange = (e) => {
    const surahId = e.target.value
    setSelectedSurah(surahId)
    setSelectedVerse("")
  }

  // Handle Verse selection
  const handleVerseChange = (e) => {
    setSelectedVerse(e.target.value)
  }

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedSurah || !selectedVerse) return

    const surah = surahs.find((s) => s.id === Number.parseInt(selectedSurah))
    navigate("/recitation", { 
      state: { 
        surahId: surah.id, 
        verseNumber: selectedVerse, 
        surahName: surah.name 
      } 
    })
  }

  // Generate verse options based on verses fetched
  const verseOptions = verses.map(verse => verse.verse_number)

  return (
    <>
      <Navbar />
      <div dir="rtl" className="verse-container">
        <div className="verse-card">
          <h1 className="verse-title"><FontAwesomeIcon icon={faBookOpenReader} /> اختر آية</h1>

          <div className="form-group">
            <label className="form-label" htmlFor="surah">
              سورة
            </label>
            <select id="surah" value={selectedSurah} onChange={handleSurahChange} className="form-select">
              <option value="">اختر سورة</option>
              {surahs.map((surah) => (
                <option key={surah.id} value={surah.id}>
                  {surah.name} (#{surah.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="verse">
              آية
            </label>
            <select
              id="verse"
              value={selectedVerse}
              onChange={handleVerseChange}
              className="form-select"
              disabled={!selectedSurah}
            >
              <option value="">اختر آية</option>
              {verseOptions.map((verse) => (
                <option key={verse} value={verse}>
                  {verse}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className={`submit-button ${!selectedSurah || !selectedVerse ? "disabled" : ""}`}
            disabled={!selectedSurah || !selectedVerse}
          >
            ابدأ تسميع هذه الآية
          </button>

          {loading && <p>جاري التحميل...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </>
  )
}

export default SelectVerse
/**************************************************************************** */
// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import Navbar from "../Components/DashboardNavbar";
// import "../styles/select-verse.css"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBookOpenReader} from '@fortawesome/free-solid-svg-icons';

// const SelectVerse = () => {
//   const [surahs, setSurahs] = useState([])
//   const [selectedSurah, setSelectedSurah] = useState("")
//   const [verseCount, setVerseCount] = useState(0)
//   const [selectedVerse, setSelectedVerse] = useState("")
//   const navigate = useNavigate()

//   // Fetch Surahs from the backend
//   useEffect(() => {
//     const fetchSurahs = async () => {
//       try {
//         const response = await fetch("/api/surahs")
//         const data = await response.json()
//         setSurahs(data)
//       } catch (error) {
//         console.error("Error fetching surahs:", error)
//       }
//     }
//     fetchSurahs()
//   }, [])

//   // Handle Surah selection
//   const handleSurahChange = (e) => {
//     const surahNumber = e.target.value
//     setSelectedSurah(surahNumber)
//     const surah = surahs.find((s) => s.number === Number.parseInt(surahNumber))
//     setVerseCount(surah ? surah.verse_count : 0)
//     setSelectedVerse("")
//   }

//   // Handle Verse selection
//   const handleVerseChange = (e) => {
//     setSelectedVerse(e.target.value)
//   }

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (selectedSurah && selectedVerse) {
//       const surah = surahs.find((s) => s.number === Number.parseInt(selectedSurah))
//       const payload = {
//         surahId: surah.id,
//         verseNumber: Number.parseInt(selectedVerse),
//       }

//       try {
//         const response = await fetch("/api/select-verse", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         })

//         if (response.ok) {
//           navigate("/recitation", { state: { surahId: surah.id, verseNumber: selectedVerse, surahName: surah.name } })
//         }
//       } catch (error) {
//         console.error("Error submitting verse selection:", error)
//       }
//     }
//   }

//   // Generate verse options based on verse count
//   const verseOptions = Array.from({ length: verseCount }, (_, i) => i + 1)

//   return (
//     <><Navbar />
//     <div dir="rtl" className="verse-container">
//       <div className="verse-card">
//         <h1 className="verse-title"><FontAwesomeIcon icon={faBookOpenReader} /> اختر آية</h1>

//         <div className="form-group">
//           <label className="form-label" htmlFor="surah">
//             سورة
//           </label>
//           <select id="surah" value={selectedSurah} onChange={handleSurahChange} className="form-select">
//             <option value="">اختر سورة</option>
//             {surahs.map((surah) => (
//               <option key={surah.id} value={surah.number}>
//                 {surah.name} (#{surah.number})
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label className="form-label" htmlFor="verse">
//             آية
//           </label>
//           <select
//             id="verse"
//             value={selectedVerse}
//             onChange={handleVerseChange}
//             className="form-select"
//             disabled={!selectedSurah}
//           >
//             <option value="">اختر آية</option>
//             {verseOptions.map((verse) => (
//               <option key={verse} value={verse}>
//                 {verse}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button
//           onClick={handleSubmit}
//           className={`submit-button ${!selectedSurah || !selectedVerse ? "disabled" : ""}`}
//           disabled={!selectedSurah || !selectedVerse}
//         >
//           ابدأ تسميع هذه الآية
//         </button>
//       </div>
//     </div></>
//   )
// }

// export default SelectVerse
