// src/pages/RegisterPage/RegisterPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '@/api/auth';
import { useAuthStore } from '@/auth/authStore';
import Button from '@/components/Button/Button';
import './register.css';

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
}

interface PasswordRequirements {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState<FormData>({ 
    username: '', 
    email: '', 
    password: '' 
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false
  });

  // Validaciones de contraseña en tiempo real
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  useEffect(() => {
    // Validar requisitos de contraseña
    setPasswordRequirements({
      hasMinLength: form.password.length >= 8,
      hasUpperCase: /[A-Z]/.test(form.password),
      hasLowerCase: /[a-z]/.test(form.password),
      hasNumber: /[0-9]/.test(form.password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(form.password)
    });
  }, [form.password]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'username':
        if (!value.trim()) return 'El nombre de usuario es obligatorio';
        if (value.length < 3) return 'Mínimo 3 caracteres';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Solo letras, números y _';
        return '';
      
      case 'email':
        if (!value.trim()) return 'El email es obligatorio';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
        return '';
      
      case 'password':
        if (!value) return 'La contraseña es obligatoria';
        if (value.length < 8) return 'Mínimo 8 caracteres';
        if (!passwordRequirements.hasUpperCase) return 'Incluye una mayúscula';
        if (!passwordRequirements.hasLowerCase) return 'Incluye una minúscula';
        if (!passwordRequirements.hasNumber) return 'Incluye un número';
        return '';
      
      default:
        return '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real solo para campos tocados
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
    
    // Limpiar mensajes globales
    if (message) setMessage('');
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    Object.keys(form).forEach(key => {
      const error = validateField(key, form[key as keyof FormData]);
      if (error) newErrors[key as keyof ValidationErrors] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    setTouched({ username: true, email: true, password: true });
    
    if (!validateForm()) {
      setMessage('Por favor, corrige los errores del formulario');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // 1️⃣ Registro del usuario
      await api.register({
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      });

      setIsSuccess(true);
      setMessage('¡Cuenta creada exitosamente! Redirigiendo...');

      // 2️⃣ Login automático después del registro
      const { token } = await api.login({
        email: form.email.trim().toLowerCase(),
        password: form.password
      });

      // 3️⃣ Actualizar store y redirigir
      login(token);
      
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);

    } catch (err: any) {
      console.error('Error en registro:', err);
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'No se pudo crear la cuenta. Intenta nuevamente.';
      setMessage(errorMessage);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (fieldName: string) => {
    const baseClass = 'register__input';
    if (!touched[fieldName as keyof typeof touched]) return baseClass;
    
    if (errors[fieldName as keyof ValidationErrors]) {
      return `${baseClass} register__input--error`;
    }
    
    if (form[fieldName as keyof FormData]) {
      return `${baseClass} register__input--valid`;
    }
    
    return baseClass;
  };

  return (
    <section className="register">
      <div className="register__container">
        <form 
          className={`register__box ${isLoading ? 'register__box--loading' : ''}`}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="register__header">
            <h1 className="register__title">Crear Cuenta</h1>
            <p className="register__subtitle">
              Únete a nuestra comunidad y descubre todas las funcionalidades
            </p>
          </div>

          <div className="register__form">
            {/* Campo Username */}
            <div className="register__field">
              <label htmlFor="username" className="register__label">
                Nombre de Usuario
                <span>3+ caracteres</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="tu_usuario"
                className={getInputClassName('username')}
                disabled={isLoading}
                required
              />
              {errors.username && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>
                  {errors.username}
                </span>
              )}
            </div>

            {/* Campo Email */}
            <div className="register__field">
              <label htmlFor="email" className="register__label">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="tu@email.com"
                className={getInputClassName('email')}
                disabled={isLoading}
                required
              />
              {errors.email && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Campo Password */}
            <div className="register__field">
              <label htmlFor="password" className="register__label">
                Contraseña
                <span>8+ caracteres</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={getInputClassName('password')}
                disabled={isLoading}
                required
              />
              
              {/* Indicadores de fortaleza de contraseña */}
              {form.password && (
                <div className="register__requirements">
                  <h4>La contraseña debe contener:</h4>
                  <div className={`register__requirement ${passwordRequirements.hasMinLength ? 'valid' : 'invalid'}`}>
                    • Mínimo 8 caracteres
                  </div>
                  <div className={`register__requirement ${passwordRequirements.hasUpperCase ? 'valid' : 'invalid'}`}>
                    • Una letra mayúscula
                  </div>
                  <div className={`register__requirement ${passwordRequirements.hasLowerCase ? 'valid' : 'invalid'}`}>
                    • Una letra minúscula
                  </div>
                  <div className={`register__requirement ${passwordRequirements.hasNumber ? 'valid' : 'invalid'}`}>
                    • Un número
                  </div>
                </div>
              )}
            </div>

            {/* Mensajes globales */}
            {message && (
              <div className={isSuccess ? 'register__success' : 'register__error'}>
                {message}
              </div>
            )}

            <Button 
              type="submit" 
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear mi cuenta'}
            </Button>
          </div>

          <div className="register__footer">
            <Link to="/login" className="register__link">
              ¿Ya tienes cuenta? Inicia sesión aquí
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}