export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthResponse {
  data: {
    token: string;
    user: User;
  };
  success: boolean;
}

export interface LoginRequest {
  code: string;
  redirectUri: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (code: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
