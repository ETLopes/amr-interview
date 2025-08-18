import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

export type SimulationInput = {
  property_value: number;
  down_payment_percentage: number;
  contract_years: number;
  property_address?: string | null;
  property_type?: string | null;
  notes?: string | null;
};

export type CalculatedValues = {
  down_payment_amount: number;
  financing_amount: number;
  total_to_save: number;
  monthly_savings: number;
};

export type Simulation = SimulationInput &
  CalculatedValues & {
    id: number;
    user_id: number;
    created_at: string;
    updated_at?: string | null;
  };

export type SimulationsList = { simulations: Simulation[]; total: number };

export type CalculationResponse = {
  input: {
    property_value: number;
    down_payment_percentage: number;
    contract_years: number;
  };
  calculated_values: CalculatedValues;
};

export async function calculate(input: SimulationInput): Promise<CalculationResponse> {
  return apiFetch<CalculationResponse>("/calculate", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function createSimulation(input: SimulationInput): Promise<Simulation> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  return apiFetch<Simulation>("/simulations", { method: "POST", body: JSON.stringify(input) }, token);
}

export async function listSimulations(params: { skip?: number; limit?: number } = {}): Promise<SimulationsList> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const q = new URLSearchParams();
  if (params.skip) q.set("skip", String(params.skip));
  if (params.limit) q.set("limit", String(params.limit));
  const path = "/simulations" + (q.toString() ? `?${q.toString()}` : "");
  return apiFetch<SimulationsList>(path, {}, token);
}

export async function getSimulation(id: number): Promise<Simulation> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  return apiFetch<Simulation>(`/simulations/${id}`, {}, token);
}

export async function updateSimulation(
  id: number,
  data: Partial<SimulationInput>
): Promise<Simulation> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  return apiFetch<Simulation>(`/simulations/${id}`, { method: "PUT", body: JSON.stringify(data) }, token);
}

export async function deleteSimulation(id: number): Promise<{ message: string }> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  return apiFetch<{ message: string }>(`/simulations/${id}`, { method: "DELETE" }, token);
}

export async function getStatistics(): Promise<{
  total_simulations: number;
  total_property_value: number;
  average_down_payment_percentage: number;
  average_contract_years: number;
}> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  return apiFetch(`/simulations/statistics`, {}, token);
}
