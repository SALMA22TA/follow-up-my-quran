import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAccessToken, getUserRole } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = getAccessToken();
  const role = getUserRole();
  const location = useLocation();

  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/login" state={{ message: "يرجى تسجيل الدخول أولاً.", isError: true }} replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      console.log("Token expired, redirecting to login");
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      return <Navigate to="/login" state={{ message: "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.", isError: true }} replace />;
    }

    // Check if user's role is in the allowed roles array
    if (allowedRoles && !allowedRoles.includes(Number(role))) {
      console.log("Unauthorized access attempt, redirecting to login");
      return <Navigate to="/login" state={{ message: "غير مصرح لك بالوصول لهذه الصفحة.", isError: true }} replace />;
    }

    return children;
  } catch (error) {
    console.error("Invalid token, redirecting to login:", error);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    return <Navigate to="/login" state={{ message: "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.", isError: true }} replace />;
  }
};

export default ProtectedRoute;
/*************************************** Latest ********************************************** */
// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { getAccessToken, getUserRole } from '../services/authService';
// import { jwtDecode } from 'jwt-decode';

// const ProtectedRoute = ({ children }) => {
//   const token = getAccessToken();
//   const role = getUserRole();
//   const location = useLocation();

//   if (!token) {
//     console.log("No token found, redirecting to login");
//     return <Navigate to="/login" state={{ message: "يرجى تسجيل الدخول أولاً." }} replace />;
//   }

//   try {
//     const decodedToken = jwtDecode(token);
//     const currentTime = Date.now() / 1000;

//     if (decodedToken.exp < currentTime) {
//       console.log("Token expired, redirecting to login");
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('user_role');
//       return <Navigate to="/login" state={{ message: "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى." }} replace />;
//     }

//     // Role-based access control for dashboards
//     if (location.pathname === '/student-dashboard' && role !== '0') {
//       return <Navigate to="/login" state={{ message: "غير مصرح لك بالوصول لهذه الصفحة." }} replace />;
//     }
//     if (location.pathname === '/admin-dashboard' && role !== '1') {
//       return <Navigate to="/login" state={{ message: "غير مصرح لك بالوصول لهذه الصفحة." }} replace />;
//     }
//     if (location.pathname === '/sheikh-dashboard' && role !== '2') {
//       return <Navigate to="/login" state={{ message: "غير مصرح لك بالوصول لهذه الصفحة." }} replace />;
//     }

//     return children;
//   } catch (error) {
//     console.error("Invalid token, redirecting to login:", error);
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('user_role');
//     return <Navigate to="/login" state={{ message: "Your session has expired, please log in again" }} replace />;
//   }
// };

// export default ProtectedRoute;
/********************************************************************************** */
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { getAccessToken } from '../services/authService';
// import { jwtDecode } from 'jwt-decode'; // Use named import

// const ProtectedRoute = ({ children }) => {
//   const token = getAccessToken();

//   if (!token) {
//     console.log("No token found, redirecting to login");
//     return <Navigate to="/login" replace />;
//   }

//   try {
//     const decodedToken = jwtDecode(token);
//     const currentTime = Date.now() / 1000; // Current time in seconds

//     if (decodedToken.exp < currentTime) {
//       console.log("Token expired, redirecting to login");
//       localStorage.removeItem('access_token'); // Remove expired token
//       return <Navigate to="/login" replace />;
//     }

//     return children;
//   } catch (error) {
//     console.error("Invalid token, redirecting to login:", error);
//     localStorage.removeItem('access_token'); // Remove invalid token
//     return <Navigate to="/login" state={{ message: "Your session has expired, please log in again" }} replace />;
//     // return <Navigate to="/login" replace />;
//   }
// };

// export default ProtectedRoute;
/*********************************************************************************** */
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { getAccessToken } from '../services/authService';

// const ProtectedRoute = ({ children }) => {
//   const token = getAccessToken();
//   return token ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;