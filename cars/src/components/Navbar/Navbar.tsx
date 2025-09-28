/* src/components/Navbar/Navbar.tsx */
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/auth/authStore';
import Button from '../Button/Button';
import './navbar.css';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__brand">
          Registro de Autos
        </Link>

        {user && (
          <div className="nav__user">
            <span>👋 {user}</span>
            {/* Reemplazamos variant="secondary" por className="btn--secondary" */}
            <Button className="btn--secondary" onClick={logout}>
              Salir
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
