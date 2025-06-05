
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import StartLearningForm from './Components/StartLearningForm';
import Terms from './Pages/Terms';
import Privacy from './Pages/Privacy';
import TeacherList from './Components/TeacherList';
import TeacherDetail from './Components/TeacherDetail';
import LandingPage from './Pages/LandingPage';
import AddCoursePage from './Pages/AddCoursePage';
import AddVideoPage from './Pages/AddVideoPage';
import SheikhDashboard from './Pages/SheikhDashboard';
import ScheduleRequests from './Pages/ScheduleRequests';
import Courses from './Pages/Courses';
import ExamsPage from './Pages/ExamsPage';
import Verification from './Pages/Verification';
import ProtectedRoute from './Components/ProtectedRoute';
import TodaysSessions from './Components/TodaysSessions';
import ExamQuestions from './Pages/ExamQuestions';
import ExamAnswers from './Pages/ExamAnswers';
import CourseDetails from './Pages/CourseDetails';
import GenerateSessions from './Pages/GenerateSessions';
import AdminDashboard from './Pages/AdminDashboard'; 
import { getAccessToken } from './services/authService';
import { jwtDecode } from 'jwt-decode';
import MainLayout from './Components/MainLayout';
import NotFound from './Pages/NotFound';
import SelectVerse from './Pages/SelectVerse';
import Recitation from './Pages/Recitation';
import RecitationFeedback from './Pages/RecitationFeedback';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = getAccessToken();
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_role');
            navigate('/login', { state: { message: 'Your session has expired, please log in again' } });
          }
        } catch (error) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_role');
          navigate('/login', { state: { message: 'Invalid token, please log in again' } });
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000);
    checkTokenExpiration();
    return () => clearInterval(interval);
  }, [navigate]);

  const currentUser = { id: '123' };
  const selectedSheikh = { id: '456' };

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/teacher-list" element={<TeacherList />} />
      <Route path="/teachers/:id" element={<TeacherDetail />} />
      <Route path="/verify" element={<Verification />} />

      <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute 

            allowedRoles={[0]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute 

            allowedRoles={[1]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      <Route
        path="/start-learning-form"
        element={
          <ProtectedRoute 

          allowedRoles={[0]}>
            <MainLayout>
              <StartLearningForm userID={currentUser.id} sheikhID={selectedSheikh.id} />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-course"
        element={
          <ProtectedRoute 

          allowedRoles={[2]}>
            <MainLayout>
              <AddCoursePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-video/:courseId"
        element={
          <ProtectedRoute 

          allowedRoles={[2]}>
            <MainLayout>
              <AddVideoPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sheikh-dashboard"
        element={
          <ProtectedRoute 

          allowedRoles={[2]}>
            <MainLayout>
              <SheikhDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule-requests"
        element={
          <ProtectedRoute 

          allowedRoles={[2]}>
            <MainLayout>
              <ScheduleRequests />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute 

          allowedRoles={[2]}>
            <MainLayout>
              <Courses />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams"
        element={
          <ProtectedRoute 

          allowedRoles={[2]}>
            <MainLayout>
              <ExamsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exam/:examId/questions"
        element={
          <ProtectedRoute 

          allowedRoles={[2]}>
            <MainLayout>
              <ExamQuestions />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exam-answers/:questionId"
        element={
          <ProtectedRoute 

          allowedRoles={[2]}>
            <MainLayout>
              <ExamAnswers />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/today-sessions"
        element={
          <ProtectedRoute 

          allowedRoles={[2]}>
            <MainLayout>
              <TodaysSessions />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/course/:id"
        element={
          <ProtectedRoute 

          allowedRoles={[2]}>
            <MainLayout>
              <CourseDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate-sessions"
        element={
          <ProtectedRoute 

          allowedRoles={[2]}>
            <MainLayout>
              <GenerateSessions />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
          path="/select-verse"
          element={
            <ProtectedRoute 

            allowedRoles={[0]}>
              <SelectVerse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recitation"
          element={
            <ProtectedRoute 

            allowedRoles={[0]}>
              <Recitation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recitation-feedback"
          element={
            <ProtectedRoute 

            allowedRoles={[0]}>
              <RecitationFeedback />
            </ProtectedRoute>
          }
        />

      {/* Wildcard route for invalid paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
/************************************* Latest *********************************************** */
// import React, { useEffect } from 'react';
// import { Routes, Route, useNavigate } from 'react-router-dom';
// import Register from './Pages/Register';
// import Login from './Pages/Login';
// import Dashboard from './Pages/Dashboard';
// import StartLearningForm from './Components/StartLearningForm';
// import Terms from './Pages/Terms';
// import Privacy from './Pages/Privacy';
// import TeacherList from './Components/TeacherList';
// import TeacherDetail from './Components/TeacherDetail';
// import LandingPage from './Pages/LandingPage';
// import AddCoursePage from './Pages/AddCoursePage';
// import AddVideoPage from './Pages/AddVideoPage';
// import SheikhDashboard from './Pages/SheikhDashboard';
// import ScheduleRequests from './Pages/ScheduleRequests';
// import Courses from './Pages/Courses';
// import ExamsPage from './Pages/ExamsPage';
// import Verification from './Pages/Verification';
// import ProtectedRoute from './Components/ProtectedRoute';
// import TodaysSessions from './Components/TodaysSessions';
// import ExamQuestions from './Pages/ExamQuestions';
// import ExamAnswers from './Pages/ExamAnswers';
// import CourseDetails from './Pages/CourseDetails';
// import GenerateSessions from './Pages/GenerateSessions';
// import { getAccessToken } from './services/authService';
// import { jwtDecode } from 'jwt-decode';
// import MainLayout from './Components/MainLayout'; 

// const App = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkTokenExpiration = () => {
//       const token = getAccessToken();
//       if (token) {
//         try {
//           const decodedToken = jwtDecode(token);
//           const currentTime = Date.now() / 1000;
//           if (decodedToken.exp < currentTime) {
//             localStorage.removeItem('access_token');
//             navigate('/login', { state: { message: 'Your session has expired, please log in again' } });
//           }
//         } catch (error) {
//           localStorage.removeItem('access_token');
//           navigate('/login', { state: { message: 'Invalid token, please log in again' } });
//         }
//       }
//     };

//     const interval = setInterval(checkTokenExpiration, 60000);
//     checkTokenExpiration();
//     return () => clearInterval(interval);
//   }, [navigate]);

//   const currentUser = { id: '123' };
//   const selectedSheikh = { id: '456' };

//   return (
//     <Routes>
//       <Route path="/register" element={<Register />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/terms" element={<Terms />} />
//       <Route path="/privacy" element={<Privacy />} />
//       <Route path="/landing-page" element={<LandingPage />} />
//       <Route path="/teacher-list" element={<TeacherList />} />
//       <Route path="/teachers/:id" element={<TeacherDetail />} />
//       <Route path="/verify" element={<Verification />} />

    
//       <Route
//         path="/student-dashboard"
//         element={
//           <ProtectedRoute>
//             <MainLayout>
//               <Dashboard />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/start-learning-form"
//         element={
//           <ProtectedRoute>
//             <MainLayout>
//               <StartLearningForm userID={currentUser.id} sheikhID={selectedSheikh.id} />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/add-course"
//         element={
//           <ProtectedRoute>
//             <MainLayout>
//               <AddCoursePage />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/add-video/:courseId"
//         element={
//           <ProtectedRoute>
//             <MainLayout>
//               <AddVideoPage />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/sheikh-dashboard"
//         element={
//           <ProtectedRoute>
//             <MainLayout>
//               <SheikhDashboard />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/schedule-requests"
//         element={
//           <ProtectedRoute>
//             <MainLayout>
//               <ScheduleRequests />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/courses"
//         element={
//           <ProtectedRoute>
//             <MainLayout>
//               <Courses />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/exams"
//         element={
//           <ProtectedRoute>
//             <MainLayout>
//               <ExamsPage />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/exam/:examId/questions"
//         element={
//           <ProtectedRoute>
//             <MainLayout>
//               <ExamQuestions />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/exam-answers/:questionId"
//         element={
//           <ProtectedRoute>
//             <MainLayout>
//               <ExamAnswers />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/today-sessions"
//         element={
//           <ProtectedRoute>
//             <MainLayout>
//               <TodaysSessions />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/course/:id"
//         element={
//           <ProtectedRoute>
//             <MainLayout>
//               <CourseDetails />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/generate-sessions"
//         element={
//           <ProtectedRoute>
//             <MainLayout>
//               <GenerateSessions />
//             </MainLayout>
//           </ProtectedRoute>
//         }
//       />
//     </Routes>
//   );
// };

// export default App;

/********************************** Latest *************************************** */
// import React, { useEffect } from 'react';
// import { Routes, Route, useNavigate } from 'react-router-dom';
// import Register from './Pages/Register';
// import Login from './Pages/Login';
// import Dashboard from './Pages/Dashboard';
// import StartLearningForm from './Components/StartLearningForm';
// import Terms from './Pages/Terms';
// import Privacy from './Pages/Privacy';
// import TeacherList from './Components/TeacherList';
// import TeacherDetail from './Components/TeacherDetail';
// import LandingPage from './Pages/LandingPage';
// import AddCoursePage from './Pages/AddCoursePage';
// import AddVideoPage from './Pages/AddVideoPage';
// import SheikhDashboard from './Pages/SheikhDashboard';
// import ScheduleRequests from './Pages/ScheduleRequests';
// import Courses from './Pages/Courses';
// import ExamsPage from './Pages/ExamsPage';
// import Verification from './Pages/Verification';
// import ProtectedRoute from './Components/ProtectedRoute';
// import TodaysSessions from './Components/TodaysSessions';
// import ExamQuestions from './Pages/ExamQuestions';
// import ExamAnswers from './Pages/ExamAnswers';
// import CourseDetails from './Pages/CourseDetails';
// import { getAccessToken } from './services/authService';
// import { jwtDecode } from 'jwt-decode';

// const App = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkTokenExpiration = () => {
//       const token = getAccessToken();
//       if (token) {
//         try {
//           const decodedToken = jwtDecode(token);
//           const currentTime = Date.now() / 1000;
//           if (decodedToken.exp < currentTime) {
//             localStorage.removeItem('access_token');
//             navigate('/login', { state: { message: 'Your session has expired, please log in again' } });
//           }
//         } catch (error) {
//           localStorage.removeItem('access_token');
//           navigate('/login', { state: { message: 'Invalid token, please log in again' } });
//         }
//       }
//     };

//     // Check token expiration every 60 seconds
//     const interval = setInterval(checkTokenExpiration, 60000);

//     // Run the check immediately on mount
//     checkTokenExpiration();

//     // Clean up the interval on unmount
//     return () => clearInterval(interval);
//   }, [navigate]);

//   const currentUser = { id: '123' };
//   const selectedSheikh = { id: '456' };

//   return (
//     <Routes>
//       <Route path="/register" element={<Register />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/student-dashboard" element={<Dashboard />} />
//       <Route
//         path="/start-learning-form"
//         element={<StartLearningForm userID={currentUser.id} sheikhID={selectedSheikh.id} />}
//       />
//       <Route path="/terms" element={<Terms />} />
//       <Route path="/privacy" element={<Privacy />} />
//       <Route path="/landing-page" element={<LandingPage />} />
//       <Route
//         path="/add-course"
//         element={
//           <ProtectedRoute>
//             <AddCoursePage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/add-video/:courseId"
//         element={
//           <ProtectedRoute>
//             <AddVideoPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route path="/teacher-list" element={<TeacherList />} />
//       <Route path="/teachers/:id" element={<TeacherDetail />} />
//       <Route
//         path="/sheikh-dashboard"
//         element={
//           <ProtectedRoute>
//             <SheikhDashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/schedule-requests"
//         element={
//           <ProtectedRoute>
//             <ScheduleRequests />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/courses"
//         element={
//           <ProtectedRoute>
//             <Courses />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/exams"
//         element={
//           <ProtectedRoute>
//             <ExamsPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/exam/:examId/questions"
//         element={
//           <ProtectedRoute>
//             <ExamQuestions />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/exam-answers/:questionId"
//         element={
//           <ProtectedRoute>
//             <ExamAnswers />
//           </ProtectedRoute>
//         }
//       />
//       <Route path="/verify" element={<Verification />} />
//       <Route
//         path="/today-sessions"
//         element={
//           <ProtectedRoute>
//             <TodaysSessions />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/course/:id"
//         element={
//           <ProtectedRoute>
//             <CourseDetails />
//           </ProtectedRoute>
//         }
//       />
//     </Routes>
//   );
// };
//export default App;

/************************************************************************** */
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Register from './Pages/Register';
// import Login from './Pages/Login';
// import Dashboard from './Pages/Dashboard';
// import StartLearningForm from './Components/StartLearningForm';
// import Terms from './Pages/Terms';
// import Privacy from './Pages/Privacy';
// import TeacherList from "./Components/TeacherList";
// import TeacherDetail from "./Components/TeacherDetail";
// import LandingPage from './Pages/LandingPage';
// import AddCoursePage from './Pages/AddCoursePage';
// import AddVideoPage from './Pages/AddVideoPage';
// // import CourseDetailsPage from './Pages/CourseDetailsPage';
// import SheikhDashboard from './Pages/SheikhDashboard';
// import ScheduleRequests from './Pages/ScheduleRequests';
// import Courses from './Pages/Courses';
// import ExamsPage from './Pages/ExamsPage';
// import Verification from './Pages/Verification';
// import ProtectedRoute from './Components/ProtectedRoute';
// import TodaysSessions from './Components/TodaysSessions';
// // import ExamDetailsPage from "./Pages/ExamDetails";
// import ExamQuestions from "./Pages/ExamQuestions"; 
// import ExamAnswers from "./Pages/ExamAnswers"; 
// import CourseDetails from "./Pages/CourseDetails";
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getAccessToken } from './services/authService';
// import { jwtDecode } from 'jwt-decode';


// const App = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkTokenExpiration = () => {
//       const token = getAccessToken();
//       if (token) {
//         try {
//           const decodedToken = jwtDecode(token);
//           const currentTime = Date.now() / 1000;
//           if (decodedToken.exp < currentTime) {
//             localStorage.removeItem('access_token');
//             navigate('/login', { state: { message: 'Your session has expired, please log in again' } });
//           }
//         } catch (error) {
//           localStorage.removeItem('access_token');
//           navigate('/login', { state: { message: 'Invalid token, please log in again' } });
//         }
//       }
//     };

//     // Check token expiration every 60 seconds
//     const interval = setInterval(checkTokenExpiration, 60000);

//     // Run the check immediately on mount
//     checkTokenExpiration();

//     // Clean up the interval on unmount
//     return () => clearInterval(interval);
//   }, [navigate]);

//   const currentUser = { id: '123' };
//   const selectedSheikh = { id: '456' };

//   return (
//     <Router>
//       <Routes>
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/student-dashboard" element={<Dashboard />} />
//         <Route
//           path="/start-learning-form"
//           element={<StartLearningForm userID={currentUser.id} sheikhID={selectedSheikh.id} />}
//         />
//         <Route path="/terms" element={<Terms />} />
//         <Route path="/privacy" element={<Privacy />} />
//         <Route path="/landing-page" element={<LandingPage />} />
//         <Route
//           path="/add-course"
//           element={
//             <ProtectedRoute>
//               <AddCoursePage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/add-video/:courseId"
//           element={
//             <ProtectedRoute>
//               <AddVideoPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/teacher-list" element={<TeacherList />} />
//         <Route path="/teachers/:id" element={<TeacherDetail />} />
//         <Route
//           path="/sheikh-dashboard"
//           element={
//             <ProtectedRoute>
//               <SheikhDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/schedule-requests"
//           element={
//             <ProtectedRoute>
//               <ScheduleRequests />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/courses"
//           element={
//             <ProtectedRoute>
//               <Courses />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/exams"
//           element={
//             <ProtectedRoute>
//               <ExamsPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/exam/:examId/questions"
//           element={
//             <ProtectedRoute>
//               <ExamQuestions />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/exam-answers/:questionId"
//           element={
//             <ProtectedRoute>
//               <ExamAnswers />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/verify" element={<Verification />} />
//         <Route
//           path="/today-sessions"
//           element={
//             <ProtectedRoute>
//               <TodaysSessions />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/course/:id"
//           element={
//             <ProtectedRoute>
//               <CourseDetails />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// };
//export default App;
/********************************************************** */
// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("access_token");
//   console.log("ProtectedRoute token:", token);
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };
// const App = () => {
//   // Define dummy data for now (we are going to replace with actual data later)
//   const currentUser = { id: '123' }; 
//   const selectedSheikh = { id: '456' }; 

//   return (
//     <Router>
//       <Routes>
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/student-dashboard" element={<Dashboard />} />
//         <Route
//           path="/start-learning-form"
//           element={<StartLearningForm userID={currentUser.id} sheikhID={selectedSheikh.id} />}
//         />
//         <Route path="/terms" element={<Terms />} />
//         <Route path="/privacy" element={<Privacy />} />
//         <Route path="/landing-page" element={<LandingPage />}/>
//         {/* <Route path="/add-course" element={<AddCoursePage/>} /> */}
//         <Route
//         path="/add-course"
//         element={
//           <ProtectedRoute>
//             <AddCoursePage />
//           </ProtectedRoute>
//         }
//       />
//         {/* <Route path="/add-video" element={<AddVideoPage/>} /> */}
//         <Route
//           path="/add-video/:courseId" 
//           element={
//             <ProtectedRoute>
//               <AddVideoPage />
//             </ProtectedRoute>
//           }
//         />
//         {/* <Route path="/course-details" element={<CourseDetailsPage/>} /> */}
//         <Route path="/teacher-list" element={<TeacherList />} />
//         <Route path="/teachers/:id" element={<TeacherDetail />} />
//         {/* <Route path="/sheikh-dashboard" element={<SheikhDashboard />} /> */}
//         <Route
//           path="/sheikh-dashboard"
//           element={
//             <ProtectedRoute>
//               <SheikhDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/schedule-requests"
//           element={
//             <ProtectedRoute>
//               <ScheduleRequests />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//         path="/courses"
//         element={
//           <ProtectedRoute>
//             <Courses />
//           </ProtectedRoute>
//         }
//       />
//         <Route
//         path="/exams" 
//         element={
//           <ProtectedRoute>
//             <ExamsPage />
//           </ProtectedRoute>
//         }
//       />
//       {/* <Route
//         path="/exam/:id" 
//         element={
//           <ProtectedRoute>
//             <ExamDetailsPage />
//           </ProtectedRoute>
//         }
//       /> */}
//       <Route
//         path="/exam/:examId/questions" 
//         element={
//           <ProtectedRoute>
//             <ExamQuestions />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/exam-answers/:questionId" 
//         element={
//           <ProtectedRoute>
//             <ExamAnswers />
//           </ProtectedRoute>
//         }
//       />
//         <Route path="/verify" element={<Verification />} />

//         <Route
//         path="/today-sessions" 
//         element={
//           <ProtectedRoute>
//             <TodaysSessions />
//           </ProtectedRoute>
//         }
//       />
//       <Route 
//       path="/course/:id" 
//       element={
//         <ProtectedRoute>
//           <CourseDetails />
//         </ProtectedRoute>
//       } 
//       />
      
//       </Routes>
//     </Router>
//   );
// };
//export default App;
/**************************************************************************** */
