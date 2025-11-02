import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { AuthProvider } from './features/auth/context/AuthContext';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.scss';

// Lazy load pages
const Login = lazy(() => import('./features/auth/components/Login'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Home = lazy(() => import('./pages/Home'));

// Loading fallback component
const LoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
    }}
  >
    <CircularProgress sx={{ color: '#FFD700' }} size={60} />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/google/callback" element={<AuthCallback />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home (which will redirect to login if not authenticated) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
