const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vcbebxqmysjonlljaoff.supabase.co/functions/v1';

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
      const url = new URL(`${API_BASE_URL}${endpoint}`);
      
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
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
