// Development: use proxy (/api), Production: use full URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? '/api' : 'https://menu-backend-peqv.onrender.com');

export interface ApiError extends Error {
  status?: number;
  data?: any;
}

export const createApiError = (message: string, status?: number, data?: any): ApiError => {
  const error = new Error(message) as ApiError;
  error.name = 'ApiError';
  error.status = status;
  error.data = data;
  return error;
};

export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    try {
      // Handle relative URLs for development proxy
      const baseUrl = API_BASE_URL.startsWith('/') ? window.location.origin + API_BASE_URL : API_BASE_URL;
      const fullUrl = `${baseUrl}${endpoint}`;
      console.log('API Request:', fullUrl);
      const url = new URL(fullUrl);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw createApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
        throw error;
      }
      throw createApiError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  },

  async post<T>(endpoint: string, body?: any): Promise<T> {
    try {
      // Handle relative URLs for development proxy
      const baseUrl = API_BASE_URL.startsWith('/') ? window.location.origin + API_BASE_URL : API_BASE_URL;
      const fullUrl = `${baseUrl}${endpoint}`;
      console.log('API Request:', fullUrl);
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw createApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
        throw error;
      }
      throw createApiError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  },
};
