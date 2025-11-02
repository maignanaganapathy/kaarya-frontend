import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import styles from './Login.module.scss';

const Login = () => {
  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const scope = `email%20profile`;

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    window.location.href = googleAuthUrl;
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logoSection}>
          <h1 className={styles.logo}>Kaarya</h1>
          <p className={styles.tagline}>Your work, simplified</p>
        </div>

        <div className={styles.loginSection}>
          <h2 className={styles.title}>Welcome</h2>
          <p className={styles.subtitle}>Sign in to continue</p>

          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            className={styles.googleButton}
            size="large"
            fullWidth
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
