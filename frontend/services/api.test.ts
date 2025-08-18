import { getApiService } from '@/services/api';
jest.mock('@/config/api', () => ({ getApiConfig: () => ({ baseURL: 'http://api.test' }) }));

describe('ApiService facade', () => {
  let originalFetch: any;

  beforeEach(() => {
    originalFetch = global.fetch;
    // @ts-expect-error
    global.fetch = jest.fn().mockResolvedValue(new Response(JSON.stringify({ status: 'ok' }), { status: 200 }));
    localStorage.clear();
  });

  afterEach(() => {
    // @ts-expect-error
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('exposes singleton and healthCheck', async () => {
    const api = getApiService();
    const result = await api.testConnection();
    expect(result.connected).toBe(true);
    expect(result.baseURL).toBe('http://api.test');
  });

  it('offline mode short-circuits some flows', async () => {
    const api = getApiService();
    api.setOfflineMode(true);
    const { simulations } = await api.getSimulations();
    expect(Array.isArray(simulations)).toBe(true);
  });
});


