import api from '../../../shared/services/api';
import type { AuthResponse, LoginRequest, User } from '../types/auth.types';

const authService = {
  // Login with Google - exchange code for token
  loginWithGoogle: async (code: string): Promise<AuthResponse> => {
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const response = await api.post<AuthResponse>('/auth/google', {
      code,
      redirectUri,
    } as LoginRequest);

    // Store token and user in localStorage
    localStorage.setItem('auth_token', response.data.data.tokens.accessToken);
    localStorage.setItem(
      'refresh_token',
      response.data.data.tokens.refreshToken
    );
    localStorage.setItem('user', JSON.stringify(response.data.data.user));

    return response.data;
  },

  refreshToken: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', {
      refreshToken,
    });

    const newAccessToken = response.data.data.accessToken;

    localStorage.setItem('auth_token', newAccessToken);

    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
  },

  // Get current user info
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<{ data: User }>('/auth/me');
    return response.data.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout', {
        refreshToken: localStorage.getItem('refresh_token'),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },

  // Get stored user from localStorage
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },
};

export default authService;
