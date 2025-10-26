import React from 'react';
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Here you could also log the error to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, showDetails = false } = this.props;

      // If a custom fallback component is provided, use it
      if (Fallback) {
        return <Fallback error={this.state.error} retry={this.handleRetry} />;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="mx-auto h-24 w-24 text-red-400 mb-4">
              <ExclamationTriangleIcon className="h-full w-full" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {this.props.title || 'Something went wrong'}
            </h1>

            <p className="text-gray-600 mb-6">
              {this.props.message || 'An unexpected error occurred. Please try again.'}
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Go to Dashboard
              </button>
            </div>

            {showDetails && process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development Only)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specific error boundaries for different sections
export const DashboardErrorBoundary = ({ children }) => (
  <ErrorBoundary
    title="Dashboard Error"
    message="There was a problem loading your dashboard. Please try refreshing the page."
  >
    {children}
  </ErrorBoundary>
);

export const CoursesErrorBoundary = ({ children }) => (
  <ErrorBoundary
    title="Courses Error"
    message="There was a problem loading the courses. Please try again."
  >
    {children}
  </ErrorBoundary>
);

export const AssignmentsErrorBoundary = ({ children }) => (
  <ErrorBoundary
    title="Assignments Error"
    message="There was a problem loading the assignments. Please try again."
  >
    {children}
  </ErrorBoundary>
);

export const ProfileErrorBoundary = ({ children }) => (
  <ErrorBoundary
    title="Profile Error"
    message="There was a problem loading your profile. Please try again."
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;
