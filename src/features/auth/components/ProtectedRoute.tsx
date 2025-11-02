import { Navigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  // Show skeleton loader while checking authentication
  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={60}
          style={{ marginBottom: '20px' }}
        />
        <Skeleton
          variant="text"
          width="60%"
          height={40}
          style={{ marginBottom: '10px' }}
        />
        <Skeleton
          variant="text"
          width="80%"
          height={40}
          style={{ marginBottom: '10px' }}
        />
        <Skeleton
          variant="circular"
          width={100}
          height={100}
          style={{ margin: '20px auto' }}
        />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
