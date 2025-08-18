// Shared API and Frontend types + mappers

// API Types (match backend schemas)
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

// Frontend Types
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
  nome: apiSim.property_address || `Simulação ${apiSim.id}`,
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

// Custom API error
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}


