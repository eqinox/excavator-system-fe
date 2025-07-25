import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import {
  apiClient,
  type LoginDto,
  type LoginResponseDto,
  type RegisterDto,
  type RegisterResponseDto,
  type UserResponseDto,
} from "./api";

// Storage keys
const ACCESS_TOKEN_KEY = "access_token";
const USER_DATA_KEY = "user_data";

// Platform-specific storage functions
const getStorageItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return SecureStore.getItemAsync(key);
  }
};

const setStorageItem = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const removeStorageItem = async (key: string): Promise<void> => {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

// Authentication service class
class AuthService {
  private accessToken: string | null = null;
  private user: UserResponseDto | null = null;

  // Initialize auth state from secure storage
  async initialize(): Promise<void> {
    try {
      const [token, userData] = await Promise.all([
        getStorageItem(ACCESS_TOKEN_KEY),
        getStorageItem(USER_DATA_KEY),
      ]);

      this.accessToken = token;
      this.user = userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Failed to initialize auth:", error);
    }
  }

  // Get current access token
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Get current user
  getUser(): UserResponseDto | null {
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
        "/auth/signup",
        credentials
      );

      // After successful registration, we might want to auto-login
      // or just return the registration response
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  // Login user
  async login(credentials: LoginDto): Promise<LoginResponseDto> {
    try {
      const response = await apiClient.post<LoginResponseDto>(
        "/auth/signin",
        credentials
      );

      // Store authentication data
      await this.storeAuthData(response.access_token, response.user);

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if your server has one
      if (this.accessToken) {
        try {
          await apiClient.authenticatedRequest(
            "/auth/logout",
            { method: "POST" },
            this.accessToken
          );
        } catch (error) {
          console.error("Logout API error:", error);
          // Continue with local logout even if API call fails
        }
      }

      // Clear local authentication data
      await this.clearAuthData();
    } catch (error) {
      console.error("Logout error:", error);
      // Ensure auth data is cleared even if there's an error
      await this.clearAuthData();
    }
  }

  // Refresh access token
  async refreshToken(): Promise<string | null> {
    try {
      const response = await apiClient.post<LoginResponseDto>(
        "/auth/refresh",
        {}
      );
      this.accessToken = response.access_token;
      await setStorageItem(ACCESS_TOKEN_KEY, this.accessToken);

      return this.accessToken;
    } catch (error) {
      console.error("Token refresh error:", error);
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
      throw new Error("No access token available");
    }

    try {
      return await apiClient.authenticatedRequest<T>(
        endpoint,
        options,
        this.accessToken
      );
    } catch (error: any) {
      // Handle 401 Unauthorized
      if (error.message?.includes("401")) {
        const newToken = await this.refreshToken();
        if (newToken) {
          // Retry the request with new token
          return await apiClient.authenticatedRequest<T>(
            endpoint,
            options,
            newToken
          );
        } else {
          // Refresh failed, logout user
          await this.logout();
          throw new Error("Authentication expired");
        }
      }
      throw error;
    }
  }

  // Get user profile (example authenticated request)
  async getUserProfile(): Promise<UserResponseDto> {
    return this.authenticatedRequest<UserResponseDto>("/auth/profile");
  }

  // Update user profile (example authenticated request)
  async updateUserProfile(
    data: Partial<UserResponseDto>
  ): Promise<UserResponseDto> {
    return this.authenticatedRequest<UserResponseDto>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Store authentication data securely
  private async storeAuthData(
    token: string,
    user: UserResponseDto
  ): Promise<void> {
    this.accessToken = token;
    this.user = user;

    await Promise.all([
      setStorageItem(ACCESS_TOKEN_KEY, token),
      setStorageItem(USER_DATA_KEY, JSON.stringify(user)),
    ]);

    console.log("Auth data stored securely");
  }

  // Clear authentication data
  private async clearAuthData(): Promise<void> {
    this.accessToken = null;
    this.user = null;

    await Promise.all([
      removeStorageItem(ACCESS_TOKEN_KEY),
      removeStorageItem(USER_DATA_KEY),
    ]);

    console.log("Auth data cleared securely");
  }
}

// Create singleton instance
export const authService = new AuthService();

// Export types for use in components
export type {
  LoginDto,
  LoginResponseDto,
  RegisterDto,
  RegisterResponseDto,
  UserResponseDto,
};
