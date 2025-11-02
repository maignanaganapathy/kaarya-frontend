import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../features/auth/context/AuthContext';
import styles from './AuthCallback.module.scss';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
        return;
      }

      if (!code) {
        toast.error('No authorization code found.');
        navigate('/login');
        return;
      }

      try {
        await login(code);
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [login, navigate]);

  return (
    <div className={styles.callbackContainer}>
      <CircularProgress
        size={60}
        sx={{
          color: '#FFD700',
        }}
      />
      <p className={styles.message}>Authenticating...</p>
    </div>
  );
};

export default AuthCallback;
