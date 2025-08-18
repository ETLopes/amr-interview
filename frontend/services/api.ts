import { getApiConfig } from '../config/api';

// API Configuration and Service
const apiConfig = getApiConfig();

// Types matching the API schemas
export interface ApiUser {
  id: number;
  email: string;
  name?: string;
  created_at: string;
  updated_at?: string;
}

export interface ApiUserCreate {
  email: string;
  name?: string;
  password: string;
}

export interface ApiUserUpdate {
  name?: string;
}

export interface ApiSimulation {
  id: number;
  user_id: number;
  property_value: number;
  down_payment_percentage: number;
  contract_years: number;
  property_address?: string;
  property_type?: string;
  notes?: string;
  down_payment_amount: number;
  financing_amount: number;
  total_to_save: number;
  monthly_savings: number;
  created_at: string;
  updated_at?: string;
}

export interface ApiSimulationCreate {
  property_value: number;
  down_payment_percentage: number;
  contract_years: number;
  property_address?: string;
  property_type?: string;
  notes?: string;
}

export interface ApiSimulationUpdate {
  property_value?: number;
  down_payment_percentage?: number;
  contract_years?: number;
  property_address?: string;
  property_type?: string;
  notes?: string;
}

export interface ApiSimulationsListResponse {
  simulations: ApiSimulation[];
  total: number;
}

export interface ApiToken {
  access_token: string;
  token_type: string;
}

// Frontend types (existing)
export interface User {
  id: number;
  email: string;
  nome?: string;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface Simulation {
  id: number;
  nome: string;
  valorImovel: number;
  percentualEntrada: number;
  anosContrato: number;
  endereco?: string;
  tipoImovel?: string;
  observacoes?: string;
  valorEntrada: number;
  valorFinanciar: number;
  totalGuardar: number;
  valorMensalPoupanca: number;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface SimulationCreate {
  nome: string;
  valorImovel: number;
  percentualEntrada: number;
  anosContrato: number;
  endereco?: string;
  tipoImovel?: string;
  observacoes?: string;
}

// Data mappers
export const mapApiUserToUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  email: apiUser.email,
  nome: apiUser.name,
  dataCriacao: apiUser.created_at,
  dataAtualizacao: apiUser.updated_at,
});

export const mapUserCreateToApi = (userData: { email: string; nome?: string; senha: string }): ApiUserCreate => ({
  email: userData.email,
  name: userData.nome,
  password: userData.senha,
});

export const mapApiSimulationToSimulation = (apiSim: ApiSimulation): Simulation => ({
  id: apiSim.id,
  nome: apiSim.property_address || `Simulaç��o ${apiSim.id}`,
  valorImovel: apiSim.property_value,
  percentualEntrada: apiSim.down_payment_percentage,
  anosContrato: apiSim.contract_years,
  endereco: apiSim.property_address,
  tipoImovel: apiSim.property_type,
  observacoes: apiSim.notes,
  valorEntrada: apiSim.down_payment_amount,
  valorFinanciar: apiSim.financing_amount,
  totalGuardar: apiSim.total_to_save,
  valorMensalPoupanca: apiSim.monthly_savings,
  dataCriacao: apiSim.created_at,
  dataAtualizacao: apiSim.updated_at,
});

export const mapSimulationCreateToApi = (simData: SimulationCreate): ApiSimulationCreate => ({
  property_value: simData.valorImovel,
  down_payment_percentage: simData.percentualEntrada,
  contract_years: simData.anosContrato,
  property_address: simData.endereco,
  property_type: simData.tipoImovel,
  notes: simData.observacoes,
});

