import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "../Components/DashboardNavbar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import "../styles/recitation.css"

const Recitation = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30) // 30 seconds max
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)
  const audioContextRef = useRef(null)
  const navigate = useNavigate()
  const { state } = useLocation()
  const { surahId, verseNumber, surahName } = state || {}

  useEffect(() => {
    if (isRecording) {
      // @ts-ignore
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
      // @ts-ignore
      clearInterval(timerRef.current)
    }

    // @ts-ignore
    return () => clearInterval(timerRef.current)
  }, [isRecording])

  // Function to convert WebM to WAV
  // @ts-ignore
  const webmToWav = async (webmBlob) => {
    try {
      if (!audioContextRef.current) {
        // @ts-ignore
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      const arrayBuffer = await webmBlob.arrayBuffer()
      // @ts-ignore
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
      
      // Convert AudioBuffer to WAV
      const wavBuffer = audioBufferToWav(audioBuffer)
      return new Blob([wavBuffer], { type: 'audio/wav' })
    } catch (error) {
      console.error("Error converting WebM to WAV:", error)
      throw error
    }
  }

  // Helper function to convert AudioBuffer to WAV
  // @ts-ignore
  const audioBufferToWav = (buffer) => {
    const numChannels = buffer.numberOfChannels
    const sampleRate = buffer.sampleRate
    const length = buffer.length * numChannels * 2 + 44
    const bufferArray = new ArrayBuffer(length)
    const view = new DataView(bufferArray)

    // Write WAV header
    // @ts-ignore
    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + buffer.length * numChannels * 2, true)
    writeString(view, 8, 'WAVE')
    writeString(view, 12, 'fmt ')
    view.setUint16(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numChannels * 2, true)
    view.setUint16(32, numChannels * 2, true)
    view.setUint16(34, 16, true)
    writeString(view, 36, 'data')
    view.setUint32(40, buffer.length * numChannels * 2, true)

    // Write PCM data
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]))
        view.setInt16(44 + (i * numChannels + channel) * 2, sample * 0x7FFF, true)
      }
    }

    return bufferArray
  }

  // Function to convert WAV to MP3 using lamejs
  // @ts-ignore
  const wavToMp3 = async (wavBlob) => {
    try {
      // Check if lamejs is available
      // @ts-ignore
      if (!window.lamejs) {
        throw new Error("lamejs library is not loaded. Please ensure the script is included.")
      }

      const arrayBuffer = await wavBlob.arrayBuffer()
      // @ts-ignore
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      // Use global lamejs
      // @ts-ignore
      const { Mp3Encoder } = window.lamejs
      const mp3Encoder = new Mp3Encoder(1, audioBuffer.sampleRate, 128) // Mono, 128kbps
      const samples = audioBuffer.getChannelData(0).map(sample => Math.round(sample * 32768))
      const mp3Data = []

      const blockSize = 1152
      for (let i = 0; i < samples.length; i += blockSize) {
        const sampleChunk = samples.slice(i, i + blockSize)
        const mp3buf = mp3Encoder.encodeBuffer(sampleChunk)
        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf)
        }
      }
      const mp3buf = mp3Encoder.flush()
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf)
      }

      return new Blob(mp3Data, { type: 'audio/mp3' })
    } catch (error) {
      console.error("Error converting WAV to MP3:", error)
      throw error
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // @ts-ignore
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      audioChunksRef.current = []

      // @ts-ignore
      mediaRecorderRef.current.ondataavailable = (event) => {
        // @ts-ignore
        audioChunksRef.current.push(event.data)
      }

      // @ts-ignore
      mediaRecorderRef.current.onstop = async () => {
        const webmBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        console.log("WebM Blob Size:", webmBlob.size)

        try {
          // Convert WebM to WAV
          const wavBlob = await webmToWav(webmBlob)
          console.log("WAV Blob Size:", wavBlob.size)

          // Convert WAV to MP3
          const mp3Blob = await wavToMp3(wavBlob)
          console.log("MP3 Blob Size:", mp3Blob.size)

          // Prepare FormData for backend
          const formData = new FormData()
          formData.append("audio", mp3Blob, "recitation.mp3")
          formData.append("surah_id", surahId)
          formData.append("verse_number", verseNumber)

          const token = localStorage.getItem("access_token")
          const response = await fetch("http://localhost:8000/api/v1/student/recitation/check", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
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
          console.error("Error processing or submitting recitation:", error)
        }
      }

      // @ts-ignore
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setTimeLeft(30)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      // @ts-ignore
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
/************************************************************************************* */
// import { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Navbar from "../Components/DashboardNavbar";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
// import "../styles/recitation.css";
// import lamejs from "lamejs";

// // @ts-ignore
// window.MPEGMode = lamejs.MPEGMode;

//  // Dynamically add MPEGMode to lamejs if it doesn't exist or is read-only
//  if (!lamejs.MPEGMode || Object.getOwnPropertyDescriptor(lamejs, 'MPEGMode')?.writable === false) {
//    Object.defineProperty(lamejs, 'MPEGMode', {
//      value: {
//        STEREO: 0,
//        JOINT_STEREO: 1,
//        DUAL_CHANNEL: 2,
//        MONO: 3,
//        NOT_SET: -1,
//      },
//      writable: true,
//      configurable: true,
//      enumerable: true,
//    });
//  }


// const Recitation = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(30);
//   // @ts-ignore
//   const mediaRecorderRef = useRef(null);
//   // @ts-ignore
//   const audioChunksRef = useRef([]);
//   // @ts-ignore
//   const timerRef = useRef(null);
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const { surahId, verseNumber, surahName } = state || {};

//   useEffect(() => {
//     if (isRecording) {
//       // @ts-ignore
//       timerRef.current = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 1) {
//             stopRecording();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     } else {
//       if (timerRef.current) clearInterval(timerRef.current);
//     }
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [isRecording]);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       // @ts-ignore
//       mediaRecorderRef.current = new MediaRecorder(stream);
//       audioChunksRef.current = [];

//       // @ts-ignore
//       mediaRecorderRef.current.ondataavailable = (event) => {
//         // @ts-ignore
//         audioChunksRef.current.push(event.data);
//       };

//       // @ts-ignore
//       mediaRecorderRef.current.onstop = async () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//         const mp3Blob = await convertToMP3(audioBlob);

//         const formData = new FormData();
//         formData.append("audio", mp3Blob, "recitation.mp3");
//         formData.append("surah_id", surahId);
//         formData.append("verse_number", verseNumber);

//         const token = localStorage.getItem("access_token");
//         const response = await fetch("http://localhost:8000/api/v1/student/recitation/check", {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//           body: formData,
//         });

//         if (!response.ok) throw new Error("فشل في التحقق من التسميع");
//         const data = await response.json();
//         navigate("/recitation-feedback", { state: { feedback: data, surahName, verseNumber } });
//       };

//       // @ts-ignore
//       mediaRecorderRef.current.start();
//       setIsRecording(true);
//       setTimeLeft(30);
//     } catch (error) {
//       console.error("Error starting recording:", error);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       // @ts-ignore
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   // @ts-ignore
//   const convertToMP3 = (webmBlob) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = async (event) => {
//         try {
//           const audioContext = new AudioContext();
//           // @ts-ignore
//           const arrayBuffer = event.target.result;
//           // @ts-ignore
//           const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
//           const samples = audioBuffer.getChannelData(0); // Get raw Float32Array
//           // @ts-ignore
//           const mp3Encoder = new lamejs.Mp3Encoder(1, audioBuffer.sampleRate, 128);
//           const mp3Data = [];

//           for (let i = 0; i < samples.length; i += 1152) {
//             const sampleChunk = samples.subarray(i, i + 1152);
//             const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
//             if (mp3buf.length > 0) mp3Data.push(mp3buf);
//           }
//           const mp3buf = mp3Encoder.flush();
//           if (mp3buf.length > 0) mp3Data.push(mp3buf);

//           const mp3Blob = new Blob(mp3Data, { type: "audio/mp3" });
//           resolve(mp3Blob);
//         } catch (error) {
//           reject(error);
//         }
//       };
//       reader.onerror = (error) => reject(error);
//       reader.readAsArrayBuffer(webmBlob);
//     });
//   };

//   return (
//     <>
//       <Navbar />
//       <div dir="rtl" className="recitation-container">
//         <div className="recitation-card">
//           <h1 className="recitation-title">
//             <FontAwesomeIcon icon={faMicrophone} /> تسميع
//           </h1>
//           <p className="recitation-description">
//             هل أنت جاهز للتسميع؟ اضغط على الزر أدناه لبدء التسجيل. سيظهر النص بعد انتهاء التسجيل.
//           </p>
//           {!isRecording ? (
//             <button onClick={startRecording} className="start-button">
//               ابدأ تسميع هذه الآية
//             </button>
//           ) : (
//             <div className="recording-container">
//               <p className="timer-text">جاري التسجيل... الوقت المتبقي: {timeLeft} ثانية</p>
//               <button onClick={stopRecording} className="stop-button">
//                 إنهاء التسجيل
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Recitation;
/***************************************************************************** */
// import { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Navbar from "../Components/DashboardNavbar";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
// import lamejs from "lamejs";
// import "../styles/recitation.css";

// const Recitation = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(30); // 30 seconds max
//   // @ts-ignore
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef([]);
//   // @ts-ignore
//   const timerRef = useRef<number | null>(null);
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const { surahId, verseNumber, surahName } = state || {};

//   useEffect(() => {
//     if (isRecording) {
//       // @ts-ignore
//       timerRef.current = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 1) {
//             stopRecording();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     } else {
//       // @ts-ignore
//       if (timerRef.current) clearInterval(timerRef.current);
//     }

//     return () => {
//       // @ts-ignore
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [isRecording]);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       // @ts-ignore
//       mediaRecorderRef.current = new MediaRecorder(stream);
//       audioChunksRef.current = [];

