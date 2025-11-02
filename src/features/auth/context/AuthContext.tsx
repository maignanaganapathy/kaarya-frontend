import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import type { AuthContextType, User } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token refresh interval: 15 minutes (in milliseconds)
const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Setup token refresh interval when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      startTokenRefreshInterval();
    } else {
      stopTokenRefreshInterval();
    }

    // Cleanup on unmount
    return () => {
      stopTokenRefreshInterval();
    };
  }, [isAuthenticated]);

  const startTokenRefreshInterval = () => {
    // Clear any existing interval
    stopTokenRefreshInterval();

    // Set up new interval to refresh token every 15 minutes
    refreshIntervalRef.current = setInterval(async () => {
      try {
        console.log('⏰ Proactive token refresh triggered');
        await authService.refreshToken();
        console.log('✅ Token refreshed successfully');
      } catch (error) {
        console.error('❌ Failed to refresh token:', error);
        logout();
      }
    }, TOKEN_REFRESH_INTERVAL);

    console.log('🔄 Token refresh interval started (every 15 minutes)');
  };

  const stopTokenRefreshInterval = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
      console.log('⏸️ Token refresh interval stopped');
    }
  };

  const checkAuth = async () => {
    try {
      setLoading(true);

      if (authService.isAuthenticated()) {
        // Try to get user from localStorage first
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }

        // Verify with backend
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          // Token is invalid, clear everything
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (code: string) => {
    try {
      setLoading(true);
      const response = await authService.loginWithGoogle(code);
      setUser(response.data.user);
      setIsAuthenticated(true);
      toast.success(`Welcome, ${response.data.user.name}!`);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    stopTokenRefreshInterval();
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
