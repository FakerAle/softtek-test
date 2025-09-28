import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '@/api/auth';
import { useAuthStore } from '@/auth/authStore';
import Button from '@/components/Button/Button';
import './login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { token } = await api.login(form);
      login(token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Credenciales inválidas. Por favor, intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login">
      <div className="login__container">
        <form 
          className={`login__box ${isLoading ? 'login__box--loading' : ''}`}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="login__header">
            <h1 className="login__title">Bienvenido</h1>
            <p className="login__subtitle">Ingresa a tu cuenta para continuar</p>
          </div>

          <div className="login__form">
            <div className="login__field">
              <label htmlFor="email" className="login__label">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="login__input"
                disabled={isLoading}
                required
              />
            </div>

            <div className="login__field">
              <label htmlFor="password" className="login__label">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="login__input"
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <div className="login__error" role="alert">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              style={{ width: '100%' }}
              disabled={isLoading}
            >
              {isLoading ? 'Ingresando...' : 'Entrar a mi cuenta'}
            </Button>
          </div>

          <div className="login__footer">
            <Link to="/register" className="login__link">
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}