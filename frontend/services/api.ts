import { getApiConfig } from '../config/api';
import { HttpClient, initializeHttpClient } from './http';
import {
  User,
  Simulation,
  SimulationCreate,
} from './types';
import {
  registerOnline,
  loginOnline,
  getCurrentUserOnline,
  updateUserOnline,
  registerOffline,
  loginOffline,
  getCurrentUserOffline,
} from './auth';
import {
  createSimulationOnline,
  listSimulationsOnline,
  getSimulationOnline,
  updateSimulationOnline,
  deleteSimulationOnline,
  getSimulationStatsOnline,
  calculateSimulationOnline,
  createSimulationOffline,
  listSimulationsOffline,
  deleteSimulationOffline,
} from './simulations';

// Re-export public types so existing imports keep working
export type { User, Simulation, SimulationCreate } from './types';
export { ApiError } from './types';

class ApiService {
  private http: HttpClient;

  constructor(baseURL: string) {
    this.http = new HttpClient(baseURL);
  }

  setBaseURL(url: string) {
    this.http.setBaseURL(url);
  }

  getBaseURL(): string {
    return this.http.getBaseURL();
  }

  setOfflineMode(offline: boolean) {
    this.http.setOfflineMode(offline);
  }

  isOffline(): boolean {
    return this.http.isOffline();
  }

  setToken(token: string) {
    this.http.setToken(token);
  }

  clearToken() {
    this.http.clearToken();
  }

  async healthCheck() {
    return this.http.request('/health');
  }

  async testConnection(): Promise<{ connected: boolean; baseURL: string; error?: string; offlineMode: boolean }> {
    if (this.isOffline()) {
      return {
        connected: false,
        baseURL: this.getBaseURL(),
        offlineMode: true,
        error: 'Offline mode enabled'
      };
    }
    try {
      await this.healthCheck();
      return { connected: true, baseURL: this.getBaseURL(), offlineMode: false };
    } catch (error) {
      return {
        connected: false,
        baseURL: this.getBaseURL(),
        offlineMode: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Authentication
  async register(userData: { email: string; nome?: string; senha: string }): Promise<User> {
    if (this.isOffline()) {
      return registerOffline(userData.email, userData.nome);
    }
    return registerOnline(this.http, userData);
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    if (this.isOffline()) {
      // Offline login returns mock user and stores mock token
      return loginOffline(this.http, email);
    }
    try {
      return await loginOnline(this.http, email, password);
    } catch (error) {
      if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'NETWORK_ERROR')) {
        throw new Error('AUTH_FAILED');
      }
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    if (this.isOffline()) {
      return getCurrentUserOffline();
    }
    return getCurrentUserOnline(this.http);
  }

  async updateUser(userData: { nome?: string }): Promise<User> {
    return updateUserOnline(this.http, userData);
  }

  // Simulations
  async createSimulation(simulationData: SimulationCreate): Promise<Simulation> {
    if (this.isOffline()) {
      return createSimulationOffline(simulationData);
    }
    return createSimulationOnline(this.http, simulationData);
  }

  async getSimulations(skip = 0, limit = 100): Promise<{ simulations: Simulation[]; total: number }> {
    if (this.isOffline()) {
      // Keep parity with previous behavior (no pagination in offline, sliced by consumer if needed)
      const res = await listSimulationsOffline();
      return { simulations: res.simulations.slice(skip, skip + limit), total: res.total };
    }
    return listSimulationsOnline(this.http, skip, limit);
  }

  async getSimulation(id: number): Promise<Simulation> {
    return getSimulationOnline(this.http, id);
  }

  async updateSimulation(id: number, simulationData: Partial<SimulationCreate>): Promise<Simulation> {
    return updateSimulationOnline(this.http, id, simulationData);
  }

  async deleteSimulation(id: number): Promise<void> {
    if (this.isOffline()) {
      return deleteSimulationOffline(id);
    }
    return deleteSimulationOnline(this.http, id);
  }

  async getSimulationStatistics() {
    return getSimulationStatsOnline(this.http);
  }

  async calculateSimulation(simulationData: SimulationCreate) {
    return calculateSimulationOnline(this.http, simulationData);
  }
}

let apiServiceInstance: ApiService | null = null;

export const getApiService = (): ApiService => {
  if (!apiServiceInstance) {
    const config = getApiConfig();
    apiServiceInstance = new ApiService(config.baseURL);
    if (typeof window !== 'undefined') {
      initializeHttpClient((apiServiceInstance as any).http as HttpClient);
    }
  }
  return apiServiceInstance;
};
