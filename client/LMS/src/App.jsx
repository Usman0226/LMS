import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';
import AppRoutes from './routes';
import Layout from './components/layout/Layout';

// ✅ Create a Query Client (no extra brace)
const queryClient = new QueryClient();

function App() {
  const location = useLocation();
  const routesWithoutLayout = ['/login', '/register'];
  const shouldWrapWithLayout = !routesWithoutLayout.includes(location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {shouldWrapWithLayout ? (
            <Layout>
              <AppRoutes />
            </Layout>
          ) : (
            <AppRoutes />
          )}
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
