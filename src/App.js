import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import StartLearningForm from './Components/StartLearningForm';
import Terms from './Pages/Terms';
import Privacy from './Pages/Privacy';
import TeacherList from "./Components/TeacherList";
import TeacherDetail from "./Components/TeacherDetail";
import LandingPage from './Pages/LandingPage';
import AddCoursePage from './Pages/AddCoursePage';
import AddVideoPage from './Pages/AddVideoPage';
import CourseDetailsPage from './Pages/CourseDetailsPage';
import SheikhDashboard from './Pages/SheikhDashboard';
import ScheduleRequests from './Pages/ScheduleRequests';
import Courses from './Pages/Courses';
import ExamsPage from './Pages/ExamsPage';
import Verification from './Pages/Verification';



const App = () => {
  // Define dummy data for now (we are going to replace with actual data later)
  const currentUser = { id: '123' }; 
  const selectedSheikh = { id: '456' }; 

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/student-dashboard" element={<Dashboard />} />
        <Route
          path="/start-learning-form"
          element={<StartLearningForm userID={currentUser.id} sheikhID={selectedSheikh.id} />}
        />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/landing-page" element={<LandingPage />}/>
        <Route path="/add-course" element={<AddCoursePage/>} />
        <Route path="/add-video" element={<AddVideoPage/>} />
        <Route path="/course-details" element={<CourseDetailsPage/>} />
        <Route path="/teacher-list" element={<TeacherList />} />
        <Route path="/teachers/:id" element={<TeacherDetail />} />
        <Route path="/sheikh-dashboard" element={<SheikhDashboard />} />
        <Route path="/schedule-requests" element={<ScheduleRequests />} /> 
        <Route path="/courses" element={<Courses />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/verify" element={<Verification />} />

 
      </Routes>
    </Router>
  );
};

export default App;