//       // @ts-ignore
//       mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
//         // @ts-ignore
//         audioChunksRef.current.push(event.data);
//       };

//       // @ts-ignore
//       mediaRecorderRef.current.onstop = async () => {
//         // @ts-ignore
//         if (mediaRecorderRef.current) {
//           const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//           console.log("Audio Blob Size (webm):", audioBlob.size);

//           // Convert webm to MP3 using lamejs
//           const mp3Blob = await convertToMP3(audioBlob);

//           const formData = new FormData();
//           formData.append("audio", mp3Blob, "recitation.mp3");
//           formData.append("surah_id", surahId);
//           formData.append("verse_number", verseNumber);

//           try {
//             const token = localStorage.getItem("access_token");
//             const response = await fetch("http://localhost:8000/api/v1/student/recitation/check", {
//               method: "POST",
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//               body: formData,
//             });

//             if (!response.ok) {
//               throw new Error("فشل في التحقق من التسميع");
//             }

//             const data = await response.json();
//             console.log("API Response:", data);
//             navigate("/recitation-feedback", { state: { feedback: data, surahName, verseNumber } });
//           } catch (error) {
//             console.error("Error submitting recitation:", error);
//           }
//         }
//       };

//       // @ts-ignore
//       if (mediaRecorderRef.current) mediaRecorderRef.current.start();
//       setIsRecording(true);
//       setTimeLeft(30);
//     } catch (error) {
//       console.error("Error starting recording:", error);
//     }
//   };

