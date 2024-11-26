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


const App = () => {
  // Define dummy data for now (we are going to replace with actual data later)
  const currentUser = { id: '123' }; 
  const selectedSheikh = { id: '456' }; 

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/student-dashboard" element={<Dashboard />} />
        <Route
          path="/start-learning-form"
          element={<StartLearningForm userID={currentUser.id} sheikhID={selectedSheikh.id} />}
        />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/teacher-list" element={<TeacherList />} />
        <Route path="/teachers/:id" element={<TeacherDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
