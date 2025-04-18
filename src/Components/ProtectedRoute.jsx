import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../services/authService';
import { jwtDecode } from 'jwt-decode'; // Use named import

const ProtectedRoute = ({ children }) => {
  const token = getAccessToken();

  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    if (decodedToken.exp < currentTime) {
      console.log("Token expired, redirecting to login");
      localStorage.removeItem('access_token'); // Remove expired token
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    console.error("Invalid token, redirecting to login:", error);
    localStorage.removeItem('access_token'); // Remove invalid token
    return <Navigate to="/login" state={{ message: "Your session has expired, please log in again" }} replace />;
    // return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { getAccessToken } from '../services/authService';

// const ProtectedRoute = ({ children }) => {
//   const token = getAccessToken();
//   return token ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;