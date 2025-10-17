import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseListPage from './pages/CourseListPage';
import CourseDetailPage from './pages/CourseDetailPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import AssignmentDetailPage from './pages/AssignmentDetailPage';
import MyGradesPage from './pages/MyGradesPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const DashboardRouter = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return currentUser.role === 'teacher' ? <TeacherDashboardPage /> : <StudentDashboardPage />;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><CourseListPage /></ProtectedRoute>} />
            <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
            <Route path="/assignments/:assignmentId" element={<ProtectedRoute><AssignmentDetailPage /></ProtectedRoute>} />
            <Route path="/grades" element={<ProtectedRoute><MyGradesPage /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
