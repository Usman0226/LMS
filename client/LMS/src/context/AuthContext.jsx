import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  // Mock login function - replace with actual API call
  const login = async (email, password) => {
    // In a real app, this would be an API call to your backend
    // For demo purposes, we'll use mock data
    const mockUsers = [
      { id: 1, name: 'Student User', email: 'student@example.com', role: 'student', token: 'mock-jwt-token' },
      { id: 2, name: 'Teacher User', email: 'teacher@example.com', role: 'teacher', token: 'mock-jwt-token' },
    ];

    const user = mockUsers.find(u => u.email === email && u.role === (email.includes('teacher') ? 'teacher' : 'student'));
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', user.token);
      setCurrentUser(user);
      return { success: true, user };
    }
    
    return { success: false, message: 'Invalid credentials' };
  };

  // Mock register function
  const register = async (userData) => {
    // In a real app, this would be an API call to your backend
    // For demo purposes, we'll just log the data and auto-login
    const newUser = {
      id: Math.floor(Math.random() * 1000),
      ...userData,
      token: 'mock-jwt-token'
    };

    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('token', newUser.token);
    setCurrentUser(newUser);
    
    return { success: true, user: newUser };
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
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
