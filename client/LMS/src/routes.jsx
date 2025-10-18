import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CreateCourse from './pages/CreateCourse';
import MyCourses from './pages/MyCourses';
import ViewSubmissions from './pages/ViewSubmissions';
import MyGrades from './pages/MyGrades';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes - require authentication */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/courses" element={
        <ProtectedRoute>
          <Courses />
        </ProtectedRoute>
      } />

      <Route path="/courses/:courseId" element={
        <ProtectedRoute>
          <CourseDetail />
        </ProtectedRoute>
      } />

      {/* Teacher-only routes */}
      <Route path="/create-course" element={
        <ProtectedRoute role="teacher">
          <CreateCourse />
        </ProtectedRoute>
      } />

      <Route path="/courses/:courseId/submissions" element={
        <ProtectedRoute role="teacher">
          <ViewSubmissions />
        </ProtectedRoute>
      } />

      {/* Student-only routes */}
      <Route path="/my-courses" element={
        <ProtectedRoute role="student">
          <MyCourses />
        </ProtectedRoute>
      } />

      <Route path="/my-grades" element={
        <ProtectedRoute role="student">
          <MyGrades />
        </ProtectedRoute>
      } />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