//   const stopRecording = () => {
//     // @ts-ignore
//     if (mediaRecorderRef.current) {
//       // @ts-ignore
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   // Function to convert webm to MP3 using lamejs
//   const convertToMP3 = async (webmBlob: Blob) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = async (event) => {
//         if (!event.target || !event.target.result) {
//           reject(new Error("Failed to read audio data"));
//           return;
//         }
//         try {
//           const audioContext = new AudioContext();
//           const arrayBuffer = event.target.result as ArrayBuffer;
//           const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

//           // Convert to WAV (lamejs needs WAV-like data)
//           const wavData = audioBufferToWav(audioBuffer);

//           // Convert WAV to MP3 using lamejs
//           const mp3Encoder = new lamejs.Mp3Encoder(1, audioBuffer.sampleRate, 128); // 1 channel, 128 kbps
//           const mp3Data = [];

//           const samples = wavData.getChannelData(0);
//           const sampleBlockSize = 1152; // MP3 frame size
//           for (let i = 0; i < samples.length; i += sampleBlockSize) {
//             const sampleChunk = samples.subarray(i, i + sampleBlockSize);
//             const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
//             if (mp3buf.length > 0) {
//               mp3Data.push(mp3buf);
//             }
//           }
//           const mp3buf = mp3Encoder.flush();
//           if (mp3buf.length > 0) {
//             mp3Data.push(mp3buf);
//           }

//           const mp3Blob = new Blob(mp3Data, { type: "audio/mp3" });
//           console.log("MP3 Blob Size:", mp3Blob.size);
//           resolve(mp3Blob);
//         } catch (error) {
//           reject(error);
//         }
//       };
//       reader.onerror = (error) => reject(error);
//       reader.readAsArrayBuffer(webmBlob);
//     });
//   };

