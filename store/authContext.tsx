import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../lib/auth';
import { LoginDto, RegisterDto, UserDto } from '../lib/dto/client/auth.dto';
import { RegisterResponseDto } from '../lib/dto/server/auth.dto';

interface AuthContextType {
  user: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  isAdmin: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (credentials: RegisterDto) => Promise<RegisterResponseDto>;
  logout: () => Promise<void>;
  validateToken: () => Promise<boolean>;
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
  const [user, setUser] = useState<UserDto | null>(null);
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

  const login = async (credentials: LoginDto): Promise<void> => {
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
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
    isAdmin: authService.isAdmin(),
    login,
    register,
    logout,
    validateToken: authService.validateToken,
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

  // Add effect to check token validity periodically
  useEffect(() => {
    const checkTokenValidity = async () => {
      if (user && accessToken) {
        // Check every 5 minutes
        const isValid = await authService.validateToken();
        if (!isValid) {
          await logout();
        }
      }
    };

    const interval = setInterval(checkTokenValidity, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [user, accessToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
