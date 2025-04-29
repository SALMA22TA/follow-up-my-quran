import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../Components/DashboardNavbar";
import "../styles/select-verse.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpenReader} from '@fortawesome/free-solid-svg-icons';

const SelectVerse = () => {
  const [surahs, setSurahs] = useState([])
  const [selectedSurah, setSelectedSurah] = useState("")
  const [verseCount, setVerseCount] = useState(0)
  const [selectedVerse, setSelectedVerse] = useState("")
  const navigate = useNavigate()

  // Fetch Surahs from the backend
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch("/api/surahs")
        const data = await response.json()
        setSurahs(data)
      } catch (error) {
        console.error("Error fetching surahs:", error)
      }
    }
    fetchSurahs()
  }, [])

  // Handle Surah selection
  const handleSurahChange = (e) => {
    const surahNumber = e.target.value
    setSelectedSurah(surahNumber)
    const surah = surahs.find((s) => s.number === Number.parseInt(surahNumber))
    setVerseCount(surah ? surah.verse_count : 0)
    setSelectedVerse("")
  }

  // Handle Verse selection
  const handleVerseChange = (e) => {
    setSelectedVerse(e.target.value)
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (selectedSurah && selectedVerse) {
      const surah = surahs.find((s) => s.number === Number.parseInt(selectedSurah))
      const payload = {
        surahId: surah.id,
        verseNumber: Number.parseInt(selectedVerse),
      }

      try {
        const response = await fetch("/api/select-verse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          navigate("/recitation", { state: { surahId: surah.id, verseNumber: selectedVerse, surahName: surah.name } })
        }
      } catch (error) {
        console.error("Error submitting verse selection:", error)
      }
    }
  }

  // Generate verse options based on verse count
  const verseOptions = Array.from({ length: verseCount }, (_, i) => i + 1)

  return (
    <><Navbar />
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
              <option key={surah.id} value={surah.number}>
                {surah.name} (#{surah.number})
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
      </div>
    </div></>
  )
}

export default SelectVerse
