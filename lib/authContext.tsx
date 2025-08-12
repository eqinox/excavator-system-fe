import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  authService,
  type LoginDto,
  type RegisterDto,
  type RegisterResponseDto,
  type UserResponseDto,
} from './auth';

interface AuthContextType {
  user: UserResponseDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (credentials: LoginDto) => Promise<void>;
  register: (credentials: RegisterDto) => Promise<RegisterResponseDto>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      await authService.initialize();
      const user = authService.getUser();
      const token = authService.getAccessToken();
      setUser(user);
      setAccessToken(token);
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginDto) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setAccessToken(authService.getAccessToken());
    } catch (error) {
      throw error;
    }
  };

  const register = async (credentials: RegisterDto) => {
    try {
      const response = await authService.register(credentials);
      // After successful registration, you might want to auto-login
      // or just return the registration response
      // For now, we'll just return the response without auto-login
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    accessToken,
    login,
    register,
    logout,
  };

  // Add effect to sync token state with authService
  useEffect(() => {
    const syncToken = () => {
      const currentToken = authService.getAccessToken();
      if (currentToken !== accessToken) {
        setAccessToken(currentToken);
      }
    };

    // Sync immediately
    syncToken();

    // Set up interval to check for token changes
    const interval = setInterval(syncToken, 1000);

    return () => clearInterval(interval);
  }, [accessToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
