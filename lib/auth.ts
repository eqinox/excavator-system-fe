import { apiClient } from './api';
import { LoginDto, RegisterDto, UserDto } from './dto/client/auth.dto';
import {
  LoginResponseDto,
  RegisterResponseDto,
  UserResponseDto,
} from './dto/server/auth.dto';
import { getStorageItem, removeStorageItem, setStorageItem } from './storage';

// Storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const USER_DATA_KEY = 'user_data';
const TOKEN_EXPIRY_KEY = 'token_expiry';

// JWT token utilities
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Authentication service class
class AuthService {
  private accessToken: string | null = null;
  private user: UserDto | null = null;

  // Initialize auth state from secure storage
  async initialize(): Promise<void> {
    try {
      const [token, userData, expiry] = await Promise.all([
        getStorageItem(ACCESS_TOKEN_KEY),
        getStorageItem(USER_DATA_KEY),
        getStorageItem(TOKEN_EXPIRY_KEY),
      ]);

      this.accessToken = token;
      this.user = userData ? JSON.parse(userData) : null;
      this.tokenExpiry = expiry ? parseInt(expiry) : null;

      // Check if token is expired
      if (this.isTokenExpired()) {
        console.log('Token is expired, clearing auth data');
        await this.clearAuthData();
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    }
  }

  // Get current access token
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Get current user
  getUser(): UserDto | null {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Register new user
  async register(credentials: RegisterDto): Promise<RegisterResponseDto> {
    try {
      const response = await apiClient.post<RegisterResponseDto>(
        '/auth/signup',
        credentials
      );

      // After successful registration, we might want to auto-login
      // or just return the registration response
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(credentials: LoginDto): Promise<LoginResponseDto> {
    try {
      const response = await apiClient.post<LoginResponseDto>(
        '/auth/signin',
        credentials
      );

      // Store authentication data
      await this.storeAuthData(response.data.access_token, response.data.user);

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if your server has one
      if (this.accessToken) {
        try {
          await apiClient.authenticatedRequest('/auth/logout', {
            method: 'POST',
          });
        } catch (error) {
          console.error('Logout API error:', error);
          // Continue with local logout even if API call fails
        }
      }

      // Clear local authentication data
      await this.clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      // Ensure auth data is cleared even if there's an error
      await this.clearAuthData();
    }
  }

  // Refresh access token
  async refreshToken(): Promise<string | null> {
    try {
      const response = await apiClient.post<LoginResponseDto>(
        '/auth/refresh',
        {}
      );
      this.accessToken = response.data.access_token;
      await setStorageItem(ACCESS_TOKEN_KEY, this.accessToken);

      return this.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      await this.clearAuthData();
      return null;
    }
  }

  // Make authenticated API requests
  async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    try {
      return await apiClient.authenticatedRequest<T>(endpoint, options);
    } catch (error: any) {
      // Handle 401 Unauthorized
      if (error.message?.includes('401')) {
        const newToken = await this.refreshToken();
        if (newToken) {
          // Retry the request with new token
          return await apiClient.authenticatedRequest<T>(endpoint, options);
        } else {
          // Refresh failed, logout user
          await this.logout();
          throw new Error('Authentication expired');
        }
      }
      throw error;
    }
  }

  // Get user profile (example authenticated request)
  async getUserProfile(): Promise<UserResponseDto> {
    return this.authenticatedRequest<UserResponseDto>('/auth/profile');
  }

  // Update user profile (example authenticated request)
  async updateUserProfile(
    data: Partial<UserResponseDto>
  ): Promise<UserResponseDto> {
    return this.authenticatedRequest<UserResponseDto>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Store authentication data securely
  private async storeAuthData(token: string, user: UserDto): Promise<void> {
    try {
      // Decode JWT to get expiry
      const decoded = decodeJWT(token);
      const expiry = decoded?.exp ? decoded.exp * 1000 : null; // Convert to milliseconds

      this.accessToken = token;
      this.user = user;
      this.tokenExpiry = expiry; // Запазваме кога изтича токенът

      await Promise.all([
        setStorageItem(ACCESS_TOKEN_KEY, token),
        setStorageItem(USER_DATA_KEY, JSON.stringify(user)),
        expiry
          ? setStorageItem(TOKEN_EXPIRY_KEY, expiry.toString())
          : Promise.resolve(),
      ]);
    } catch (error) {
      console.error('Failed to store auth data:', error);
      throw error;
    }
  }

  // Clear authentication data
  private async clearAuthData(): Promise<void> {
    this.accessToken = null;
    this.user = null;

    await Promise.all([
      removeStorageItem(ACCESS_TOKEN_KEY),
      removeStorageItem(USER_DATA_KEY),
      removeStorageItem(TOKEN_EXPIRY_KEY),
    ]);

    console.log('Auth data cleared securely');
  }

  private tokenExpiry: number | null = null;

  // Check if token is expired
  isTokenExpired(): boolean {
    if (!this.accessToken || !this.tokenExpiry) {
      return true;
    }

    // Add 5 minute buffer before expiry
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return Date.now() >= this.tokenExpiry - bufferTime;
  }

  // Validate token with server
  async validateToken(): Promise<boolean> {
    if (!this.accessToken) {
      return false;
    }

    try {
      // Call a protected endpoint to validate token
      await apiClient.authenticatedRequest('/auth/validate', { method: 'GET' });
      return true;
    } catch (error: any) {
      console.log('Token validation failed:', error.message);
      return false;
    }
  }

  // Check if user has admin role
  isAdmin(): boolean {
    return this.user?.role === 'admin';
  }
}

// Create singleton instance
export const authService = new AuthService();
