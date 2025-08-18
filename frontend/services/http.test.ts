import { HttpClient, initializeHttpClient } from '@/services/http';

describe('HttpClient', () => {
  const baseURL = 'http://api.test';
  let originalFetch: any;

  beforeEach(() => {
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

  it('uses baseURL and attaches token header', async () => {
    const client = new HttpClient(baseURL);
    client.setToken('abc');
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    await client.request('/health');

    expect(global.fetch).toHaveBeenCalledWith(
      baseURL + '/health',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer abc' }),
      })
    );
  });

  it('blocks requests when offline (except /health)', async () => {
    const client = new HttpClient(baseURL);
    client.setOfflineMode(true);

    await expect(client.request('/simulations')).rejects.toThrow('API_OFFLINE');

    // health should still attempt
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    await expect(client.request('/health')).resolves.toBeDefined();
  });

  it('clears token on 401', async () => {
    const client = new HttpClient(baseURL);
    client.setToken('xyz');
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ detail: 'unauth' }), { status: 401 }));
    await expect(client.request('/users/me')).rejects.toThrow('UNAUTHORIZED');
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('returns empty object for 204', async () => {
    const client = new HttpClient(baseURL);
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(undefined, { status: 204 }));
    const res = await client.request('/delete', { method: 'DELETE' });
    expect(res).toEqual({});
  });
});

describe('initializeHttpClient', () => {
  const baseURL = 'http://api.test';
  let originalFetch: any;

  beforeEach(() => {
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

  it('sets offline false when health ok', async () => {
    const client = new HttpClient(baseURL);
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ status: 'ok' }), { status: 200 }));
    await initializeHttpClient(client);
    expect(client.isOffline()).toBe(false);
  });

  it('sets offline true when health fails', async () => {
    const client = new HttpClient(baseURL);
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(undefined, { status: 500 }));
    await initializeHttpClient(client);
    expect(client.isOffline()).toBe(true);
  });
});


