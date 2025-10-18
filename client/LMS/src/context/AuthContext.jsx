import { createContext, useContext, useState, useEffect } from 'react';

// Backend URL - change this to your production URL when deploying
const BACKEND_URL = 'http://localhost:3000';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by checking for token in cookies
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      // Token exists, user might be logged in
      // We'll verify this on API calls that require authentication
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) {
        setCurrentUser(user);
      }
    }
    setLoading(false);
  }, []);

  // API call to login
  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: includes cookies in the request
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.success) {
        // Store user data in localStorage for easy access
        localStorage.setItem('currentUser', JSON.stringify(data.data.user));
        setCurrentUser(data.data.user);
        console.log('Login successful, user set:', data.data.user);
        return { success: true, user: data.data.user };
      } else {
        console.log('Login failed:', data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please check if the backend server is running.' };
    }
  };

  // API call to register
  const register = async (userData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage for easy access
        localStorage.setItem('currentUser', JSON.stringify(data.data));
        setCurrentUser(data.data);
        return { success: true, user: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    // Call logout API to clear server-side session
    fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(console.error);

    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    isTeacher: currentUser?.role === 'teacher',
    isStudent: currentUser?.role === 'student',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
