import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const { currentUser, logout, isTeacher } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Home', href: '/', current: true },
    { name: 'Courses', href: '/courses', current: false },
    ...(currentUser ? [
      { name: 'Dashboard', href: '/dashboard', current: false },
      { name: 'Assignments', href: '/assignments', current: false },
      { name: 'Grades', href: '/grades', current: false },
      { name: 'Forum', href: '/forum', current: false },
    ] : []),
  ];

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between border-b border-gray-200">
          <div className="flex items-center
          ">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">EduLMS</span>
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-base font-medium text-gray-700 hover:text-primary-600"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {currentUser ? (
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <div className="flex items-center space-x-2">
                      <UserCircleIcon className="h-8 w-8 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {currentUser.name}
                      </span>
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/dashboard"
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Dashboard
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block w-full text-left px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex lg:hidden
          ">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu, show/hide based on menu state. */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4">
            {currentUser ? (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {currentUser.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {currentUser.role === 'teacher' ? 'Teacher' : 'Student'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Sign out</span>
                  <span className="text-sm font-medium text-gray-700 hover:text-primary-600">
                    Sign out
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-1 px-2">
                <Link
                  to="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block rounded-md px-3 py-2 text-base font-medium text-primary-600 hover:bg-gray-50 hover:text-primary-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
