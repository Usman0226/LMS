import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { text: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { text: 'Courses', icon: AcademicCapIcon, path: '/courses' },
  { text: 'Assignments', icon: DocumentTextIcon, path: '/assignments' },
  { text: 'Grades', icon: ChartBarIcon, path: '/grades' },
  { text: 'Forum', icon: ChatBubbleLeftRightIcon, path: '/forum' },
  { text: 'Profile', icon: UserCircleIcon, path: '/profile' },
];

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser, isAuthenticated,loading } = useAuth();

  const userInitial = currentUser?.name?.[0]?.toUpperCase() ?? currentUser?.email?.[0]?.toUpperCase() ?? 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If user is not logged in and not on a public route, show login
  const isPublicRoute = ['/login', '/register'].includes(location.pathname);
  if (!isAuthenticated) {
    if (!isPublicRoute) {
      navigate('/login');
    }
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  // Render full layout with navigation for authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar - Only show when authenticated */}
      {isAuthenticated && (
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden transition-colors"
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              aria-expanded={sidebarOpen}
              aria-controls="sidebar"
            >
              {sidebarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link
              to="/dashboard"
              className="flex items-center space-x-3"
              aria-label="Go to dashboard"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <span className="hidden sm:block text-xl font-bold text-gray-900">LMS</span>
            </Link>

            {/* Right side - User menu */}
            <div className="flex items-center space-x-4">
              {/* User Avatar */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-gray-900">{currentUser?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser?.role || 'Student'}</p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white font-semibold text-sm shadow-md">
                  {userInitial}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Sign out of your account"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>)}

      {/* Sidebar - Only show when authenticated */}
      {isAuthenticated && (
      <aside
        className={`fixed top-16 left-0 bottom-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        id="sidebar"
        aria-label="Main navigation"
      >
        <div className="h-full overflow-y-auto px-3 py-6">
          <nav className="space-y-1" role="navigation" aria-label="Main menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span>{item.text}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Logout Button */}
          <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg font-medium text-sm text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Sign out of your account"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
      )}

      {/* Sidebar Overlay for Mobile */}
      {isAuthenticated && sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <main className="pt-16 lg:pl-64" id="main-content" role="main">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;