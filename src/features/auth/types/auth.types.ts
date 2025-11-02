export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
}
export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  data: {
    tokens: Token;
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