//   // Helper function to convert AudioBuffer to WAV
//   const audioBufferToWav = (buffer: AudioBuffer) => {
//     const numOfChan = buffer.numberOfChannels;
//     const length = buffer.length * numOfChan * 2 + 44;
//     const bufferArray = new ArrayBuffer(length);
//     const view = new DataView(bufferArray);

//     const writeString = (view: DataView, offset: number, string: string) => {
//       for (let i = 0; i < string.length; i++) {
//         view.setUint8(offset + i, string.charCodeAt(i));
//       }
//     };

//     writeString(view, 0, "RIFF");
//     view.setUint32(4, 36 + buffer.length * numOfChan * 2, true);
//     writeString(view, 8, "WAVE");
//     writeString(view, 12, "fmt ");
//     view.setUint32(16, 16, true);
//     view.setUint16(20, 1, true);
//     view.setUint16(22, numOfChan, true);
//     view.setUint32(24, buffer.sampleRate, true);
//     view.setUint32(28, buffer.sampleRate * numOfChan * 2, true);
//     view.setUint16(32, numOfChan * 2, true);
//     view.setUint16(34, 16, true);
//     writeString(view, 36, "data");
//     view.setUint32(40, buffer.length * numOfChan * 2, true);

//     // Write PCM samples
//     const samples = buffer.getChannelData(0);
//     let offset = 44;
//     for (let i = 0; i < buffer.length; i++, offset += 2) {
//       const sample = Math.max(-1, Math.min(1, samples[i]));
//       view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
//     }

//     return buffer; // هنا يفضل ترجع view بدل buffer لأن buffer مش مناسب هنا
//   };

//   return (
//     <>
//       <Navbar />
//       <div dir="rtl" className="recitation-container">
//         <div className="recitation-card">
//           <h1 className="recitation-title">
//             <FontAwesomeIcon icon={faMicrophone} /> تسميع
//           </h1>
//           <p className="recitation-description">
//             هل أنت جاهز للتسميع؟ اضغط على الزر أدناه لبدء التسجيل. سيظهر النص بعد انتهاء التسجيل.
//           </p>
//           {!isRecording ? (
//             <button onClick={startRecording} className="start-button">
//               ابدأ تسميع هذه الآية
//             </button>
//           ) : (
//             <div className="recording-container">
//               <p className="timer-text">جاري التسجيل... الوقت المتبقي: {timeLeft} ثانية</p>
//               <button onClick={stopRecording} className="stop-button">
//                 إنهاء التسجيل
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Recitation;
/************************************* .webm ***************************************** */
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
//         console.log("Audio Blob Size:", audioBlob.size); // التأكد إن التسجيل مش فاضي
//         const formData = new FormData()
//         formData.append("audio", audioBlob, "recitation.webm")
//         formData.append("surah_id", surahId)
//         formData.append("verse_number", verseNumber)

//       // mediaRecorderRef.current.onstop = async () => {
//       //   const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
//       //   const formData = new FormData()
//       //   formData.append("audio", audioBlob, "recitation.webm")
//       //   formData.append("surah_id", surahId) // Adjusted to match API expectation
//       //   formData.append("verse_number", verseNumber) // Adjusted to match API expectation

//         try {
//           const token = localStorage.getItem("access_token") // Add token for authentication
//           const response = await fetch("http://localhost:8000/api/v1/student/recitation/check", {
//             method: "POST",
//             headers: {
//               "Authorization": `Bearer ${token}`, // Add authentication header
//             },
//             body: formData,
//           })

//           if (!response.ok) {
//             throw new Error("فشل في التحقق من التسميع")
//           }

//           const data = await response.json()
//           console.log("API Response:", data)
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
//     <>
//       <Navbar />
//       <div dir="rtl" className="recitation-container">
//         <div className="recitation-card">
//           <h1 className="recitation-title"> <FontAwesomeIcon icon={faMicrophone} /> تسميع</h1>
//           <p className="recitation-description">
//             هل أنت جاهز للتسميع؟ اضغط على الزر أدناه لبدء التسجيل. سيظهر النص بعد انتهاء التسجيل.
//           </p>
//           {!isRecording ? (
//             <button onClick={startRecording} className="start-button">
//               ابدأ تسميع هذه الآية
//             </button>
//           ) : (
//             <div className="recording-container">
//               <p className="timer-text">جاري التسجيل... الوقت المتبقي: {timeLeft} ثانية</p>
//               <button onClick={stopRecording} className="stop-button">
//                 إنهاء التسجيل
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

// export default Recitation
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
