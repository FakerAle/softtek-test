// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage/LoginPage';
import RegisterPage from '@/pages/RegisterPage/RegisterPage';
import CarsPage from '@/pages/CarsPage/CarsPage';
import CarDetails from '@/pages/CarsPage/CarDetails';
import PrivateRoute from '@/auth/PrivateRoute';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <>
      <Routes>

        {/* públicas --------------------------------------------------- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* protegidas ------------------------------------------------- */}
        <Route element={<PrivateRoute />}>
          <Route index element={<CarsPage />} />
          <Route path="/cars/:plate" element={<CarDetails />} />
        </Route>

        {/* fallback --------------------------------------------------- */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
      {/* ToastContainer global */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
