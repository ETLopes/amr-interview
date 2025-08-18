// Environment configuration for the frontend
export const environment = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    timeout: 10000,
    retryAttempts: 3,
  },
  
  // App Configuration
  app: {
    name: 'aMORA Real Estate Simulator',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  
  // Feature Flags
  features: {
    betaFeatures: true,
    realTimeUpdates: true,
    offlineSupport: false,
  },
};

// Helper function to get API URL
export const getApiUrl = (path: string = ''): string => {
  const baseUrl = environment.api.baseUrl;
  return `${baseUrl}${path}`;
};

// Helper function to check if we're in development
export const isDevelopment = (): boolean => {
  return environment.app.environment === 'development';
};

// Helper function to check if we're in production
export const isProduction = (): boolean => {
  return environment.app.environment === 'production';
};

// Debug function to log current configuration
export const logEnvironment = (): void => {
  if (isDevelopment()) {
    console.log('🔧 Environment Configuration:', environment);
    console.log('🌐 API Base URL:', environment.api.baseUrl);
  }
};
