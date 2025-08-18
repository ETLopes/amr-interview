import { HttpClient } from './http';
import {
  ApiSimulation,
  ApiSimulationsListResponse,
  ApiSimulationCreate,
  ApiSimulationUpdate,
  Simulation,
  SimulationCreate,
  mapApiSimulationToSimulation,
  mapSimulationCreateToApi,
} from './types';

// Online implementations
export const createSimulationOnline = async (
  http: HttpClient,
  simulationData: SimulationCreate
): Promise<Simulation> => {
  const apiSimData: ApiSimulationCreate = mapSimulationCreateToApi(simulationData);
  const apiSim = await http.request<ApiSimulation>('/simulations', {
    method: 'POST',
    body: JSON.stringify(apiSimData),
  });
  return mapApiSimulationToSimulation(apiSim);
};

export const listSimulationsOnline = async (
  http: HttpClient,
  skip = 0,
  limit = 100
): Promise<{ simulations: Simulation[]; total: number }> => {
  const response = await http.request<ApiSimulationsListResponse>(
    `/simulations?skip=${skip}&limit=${limit}`
  );
  return {
    simulations: response.simulations.map(mapApiSimulationToSimulation),
    total: response.total,
  };
};

export const getSimulationOnline = async (
  http: HttpClient,
  id: number
): Promise<Simulation> => {
  const apiSim = await http.request<ApiSimulation>(`/simulations/${id}`);
  return mapApiSimulationToSimulation(apiSim);
};

export const updateSimulationOnline = async (
  http: HttpClient,
  id: number,
  data: Partial<SimulationCreate>
): Promise<Simulation> => {
  const apiSimData: ApiSimulationUpdate = {};
  if (data.valorImovel !== undefined) apiSimData.property_value = data.valorImovel;
  if (data.percentualEntrada !== undefined) apiSimData.down_payment_percentage = data.percentualEntrada;
  if (data.anosContrato !== undefined) apiSimData.contract_years = data.anosContrato;
  if (data.endereco !== undefined) apiSimData.property_address = data.endereco;
  if (data.tipoImovel !== undefined) apiSimData.property_type = data.tipoImovel;
  if (data.observacoes !== undefined) apiSimData.notes = data.observacoes;

  const apiSim = await http.request<ApiSimulation>(`/simulations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(apiSimData),
  });
  return mapApiSimulationToSimulation(apiSim);
};

export const deleteSimulationOnline = async (http: HttpClient, id: number): Promise<void> => {
  await http.request(`/simulations/${id}`, { method: 'DELETE' });
};

export const getSimulationStatsOnline = async (http: HttpClient) => {
  return http.request('/simulations/statistics');
};

export const calculateSimulationOnline = async (
  http: HttpClient,
  simulationData: SimulationCreate
) => {
  const apiSimData = mapSimulationCreateToApi(simulationData);
  return http.request('/calculate', {
    method: 'POST',
    body: JSON.stringify(apiSimData),
  });
};

// Offline helpers
const getOfflineStore = (): Simulation[] => {
  if (typeof window !== 'undefined') {
    try {
      return JSON.parse(localStorage.getItem('offline_simulations') || '[]');
    } catch {
      return [];
    }
  }
  return [];
};

const setOfflineStore = (sims: Simulation[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('offline_simulations', JSON.stringify(sims));
    } catch {}
  }
};

export const createSimulationOffline = async (
  simulationData: SimulationCreate
): Promise<Simulation> => {
  const mockId = Date.now();
  const valorEntrada = (simulationData.valorImovel * simulationData.percentualEntrada) / 100;
  const mock: Simulation = {
    id: mockId,
    nome: simulationData.nome,
    valorImovel: simulationData.valorImovel,
    percentualEntrada: simulationData.percentualEntrada,
    anosContrato: simulationData.anosContrato,
    endereco: simulationData.endereco,
    tipoImovel: simulationData.tipoImovel,
    observacoes: simulationData.observacoes,
    valorEntrada,
    valorFinanciar: simulationData.valorImovel - valorEntrada,
    totalGuardar: simulationData.valorImovel * 0.15,
    valorMensalPoupanca: (simulationData.valorImovel * 0.15) / (simulationData.anosContrato * 12),
    dataCriacao: new Date().toISOString(),
  };
  const existing = getOfflineStore();
  existing.push(mock);
  setOfflineStore(existing);
  return mock;
};

export const listSimulationsOffline = async (): Promise<{ simulations: Simulation[]; total: number }> => {
  const simulations = getOfflineStore();
  return { simulations, total: simulations.length };
};

export const deleteSimulationOffline = async (id: number): Promise<void> => {
  const simulations = getOfflineStore();
  const filtered = simulations.filter(sim => sim.id !== id);
  setOfflineStore(filtered);
};


