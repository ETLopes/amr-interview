import { HttpClient } from './http';
import {
  ApiToken,
  ApiUser,
  ApiUserCreate,
  ApiUserUpdate,
  User,
  mapApiUserToUser,
  mapUserCreateToApi,
} from './types';

// Online implementations
export const registerOnline = async (
  http: HttpClient,
  userData: { email: string; nome?: string; senha: string }
): Promise<User> => {
  const apiUserData: ApiUserCreate = mapUserCreateToApi(userData);
  const apiUser = await http.request<ApiUser>('/register', {
    method: 'POST',
    body: JSON.stringify(apiUserData),
  });
  return mapApiUserToUser(apiUser);
};

export const loginOnline = async (
  http: HttpClient,
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);

  const tokenResponse = await http.request<ApiToken>('/token', {
    method: 'POST',
    headers: {},
    body: formData,
  });

  http.setToken(tokenResponse.access_token);

  const apiUser = await http.request<ApiUser>('/users/me');
  const user = mapApiUserToUser(apiUser);
  return { user, token: tokenResponse.access_token };
};

export const getCurrentUserOnline = async (http: HttpClient): Promise<User> => {
  const apiUser = await http.request<ApiUser>('/users/me');
  return mapApiUserToUser(apiUser);
};

export const updateUserOnline = async (
  http: HttpClient,
  userData: { nome?: string }
): Promise<User> => {
  const apiUserData: ApiUserUpdate = { name: userData.nome };
  const apiUser = await http.request<ApiUser>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(apiUserData),
  });
  return mapApiUserToUser(apiUser);
};

// Offline implementations
export const registerOffline = async (
  email: string,
  nome?: string
): Promise<User> => {
  return {
    id: 1,
    email,
    nome,
    dataCriacao: new Date().toISOString(),
  };
};

export const loginOffline = async (
  http: HttpClient,
  email: string
): Promise<{ user: User; token: string }> => {
  const mockUser: User = {
    id: 1,
    email,
    nome: email.split('@')[0],
    dataCriacao: new Date().toISOString(),
  };
  const mockToken = 'mock_token_' + Date.now();
  http.setToken(mockToken);
  return { user: mockUser, token: mockToken };
};

export const getCurrentUserOffline = async (): Promise<User> => {
  return {
    id: 1,
    email: 'demo@amora.com',
    nome: 'Usuário Demo',
    dataCriacao: new Date().toISOString(),
  };
};


