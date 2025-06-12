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
import CourseDetailsPage from './Pages/CourseDetailsPage';
import VideoDetailsPage from './Pages/VideoDetailsPage';
import GenerateSessions from './Pages/GenerateSessions';
import AdminDashboard from './Pages/AdminDashboard'; 
import { getAccessToken } from './services/authService';
import { jwtDecode } from 'jwt-decode';
import MainLayout from './Components/MainLayout'; 
import StudentDashboard from './Pages/StudentDashboard';
import NotFound from './Pages/NotFound';
import CourseDetails from './Pages/CourseDetails'

import TeachersList from './Pages/TeachersList';
import StudentRequests from './Pages/StudentRequests';
import RequestSchedule from './Components/RequestSchedule';
import StdCoursesPage from "./Pages/StdCoursesPage";
import StudentExamsPage from "./Pages/StudentExamsPage"
import StdExamQuestions from './Pages/StdExamQuestions';
import StudentPlansPage from './Pages/StudentPlansPage';
import TeacherProfile from './Pages/TeacherProfile';
import TeacherFeedbacks from './Pages/TeacherFeedbacks';
import AdminCoursesSupervision from './Pages/AdminCoursesSupervision';
import SuperviseExams from './Pages/SuperviseExams';
import ReportsFeedback from './Pages/ReportsFeedback';
import AdminTeachers from './Pages/AdminTeachers';
import TeacherNotification from './Pages/TeacherNotification';
import AdminStudents from './Pages/AdminStudents';
import StudentNotification from './Pages/StudentNotification';


import SelectVerse from './Pages/SelectVerse';
import Recitation from './Pages/Recitation';
import RecitationFeedback from './Pages/RecitationFeedback';
import ComingSoonTeacher from './Pages/coming-soon-teacher';


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
          <ProtectedRoute allowedRoles={[0]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/teachers" element={<TeachersList />} />
      <Route path="/student-requests" element={<StudentRequests />} />
      <Route path="/request-schedule" element={<RequestSchedule />} />
      <Route path="/student-courses" element={<StdCoursesPage />} />
      <Route path="/course/:courseId" element={<CourseDetailsPage />} />
      <Route path="/course/:courseId/video/:videoId" element={<VideoDetailsPage />} />
      <Route path="/student-exams" element={<StudentExamsPage />} />
      <Route path="/exam/:id/student-exams-ques" element={<StdExamQuestions />} />
      <Route path="/progress" element={<StudentPlansPage />} />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/start-learning-form"
        element={
          <ProtectedRoute allowedRoles={[0]}>
            <MainLayout>
              <StartLearningForm userID={currentUser.id} sheikhID={selectedSheikh.id} />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-course"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <MainLayout>
              <AddCoursePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-video/:courseId"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <MainLayout>
              <AddVideoPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sheikh-dashboard"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <MainLayout>
              <SheikhDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule-requests"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <MainLayout>
              <ScheduleRequests />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <MainLayout>
              <Courses />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <MainLayout>
              <ExamsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exam/:examId/questions"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <MainLayout>
              <ExamQuestions />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exam-answers/:questionId"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <MainLayout>
              <ExamAnswers />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/today-sessions"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <MainLayout>
              <TodaysSessions />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/course/:id"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <MainLayout>
              <CourseDetailsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courseDetails/:id"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <MainLayout>
              <CourseDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate-sessions"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <MainLayout>
              <GenerateSessions />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/teacher/:id" element={<TeacherProfile />} />
      <Route path="/teacher/:id/feedbacks" element={<TeacherFeedbacks />} />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminCoursesSupervision />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exams-supervision"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <SuperviseExams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports-feedback"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <ReportsFeedback />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/teachers"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminTeachers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/teacher-notification/:id"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <TeacherNotification />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/student-notification/:id"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <StudentNotification />
          </ProtectedRoute>
        }
      />

      <Route
          path="/select-verse"
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <SelectVerse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recitation"
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <Recitation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recitation-feedback"
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <RecitationFeedback />
            </ProtectedRoute>
          }
        />
        <Route
        path="/coming-soon-teacher"
        element={
          <ProtectedRoute allowedRoles={[0, 2]}>
            <MainLayout>
              <ComingSoonTeacher />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* Wildcard route for invalid paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
