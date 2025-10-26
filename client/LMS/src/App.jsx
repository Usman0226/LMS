
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { CourseProvider } from './context/CourseContext';
import { CourseContentProvider } from './context/CourseContentContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ui';
import AppRoutes from './routes/index.jsx';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <CourseProvider>
              <CourseContentProvider>
                {/* Temporarily disabled providers to debug infinite reload */}
                {/* <WebSocketProvider> */}
                {/* <MessagingProvider> */}
                    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
                      {/* Skip Navigation Links */}
                      <a
                        href="#main-content"
                        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        Skip to main content
                      </a>

                      <AppRoutes />
                    </div>
                {/* </MessagingProvider> */}
                {/* </WebSocketProvider> */}
              </CourseContentProvider>
            </CourseProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
