// import React, { createContext, useState, useEffect, useContext } from 'react';

// const AuthContext = createContext(null);

// // Define API Gateway base URL for API calls within context
// const API_GATEWAY_BASE_URL = "http://localhost:8765";

// export const AuthProvider = ({ children }) => {
//     // State to hold the current authenticated user's details
//     // Start as null, will be populated on successful authentication
//     const [currentUser, setCurrentUser] = useState(null);
//     // State to indicate if a user is authenticated
//     const [authenticated, setAuthenticated] = useState(false);
//     // State to indicate if the initial authentication check is complete
//     const [loading, setLoading] = useState(true);

//     // Function to fetch user details from backend (requires authentication)
//     // This assumes your backend has an endpoint like /api/user/me
//     const fetchCurrentUser = async () => {
//         try {
//             // Include credentials to send HttpOnly cookies
//             const response = await fetch(`${API_GATEWAY_BASE_URL}/user/me`, { credentials: 'include' });
//             if (response.ok) {
//                 const userData = await response.json();
//                 setCurrentUser(userData);
//                 setAuthenticated(true);
//             } else {
//                 // If not OK (e.g., 401 Unauthorized), clear user data
//                 setCurrentUser(null);
//                 setAuthenticated(false);
//             }
//         } catch (error) {
//             console.error("Error fetching current user:", error);
//             setCurrentUser(null);
//             setAuthenticated(false);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Initial check when component mounts
//     useEffect(() => {
//         fetchCurrentUser();
//     }, []);

//     // Login function: After a successful login API call,
//     // we re-fetch user details to populate the context.
//     // The actual cookie setting is handled by the backend.
//     const login = async () => {
//         // Assume backend has set the HttpOnly cookie.
//         // Now, fetch user details using that newly set cookie.
//         setLoading(true); // Set loading while fetching user details
//         await fetchCurrentUser();
//     };

//     // Logout function: Makes an API call to backend to invalidate session/clear cookie
//     const logout = async () => {
//         try {
//             // Use credentials to send HttpOnly cookie for logout
//             const response = await fetch(`${API_GATEWAY_BASE_URL}/logout`, {
//                 method: 'POST',
//                 credentials: 'include' // Important for sending the session cookie
//             });
//             if (response.ok) {
//                 setCurrentUser(null);
//                 setAuthenticated(false);
//                 // Optionally, clear any client-side cached data here
//                 console.log("Logged out successfully from backend.");
//             } else {
//                 console.error("Logout failed on backend:", await response.text());
//                 // Even if backend logout fails, clear client-side state
//                 setCurrentUser(null);
//                 setAuthenticated(false);
//             }
//         } catch (error) {
//             console.error("Error during logout:", error);
//             // In case of network error, ensure client-side state is cleared
//             setCurrentUser(null);
//             setAuthenticated(false);
//         }
//     };

//     // Provide the authentication state and functions to children components
//     const authContextValue = {
//         currentUser,
//         isAuthenticated: authenticated,
//         loading,
//         login,
//         logout
//     };

//     return (
//         <AuthContext.Provider value={authContextValue}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // Custom hook to easily consume the AuthContext
// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (context === undefined) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };
