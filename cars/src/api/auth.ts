// src/api/auth.ts

import { http } from './http';

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function login(body: LoginBody): Promise<LoginResponse> {
  // Aquí indicamos que esperamos un objeto { token: string }
  const { data } = await http.post<LoginResponse>('/auth/login', body);
  return data;
}

export async function register(body: RegisterBody): Promise<void> {
  await http.post('/auth/register', body);
}
