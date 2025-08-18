import { HttpClient } from '@/services/http';
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
} from '@/services/simulations';

describe('simulations online', () => {
  const baseURL = 'http://api.test';
  let client: HttpClient;
  let originalFetch: any;

  beforeEach(() => {
    client = new HttpClient(baseURL);
    originalFetch = global.fetch;
    // @ts-expect-error
    global.fetch = jest.fn();
    localStorage.clear();
  });

  afterEach(() => {
    // @ts-expect-error
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('createSimulationOnline posts and maps', async () => {
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 1, property_value: 100, down_payment_percentage: 10, contract_years: 1, down_payment_amount: 10, financing_amount: 90, total_to_save: 15, monthly_savings: 1, created_at: 'now', user_id: 1 }), { status: 200 }));
    const sim = await createSimulationOnline(client, { nome: 'N', valorImovel: 100, percentualEntrada: 10, anosContrato: 1 });
    expect(sim.valorImovel).toBe(100);
  });

  it('listSimulationsOnline returns mapped list', async () => {
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ simulations: [ { id: 1, user_id: 1, property_value: 100, down_payment_percentage: 10, contract_years: 1, down_payment_amount: 10, financing_amount: 90, total_to_save: 15, monthly_savings: 1, created_at: 'now' } ], total: 1 }), { status: 200 }));
    const { simulations, total } = await listSimulationsOnline(client, 0, 10);
    expect(simulations.length).toBe(1);
    expect(total).toBe(1);
  });

  it('getSimulationOnline returns one', async () => {
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 2, user_id: 1, property_value: 200, down_payment_percentage: 20, contract_years: 2, down_payment_amount: 40, financing_amount: 160, total_to_save: 30, monthly_savings: 2, created_at: 'now' }), { status: 200 }));
    const sim = await getSimulationOnline(client, 2);
    expect(sim.id).toBe(2);
  });

  it('updateSimulationOnline updates and returns mapped', async () => {
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 3, user_id: 1, property_value: 300, down_payment_percentage: 30, contract_years: 3, down_payment_amount: 90, financing_amount: 210, total_to_save: 45, monthly_savings: 3, created_at: 'now' }), { status: 200 }));
    const sim = await updateSimulationOnline(client, 3, { valorImovel: 300 });
    expect(sim.valorImovel).toBe(300);
  });

  it('deleteSimulationOnline calls backend', async () => {
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(undefined, { status: 204 }));
    await expect(deleteSimulationOnline(client, 1)).resolves.toEqual(undefined);
  });

  it('getSimulationStatsOnline returns json', async () => {
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ total: 0 }), { status: 200 }));
    const data = await getSimulationStatsOnline(client);
    expect(data).toEqual({ total: 0 });
  });

  it('calculateSimulationOnline posts to /calculate', async () => {
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const res = await calculateSimulationOnline(client, { nome: 'N', valorImovel: 100, percentualEntrada: 10, anosContrato: 1 });
    expect(res).toEqual({ ok: true });
  });
});

describe('simulations offline', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('createSimulationOffline stores and returns mock', async () => {
    const sim = await createSimulationOffline({ nome: 'N', valorImovel: 100, percentualEntrada: 10, anosContrato: 1 });
    expect(sim.valorEntrada).toBe(10);
  });

  it('listSimulationsOffline returns list and total', async () => {
    await createSimulationOffline({ nome: 'N', valorImovel: 100, percentualEntrada: 10, anosContrato: 1 });
    const { simulations, total } = await listSimulationsOffline();
    expect(simulations.length).toBe(1);
    expect(total).toBe(1);
  });

  it('deleteSimulationOffline removes from store', async () => {
    const a = await createSimulationOffline({ nome: 'A', valorImovel: 100, percentualEntrada: 10, anosContrato: 1 });
    await deleteSimulationOffline(a.id);
    const { total } = await listSimulationsOffline();
    expect(total).toBe(0);
  });
});


