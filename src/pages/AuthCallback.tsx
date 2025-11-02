import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../features/auth/context/AuthContext';
import styles from './AuthCallback.module.scss';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // Get the authorization code from URL
      const urlParams = new URLSearchParams(window.location.search);
      console.log('urlParams', urlParams);
      const code = urlParams.get('code');
      console.log('code', code);
      const error = urlParams.get('error');
      console.log('error', error);

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
        // Exchange code for token
        console.log(code);
        await login(code);
        // Redirect to home on success
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, []);

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
