// src/auth/authStore.ts
import { create } from 'zustand';

interface JwtPayload { sub: string; exp: number; }

interface AuthState {
  token: string | null;
  user:  string | null;
  login(token: string): void;
  logout(): void;
}

const TOKEN_KEY = 'cars-token';

// helper para decodificar sin librerías externas
function decodeJwt<T>(token: string): T {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('JWT inválido');
  // ajustamos Base64 URL → Base64 normal
  const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  // decodificamos y parseamos JSON
  const json = atob(b64);
  return JSON.parse(json);
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user:  null,

  login: (token) => {
    const { sub } = decodeJwt<JwtPayload>(token);
    localStorage.setItem(TOKEN_KEY, token);
    set({ token, user: sub });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null, user: null });
  },
}));

// rehidratar al arrancar
const saved = localStorage.getItem(TOKEN_KEY);
if (saved) {
  try {
    const { sub } = decodeJwt<JwtPayload>(saved);
    useAuthStore.setState({ token: saved, user: sub });
  } catch {
    /* token inválido → no hacemos nada */
  }
}
