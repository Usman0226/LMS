import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Lazy load pages for better performance
import { lazy, Suspense } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import Layout from '../components/layout/Layout';
import { ErrorBoundary } from '../components/ui';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Courses = lazy(() => import('../pages/Courses'));
const CreateCourse = lazy(() => import('../pages/CreateCourse'));
const MyCourses = lazy(() => import('../pages/MyCourses'));
const CourseContent = lazy(() => import('../pages/CourseContent'));
const CourseDetailPage = lazy(() => import('../pages/CourseDetailPage'));
const CourseAssignments = lazy(() => import('../pages/CourseAssignments'));
const Assignments = lazy(() => import('../pages/Assignments'));
const AssignmentDetailPage = lazy(() => import('../pages/AssignmentDetailPage'));
const Grades = lazy(() => import('../pages/Grades'));
const Forum = lazy(() => import('../pages/Forum'));
const Profile = lazy(() => import('../pages/Profile'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const NotFound = lazy(() => import('../pages/NotFoundPage'));

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  const routesWithoutLayout = ['/login', '/register'];
  const shouldWrapWithLayout = !routesWithoutLayout.includes(location.pathname);

  const routes = (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/create"
          element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>
              <CourseDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:id/content"
          element={
            <ProtectedRoute>
              <CourseContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:id/assignments"
          element={
            <ProtectedRoute>
              <CourseAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <Assignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignment/:id"
          element={
            <ProtectedRoute>
              <AssignmentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grades"
          element={
            <ProtectedRoute>
              <Grades />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum"
          element={
            <ProtectedRoute>
              <Forum />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );

  return shouldWrapWithLayout ? (
    <Layout>
      <ErrorBoundary>
        {routes}
      </ErrorBoundary>
    </Layout>
  ) : (
    routes
  );
};

export default AppRoutes;