// API Service Class
class ApiService {
  private baseURL: string;
  private token: string | null = null;
  private offlineMode: boolean = false;
  private mockUserId: number = 1;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('access_token');
    // Check if offline mode is enabled
    this.offlineMode = localStorage.getItem('offline_mode') === 'true';
  }

  // Method to update API base URL if needed
  setBaseURL(url: string) {
    this.baseURL = url;
  }

  // Method to get current base URL
  getBaseURL(): string {
    return this.baseURL;
  }

  // Enable/disable offline mode
  setOfflineMode(offline: boolean) {
    this.offlineMode = offline;
    localStorage.setItem('offline_mode', offline.toString());
  }

  // Check if in offline mode
  isOffline(): boolean {
    return this.offlineMode;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // If in offline mode, don't make real requests
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

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.token = null;
          localStorage.removeItem('access_token');
          throw new Error('UNAUTHORIZED');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle empty responses
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      
      // If network error, suggest offline mode
      if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('NetworkError'))) {
        throw new Error('NETWORK_ERROR');
      }
      
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Test API connectivity
  async testConnection(): Promise<{ connected: boolean; baseURL: string; error?: string; offlineMode: boolean }> {
    if (this.offlineMode) {
      return { 
        connected: false, 
        baseURL: this.baseURL, 
        offlineMode: true,
        error: 'Offline mode enabled' 
      };
    }

    try {
      await this.healthCheck();
      return { connected: true, baseURL: this.baseURL, offlineMode: false };
    } catch (error) {
      return { 
        connected: false, 
        baseURL: this.baseURL, 
        offlineMode: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Authentication
  async register(userData: { email: string; nome?: string; senha: string }): Promise<User> {
    // Offline mode - return mock user
    if (this.offlineMode) {
      const mockUser: User = {
        id: this.mockUserId,
        email: userData.email,
        nome: userData.nome,
        dataCriacao: new Date().toISOString(),
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockUser;
    }

    const apiUserData = mapUserCreateToApi(userData);
    const apiUser = await this.request<ApiUser>('/register', {
      method: 'POST',
      body: JSON.stringify(apiUserData),
    });
    return mapApiUserToUser(apiUser);
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Offline mode - return mock user
    if (this.offlineMode) {
      const mockUser: User = {
        id: this.mockUserId,
        email: email,
        nome: email.split('@')[0],
        dataCriacao: new Date().toISOString(),
      };
      
      const mockToken = 'mock_token_' + Date.now();
      this.setToken(mockToken);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { user: mockUser, token: mockToken };
    }

    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const tokenResponse = await this.request<ApiToken>('/token', {
        method: 'POST',
        headers: {
          // Remove Content-Type to let browser set it for FormData
        },
        body: formData,
      });

      this.setToken(tokenResponse.access_token);

      // Get user info
      const apiUser = await this.request<ApiUser>('/users/me');
      const user = mapApiUserToUser(apiUser);

      return { user, token: tokenResponse.access_token };
    } catch (error) {
      // If authentication fails, suggest offline mode
      if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'NETWORK_ERROR')) {
        throw new Error('AUTH_FAILED');
      }
      throw error;
    }
  }

  // User operations
  async getCurrentUser(): Promise<User> {
    // Offline mode - return stored user from token
    if (this.offlineMode) {
      const mockUser: User = {
        id: this.mockUserId,
        email: 'demo@amora.com',
        nome: 'Usuário Demo',
        dataCriacao: new Date().toISOString(),
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return mockUser;
    }

    const apiUser = await this.request<ApiUser>('/users/me');
    return mapApiUserToUser(apiUser);
  }

  async updateUser(userData: { nome?: string }): Promise<User> {
    const apiUserData: ApiUserUpdate = { name: userData.nome };
    const apiUser = await this.request<ApiUser>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(apiUserData),
    });
    return mapApiUserToUser(apiUser);
  }

  // Simulation operations
  async createSimulation(simulationData: SimulationCreate): Promise<Simulation> {
    // Offline mode - create mock simulation
    if (this.offlineMode) {
      const mockId = Date.now();
      const mockSimulation: Simulation = {
        id: mockId,
        nome: simulationData.nome,
        valorImovel: simulationData.valorImovel,
        percentualEntrada: simulationData.percentualEntrada,
        anosContrato: simulationData.anosContrato,
        endereco: simulationData.endereco,
        tipoImovel: simulationData.tipoImovel,
        observacoes: simulationData.observacoes,
        valorEntrada: (simulationData.valorImovel * simulationData.percentualEntrada) / 100,
        valorFinanciar: simulationData.valorImovel - (simulationData.valorImovel * simulationData.percentualEntrada) / 100,
        totalGuardar: simulationData.valorImovel * 0.15,
        valorMensalPoupanca: (simulationData.valorImovel * 0.15) / (simulationData.anosContrato * 12),
        dataCriacao: new Date().toISOString(),
      };
      
      // Save to localStorage for persistence in offline mode
      const existingSimulations = JSON.parse(localStorage.getItem('offline_simulations') || '[]');
      existingSimulations.push(mockSimulation);
      localStorage.setItem('offline_simulations', JSON.stringify(existingSimulations));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockSimulation;
    }

    const apiSimData = mapSimulationCreateToApi(simulationData);
    const apiSim = await this.request<ApiSimulation>('/simulations', {
      method: 'POST',
      body: JSON.stringify(apiSimData),
    });
    return mapApiSimulationToSimulation(apiSim);
  }

  async getSimulations(skip = 0, limit = 100): Promise<{ simulations: Simulation[]; total: number }> {
    // Offline mode - return simulations from localStorage
    if (this.offlineMode) {
      const simulations = JSON.parse(localStorage.getItem('offline_simulations') || '[]');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        simulations: simulations.slice(skip, skip + limit),
        total: simulations.length,
      };
    }

    const response = await this.request<ApiSimulationsListResponse>(
      `/simulations?skip=${skip}&limit=${limit}`
    );
    return {
      simulations: response.simulations.map(mapApiSimulationToSimulation),
      total: response.total,
    };
  }

  async getSimulation(id: number): Promise<Simulation> {
    const apiSim = await this.request<ApiSimulation>(`/simulations/${id}`);
    return mapApiSimulationToSimulation(apiSim);
  }

  async updateSimulation(id: number, simulationData: Partial<SimulationCreate>): Promise<Simulation> {
    const apiSimData: ApiSimulationUpdate = {};
    
    if (simulationData.valorImovel !== undefined) {
      apiSimData.property_value = simulationData.valorImovel;
    }
    if (simulationData.percentualEntrada !== undefined) {
      apiSimData.down_payment_percentage = simulationData.percentualEntrada;
    }
    if (simulationData.anosContrato !== undefined) {
      apiSimData.contract_years = simulationData.anosContrato;
    }
    if (simulationData.endereco !== undefined) {
      apiSimData.property_address = simulationData.endereco;
    }
    if (simulationData.tipoImovel !== undefined) {
      apiSimData.property_type = simulationData.tipoImovel;
    }
    if (simulationData.observacoes !== undefined) {
      apiSimData.notes = simulationData.observacoes;
    }

    const apiSim = await this.request<ApiSimulation>(`/simulations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(apiSimData),
    });
    return mapApiSimulationToSimulation(apiSim);
  }

  async deleteSimulation(id: number): Promise<void> {
    // Offline mode - remove from localStorage
    if (this.offlineMode) {
      const simulations = JSON.parse(localStorage.getItem('offline_simulations') || '[]');
      const filteredSimulations = simulations.filter((sim: Simulation) => sim.id !== id);
      localStorage.setItem('offline_simulations', JSON.stringify(filteredSimulations));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      return;
    }

    await this.request(`/simulations/${id}`, {
      method: 'DELETE',
    });
  }

  async getSimulationStatistics() {
    return this.request('/simulations/statistics');
  }

  async calculateSimulation(simulationData: SimulationCreate) {
    const apiSimData = mapSimulationCreateToApi(simulationData);
    return this.request('/calculate', {
      method: 'POST',
      body: JSON.stringify(apiSimData),
    });
  }
}

// Initialize API service with safe configuration
let apiServiceInstance: ApiService | null = null;

// Export singleton instance with lazy initialization
export const getApiService = (): ApiService => {
  if (!apiServiceInstance) {
    const config = getApiConfig();
    apiServiceInstance = new ApiService(config.baseURL);
    
    // Initialize offline mode check on first access (client-side only)
    if (typeof window !== 'undefined') {
      initializeApiService(apiServiceInstance);
    }
  }
  return apiServiceInstance;
};

// Initialize offline mode on first run if API is not available
const initializeApiService = async (service: ApiService) => {
  try {
    // Try to ping the API
    const response = await fetch(service.getBaseURL() + '/health', { 
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    
    if (!response.ok) {
      throw new Error('API not available');
    }
    
    // API is available, ensure offline mode is disabled
    service.setOfflineMode(false);
    console.log('🟢 API is available at:', service.getBaseURL());
    
  } catch (error) {
    // API is not available, enable offline mode
    console.log('🔴 API not available, enabling offline mode');
    console.log('📱 You can use the app in demo mode or configure the API URL');
    service.setOfflineMode(true);
  }
};

// Export the service instance (backwards compatibility)
export const apiService = getApiService();

// Export error types for better error handling
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}