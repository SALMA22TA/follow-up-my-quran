// // // authService.js
// // // import axios from "axios";

// // // const API_URL = 'http://localhost:8000/api/auth';

// // import axios from 'axios';

// // const API_URL = 'http://localhost:8000/api/auth'; // or http://localhost:8000/api/auth/

// // export const login = async (email, password) => {
// //   try {
// //     const response = await axios.post(`${API_URL}login`, {
// //       email,
// //       password
// //     }, {
// //       headers: {
// //         'Content-Type': 'application/json'
// //       }
// //     });
// //     return response.data;
// //   } catch (error) {
// //     throw error.response?.data || error;
// //   }
// // };

// // // const login = async (email, password) => {
// // //   const response = await axios.post(`${API_URL}/login`, { email, password });
// // //   if (response.data.access_token && response.data.refresh_token) {
// // //     localStorage.setItem('access_token', response.data.access_token);
// // //     localStorage.setItem('refresh_token', response.data.refresh_token);
// // //   }
// // //   return response.data;
// // // };

// // // const login = async (email, password) => {
// // //   const response = await axios.post(
// // //     `${API_URL}/login?email=${email}&password=${password}`,
// // //     {}, 
// // //     {
// // //       headers: {
// // //         "Accept": "application/json",
// // //       }
// // //     }
// // //   );

// // //   if (response.data.access_token && response.data.refresh_token) {
// // //     localStorage.setItem('access_token', response.data.access_token);
// // //     localStorage.setItem('refresh_token', response.data.refresh_token);
// // //   }

// // //   return response.data;
// // // };
// // // const login = async (email, password) => {
// // //   try {
// // //     const response = await axios.post('${API_URL}/login', { email, password }); // Send credentials in the body
// // //     return response.data;
// // //   } catch (error) {
// // //     throw error;
// // //   }
// // // };

// // const logout = () => {
// //   localStorage.removeItem('access_token');
// //   localStorage.removeItem('refresh_token');
// // };

// // const refreshToken = async () => {
// //   const refresh_token = localStorage.getItem('refresh_token');
// //   if (!refresh_token) throw new Error("No refresh token available");

// //   const response = await axios.post(`${API_URL}/refresh`, {}, {
// //     headers: {
// //       Authorization: `Bearer ${refresh_token}`
// //     }
// //   });

// //   localStorage.setItem('access_token', response.data.access_token);
// //   return response.data.access_token;
// // };

// // // ✅ Export this if you're using it in ProtectedRoute
// // const getAccessToken = () => {
// //   return localStorage.getItem('access_token');
// // };

// // export { login, logout, refreshToken, getAccessToken };

// // authService.js
// import axios from 'axios';

// // Use environment variable or fallback to a default URL
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/auth/';

// // Login function
// const login = async (email, password) => {
//   try {
//     const response = await axios.post(`${API_URL}login`, {
//       email,
//       password
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       }
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

// // Logout function (example)
// const logout = () => {
//   localStorage.removeItem('token');
// };

// // Refresh token function (example, if needed)
// const refreshToken = async () => {
//   try {
//     const response = await axios.post(`${API_URL}refresh`, {}, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     });
//     localStorage.setItem('token', response.data.access_token);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

// // Get access token function (example)
// const getAccessToken = () => {
//   return localStorage.getItem('token');
// };

// // Export all functions in a single export statement
// export { login, logout, refreshToken, getAccessToken };

// authService.js
import axios from 'axios';

