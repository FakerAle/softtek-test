// src/auth/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore }      from './authStore';   // ← llaves ✅

export default function PrivateRoute() {
  const { token } = useAuthStore();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
