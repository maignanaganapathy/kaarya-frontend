import { Avatar, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../features/auth/context/AuthContext';
import styles from './Home.module.scss';

const Home = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.header}>
        <div className={styles.logo}>Kaarya</div>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Logout
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.welcomeSection}>
          <Avatar
            src={user?.picture}
            alt={user?.name}
            className={styles.avatar}
            sx={{ width: 120, height: 120 }}
          />

          <h1 className={styles.welcomeTitle}>
            Welcome, <span className={styles.userName}>{user?.name}</span>!
          </h1>

          <p className={styles.userEmail}>{user?.email}</p>

          <div className={styles.infoCard}>
            <p className={styles.infoText}>
              You're successfully logged in to Kaarya.
            </p>
            <p className={styles.infoSubtext}>
              Your work dashboard will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
