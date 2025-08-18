// API Configuration
// This file can be used to configure API settings

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  retryAttempts?: number;
}

// Default configuration
export const defaultApiConfig: ApiConfig = {
  baseURL: 'http://localhost:8000',
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
};

// Environment-based configuration
export const getApiConfig = (): ApiConfig => {
  // Check global window object (useful for dynamic configuration)
  if (typeof window !== 'undefined' && (window as any).__API_CONFIG__) {
    return { ...defaultApiConfig, ...(window as any).__API_CONFIG__ };
  }

  let baseURL = defaultApiConfig.baseURL;
  
  // Safe environment variable access
  try {
    // Check for Next.js public environment variables (client-side)
    if (typeof window !== 'undefined') {
      // Client-side: only NEXT_PUBLIC_ variables are available
      if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
        baseURL = process.env.NEXT_PUBLIC_API_URL;
      }
    }
    // Server-side: all environment variables are available
    else if (typeof process !== 'undefined' && process.env) {
      baseURL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || defaultApiConfig.baseURL;
    }
  } catch (error) {
    // Fallback to default if environment variables are not accessible
    console.warn('Could not access environment variables, using default API config:', error);
  }

  return {
    ...defaultApiConfig,
    baseURL,
  };
};

// Function to set global API configuration
// Usage: setGlobalApiConfig({ baseURL: 'https://your-api.example.com' })
// This should be called before any API requests are made
export const setGlobalApiConfig = (config: Partial<ApiConfig>) => {
  if (typeof window !== 'undefined') {
    (window as any).__API_CONFIG__ = { ...getApiConfig(), ...config };
  }
};

// Helper to get the current API URL being used
export const getCurrentApiUrl = (): string => {
  return getApiConfig().baseURL;
};


