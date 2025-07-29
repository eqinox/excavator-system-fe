import { BASE_URL } from "@/constants";

// Types for your DTOs
export interface RegisterDto {
  email: string;
  username?: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  role: string;
}

export interface RegisterResponseDto {
  id: string;
  email: string;
  username?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponseDto {
  access_token: string;
  user: UserResponseDto;
}

export interface CategoryResponse {
  name: string;
  equipment: string[];
  created_by: string;
  image: string;
}

// HTTP client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body,
    };

    console.log("🌐 API Request Details:", {
      url,
      method: config.method || "GET",
      headers: config.headers,
      body: config.body ? JSON.parse(config.body as string) : undefined,
      bodyString: config.body,
    });

    try {
      const response = await fetch(url, config);

      console.log("📡 API Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ API Error Details:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
          fullError: errorData,
        });
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("✅ API Success:", data);
      return data;
    } catch (error) {
      console.error(`❌ API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", headers });
  }

  // POST request
  async post<T>(
    endpoint: string,
    data: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", headers });
  }

  // Authenticated request with Bearer token
  async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    token: string
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Authenticated API request failed: ${endpoint}`, error);
      throw error;
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Test function to verify connection
export const testConnection = async () => {
  console.log("🔍 Testing connection to:", BASE_URL);
  try {
    const response = await fetch(`${BASE_URL}/health`);
    console.log("✅ Connection successful:", response.status);
    return true;
  } catch (error) {
    console.error("❌ Connection failed:", error);
    return false;
  }
};
