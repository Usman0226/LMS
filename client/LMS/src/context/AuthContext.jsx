import { createContext, useContext, useState, useEffect } from 'react';

// Backend URL - change this to your production URL when deploying
const BACKEND_URL = 'http://localhost:3000';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Helper function to safely get the token from cookies
function getToken() {
  const match = document.cookie.match(/(^| )token=([^;]+)/);
  return match ? match[2] : null;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // Skip if we're already initialized
      if (currentUser !== null) return;
      
      try {
        // Check for existing user in localStorage
        const storedUser = localStorage.getItem('currentUser');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          setLoading(false);
          return;
        }

        // If no stored user, try to fetch from backend
        try {
          const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
            credentials: 'include',
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              const userData = data.data.user || data.data;
              localStorage.setItem('currentUser', JSON.stringify(userData));
              setCurrentUser(userData);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('Error fetching user from backend:', error);
        }

        // If we get here, no valid session was found
        setCurrentUser(null);
        
        // Only create mock user in development if explicitly enabled
        if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK_USER === 'true') {
          const mockUser = {
            _id: 'mock-user-id',
            name: 'Test Student',
            email: 'test@student.com',
            role: 'student'
          };
          localStorage.setItem('currentUser', JSON.stringify(mockUser));
          setCurrentUser(mockUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [currentUser]); // Add currentUser to dependency array to prevent multiple initializations
  // Utility check for auth state (not reactive)
  const checkAuth = () => {
    const token = getToken();
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    return !!(token && user);
  };

  // Login function
  const login = async (email, password, role = 'student') => {
    try {
      setLoading(true);
      
      // In development, allow mock login for testing
      if (process.env.NODE_ENV === 'development' && email === 'test@student.com' && password === 'password') {
        const mockUser = {
          _id: 'mock-user-id',
          name: 'Test Student',
          email: 'test@student.com',
          role: role || 'student'
        };
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        setCurrentUser(mockUser);
        return { success: true, user: mockUser };
      }
      
      // Regular login flow
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (data.success) {
        const user = data.data.user || data.data;
        if (role && !user.role) {
          user.role = role;
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        return { success: true, user };
      }
      
      return { 
        success: false, 
        message: data.message || 'Login failed. Please check your credentials.' 
      };
      
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'An error occurred during login. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        const user = data.data.user || data.data;
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        return { success: true, user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: 'An error occurred during registration. Please try again.' 
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call the backend logout endpoint
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear the user from state and localStorage
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      
      // Force a full page reload to clear any application state
      window.location.href = '/login';
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include', // sends the cookie
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const user = data.data.user || data.data;
          localStorage.setItem('currentUser', JSON.stringify(user));
          setCurrentUser(user);
          console.log('✅ Token refreshed successfully');
          return true;
        }
      }

      console.log('❌ Token refresh failed');
      return false;
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      return false;
    }
  };

  const isAuthenticated = !!currentUser;

  const value = {
    currentUser,
    login,
    register,
    logout,
    refreshToken,
    checkAuth,
    isAuthenticated,
    loading, // ✅ added
    isTeacher: currentUser?.role === 'teacher',
    isStudent: currentUser?.role === 'student',
  };

  // ✅ Always render the Provider
  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export default AuthContext;