// Ensure the base URL ends with a slash
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/auth/';

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}login`, {
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    console.log('Login response:', response.data); // Debug the response
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Other functions remain unchanged
const logout = () => {
  localStorage.removeItem('token');
};

const refreshToken = async () => {
  try {
    const response = await axios.post(`${API_URL}refresh`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getAccessToken = () => {
  return localStorage.getItem('token');
};

export { login, logout, refreshToken, getAccessToken };



// // // // authService.js
// // // // import axios from "axios";

// // // // const API_URL = 'http://localhost:8000/api/auth';

// // // import axios from 'axios';

// // // const API_URL = 'http://localhost:8000/api/auth'; // or http://localhost:8000/api/auth/

// // // export const login = async (email, password) => {
// // //   try {
// // //     const response = await axios.post(`${API_URL}login`, {
// // //       email,
// // //       password
// // //     }, {
// // //       headers: {
// // //         'Content-Type': 'application/json'
// // //       }
// // //     });
// // //     return response.data;
// // //   } catch (error) {
// // //     throw error.response?.data || error;
// // //   }
// // // };

// // // // const login = async (email, password) => {
// // // //   const response = await axios.post(`${API_URL}/login`, { email, password });
// // // //   if (response.data.access_token && response.data.refresh_token) {
// // // //     localStorage.setItem('access_token', response.data.access_token);
// // // //     localStorage.setItem('refresh_token', response.data.refresh_token);
// // // //   }
// // // //   return response.data;
// // // // };

// // // // const login = async (email, password) => {
// // // //   const response = await axios.post(
// // // //     `${API_URL}/login?email=${email}&password=${password}`,
// // // //     {}, 
// // // //     {
// // // //       headers: {
// // // //         "Accept": "application/json",
// // // //       }
// // // //     }
// // // //   );

// // // //   if (response.data.access_token && response.data.refresh_token) {
// // // //     localStorage.setItem('access_token', response.data.access_token);
// // // //     localStorage.setItem('refresh_token', response.data.refresh_token);
// // // //   }

// // // //   return response.data;
// // // // };
// // // // const login = async (email, password) => {
// // // //   try {
// // // //     const response = await axios.post('${API_URL}/login', { email, password }); // Send credentials in the body
// // // //     return response.data;
// // // //   } catch (error) {
// // // //     throw error;
// // // //   }
// // // // };

// // // const logout = () => {
// // //   localStorage.removeItem('access_token');
// // //   localStorage.removeItem('refresh_token');
// // // };

// // // const refreshToken = async () => {
// // //   const refresh_token = localStorage.getItem('refresh_token');
// // //   if (!refresh_token) throw new Error("No refresh token available");

// // //   const response = await axios.post(`${API_URL}/refresh`, {}, {
// // //     headers: {
// // //       Authorization: `Bearer ${refresh_token}`
// // //     }
// // //   });

// // //   localStorage.setItem('access_token', response.data.access_token);
// // //   return response.data.access_token;
// // // };

// // // // ✅ Export this if you're using it in ProtectedRoute
// // // const getAccessToken = () => {
// // //   return localStorage.getItem('access_token');
// // // };

// // // export { login, logout, refreshToken, getAccessToken };

// // // authService.js
// // import axios from 'axios';

// // // Use environment variable or fallback to a default URL
// // const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/auth/';

// // // Login function
// // const login = async (email, password) => {
// //   try {
// //     const response = await axios.post(`${API_URL}login`, {
// //       email,
// //       password
// //     }, {
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Accept': 'application/json'
// //       }
// //     });
// //     return response.data;
// //   } catch (error) {
// //     throw error.response?.data || error;
// //   }
// // };

// // // Logout function (example)
// // const logout = () => {
// //   localStorage.removeItem('token');
// // };

// // // Refresh token function (example, if needed)
// // const refreshToken = async () => {
// //   try {
// //     const response = await axios.post(`${API_URL}refresh`, {}, {
// //       headers: {
// //         'Authorization': `Bearer ${localStorage.getItem('token')}`
// //       }
// //     });
// //     localStorage.setItem('token', response.data.access_token);
// //     return response.data;
// //   } catch (error) {
// //     throw error.response?.data || error;
// //   }
// // };

// // // Get access token function (example)
// // const getAccessToken = () => {
// //   return localStorage.getItem('token');
// // };

// // // Export all functions in a single export statement
// // export { login, logout, refreshToken, getAccessToken };

// // authService.js
// // import axios from 'axios';

// // // Ensure the base URL ends with a slash
// // const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/auth/';

// // const login = async (email, password) => {
// //   try {
// //     const response = await axios.post(`${API_URL}login`, {
// //       email,
// //       password,
// //     }, {
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Accept': 'application/json',
// //       },
// //     });
// //     console.log('Login response:', response.data); // Debug the response
// //     return response.data;
// //   } catch (error) {
// //     console.error('Login error:', error.response?.data || error);
// //     throw error.response?.data || error;
// //   }
// // };

// // // Other functions remain unchanged
// // const logout = () => {
// //   localStorage.removeItem('token');
// // };

// // const refreshToken = async () => {
// //   try {
// //     const response = await axios.post(`${API_URL}refresh`, {}, {
// //       headers: {
// //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
// //       },
// //     });
// //     localStorage.setItem('token', response.data.access_token);
// //     return response.data;
// //   } catch (error) {
// //     throw error.response?.data || error;
// //   }
// // };

// // const getAccessToken = () => {
// //   return localStorage.getItem('token');
// // };

// // export { login, logout, refreshToken, getAccessToken };

// // authService.js
// import axios from 'axios';

// // Ensure the base URL ends with a slash
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/auth/';

// // Create an axios instance for authenticated requests
// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
// });

// const login = async (email, password) => {
//   try {
//     const response = await axios.post(`${API_URL}login`, {
//       email,
//       password,
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//     });
//     console.log('Login response:', response.data);

//     // Store both access_token and refresh_token
//     if (response.data.access_token && response.data.refresh_token) {
//       localStorage.setItem('access_token', response.data.access_token);
//       localStorage.setItem('refresh_token', response.data.refresh_token);
//     }

//     return response.data;
//   } catch (error) {
//     console.error('Login error:', error.response?.data || error);
//     throw error.response?.data || error;
//   }
// };

// const logout = () => {
//   localStorage.removeItem('access_token');
//   localStorage.removeItem('refresh_token');
// };

// const refreshToken = async () => {
//   try {
//     const refresh_token = localStorage.getItem('refresh_token');
//     if (!refresh_token) throw new Error('No refresh token available');

//     const response = await axios.post(`${API_URL}refresh`, {}, {
//       headers: {
//         'Authorization': `Bearer ${refresh_token}`,
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//     });

//     // Update the access_token in localStorage
//     localStorage.setItem('access_token', response.data.access_token);
//     // Optionally update refresh_token if the backend returns a new one
//     if (response.data.refresh_token) {
//       localStorage.setItem('refresh_token', response.data.refresh_token);
//     }

//     return response.data.access_token;
//   } catch (error) {
//     console.error('Refresh token error:', error.response?.data || error);
//     throw error.response?.data || error;
//   }
// };

// const getAccessToken = () => {
//   return localStorage.getItem('access_token');
// };

// // Axios interceptor to handle token refreshing
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = getAccessToken();
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If the error is 401 (Unauthorized) and we haven't retried yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const newAccessToken = await refreshToken();
//         originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//         return axiosInstance(originalRequest); // Retry the original request with the new token
//       } catch (refreshError) {
//         // If refresh fails, log out the user
//         logout();
//         window.location.href = '/login'; // Redirect to login
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// // Example function to fetch user profile using the axios instance
// const getUserProfile = async () => {
//   try {
//     const response = await axiosInstance.get('user-profile');
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };

// export { login, logout, refreshToken, getAccessToken, getUserProfile, axiosInstance };
