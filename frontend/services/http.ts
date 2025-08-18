import { getApiConfig } from '../config/api';

export class HttpClient {
  private baseURL: string;
  private token: string | null = null;
  private offlineMode: boolean = false;

  constructor(baseURL?: string) {
    const config = getApiConfig();
    this.baseURL = baseURL || config.baseURL;

    if (typeof window !== 'undefined') {
      try {
        this.token = localStorage.getItem('access_token');
        this.offlineMode = localStorage.getItem('offline_mode') === 'true';
      } catch {
        this.token = null;
        this.offlineMode = false;
      }
    }
  }

  setBaseURL(url: string) {
    this.baseURL = url;
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  setOfflineMode(offline: boolean) {
    this.offlineMode = offline;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('offline_mode', offline.toString());
      } catch {}
    }
  }

  isOffline(): boolean {
    return this.offlineMode;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('access_token', token);
      } catch {}
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('access_token');
      } catch {}
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (this.offlineMode && !endpoint.includes('/health')) {
      throw new Error('API_OFFLINE');
    }

    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        this.token = null;
        if (typeof window !== 'undefined') {
          try { localStorage.removeItem('access_token'); } catch {}
        }
        throw new Error('UNAUTHORIZED');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    return response.json();
  }
}

export const initializeHttpClient = async (client: HttpClient) => {
  try {
    const response = await fetch(client.getBaseURL() + '/health', {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) throw new Error('API not available');
    client.setOfflineMode(false);
    // eslint-disable-next-line no-console
    console.log('🟢 API is available at:', client.getBaseURL());
  } catch {
    // eslint-disable-next-line no-console
    console.log('🔴 API not available, enabling offline mode');
    // eslint-disable-next-line no-console
    console.log('📱 You can use the app in demo mode or configure the API URL');
    client.setOfflineMode(true);
  }
};


