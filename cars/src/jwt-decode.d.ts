// src/types/jwt-decode.d.ts
declare module 'jwt-decode' {
  export default function jwtDecode<T = any>(token: string): T;
}
