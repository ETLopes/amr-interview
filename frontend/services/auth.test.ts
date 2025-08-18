import { HttpClient } from '@/services/http';
import { registerOnline, loginOnline, getCurrentUserOnline, updateUserOnline, registerOffline, loginOffline, getCurrentUserOffline } from '@/services/auth';

describe('auth online', () => {
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

  it('registerOnline posts and maps user', async () => {
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 1, email: 'x@y.com', name: 'X', created_at: 'now' }), { status: 200 }));
    const user = await registerOnline(client, { email: 'x@y.com', nome: 'X', senha: 'pw' });
    expect(user.email).toBe('x@y.com');
  });

  it('loginOnline stores token and returns user', async () => {
    // token
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 't', token_type: 'bearer' }), { status: 200 }));
    // users/me
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 2, email: 'a@b.com', created_at: 'now' }), { status: 200 }));

    const { user, token } = await loginOnline(client, 'a@b.com', 'pw');
    expect(token).toBe('t');
    expect(user.id).toBe(2);
    expect(localStorage.getItem('access_token')).toBe('t');
  });

  it('getCurrentUserOnline returns user', async () => {
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 3, email: 'c@d.com', created_at: 'now' }), { status: 200 }));
    const user = await getCurrentUserOnline(client);
    expect(user.email).toBe('c@d.com');
  });

  it('updateUserOnline patches user', async () => {
    // @ts-expect-error
    global.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 4, email: 'e@f.com', name: 'New', created_at: 'now' }), { status: 200 }));
    const user = await updateUserOnline(client, { nome: 'New' });
    expect(user.nome).toBe('New');
  });
});

describe('auth offline', () => {
  it('registerOffline returns mock user', async () => {
    const u = await registerOffline('a@b.com', 'A');
    expect(u.email).toBe('a@b.com');
  });

  it('loginOffline stores mock token and returns user', async () => {
    const client = new HttpClient('http://api.test');
    const { token, user } = await loginOffline(client, 'x@y.com');
    expect(token).toContain('mock_token_');
    expect(user.email).toBe('x@y.com');
  });

  it('getCurrentUserOffline returns demo user', async () => {
    const u = await getCurrentUserOffline();
    expect(u.email).toBe('demo@amora.com');
  });
});


