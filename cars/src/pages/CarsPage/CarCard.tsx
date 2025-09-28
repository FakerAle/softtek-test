// src/components/CarCard/CarCard.tsx
import { Car } from '@/api/cars';
import Button from '@/components/Button/Button';
import './card.css';

interface Props {
  car: Car;
  onEdit: () => void;
  onDelete: () => void;
  featured?: boolean;
  isNew?: boolean;
}

export default function CarCard({ car, onEdit, onDelete, featured = false, isNew = false }: Props) {
  // Función para generar un color basado en el nombre del color
  const getColorValue = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'rojo': '#dc2626',
      'azul': '#2563eb',
      'verde': '#16a34a',
      'negro': '#000000',
      'blanco': '#ffffff',
      'gris': '#6b7280',
      'plateado': '#cbd5e1',
      'amarillo': '#eab308',
      'naranja': '#ea580c',
      'morado': '#7c3aed'
    };
    
    return colorMap[colorName.toLowerCase()] || '#6b7280';
  };

  const cardClass = `car-card ${featured ? 'car-card--featured' : ''} ${isNew ? 'car-card--new' : ''}`;

  return (
    <article className={cardClass}>
      {/* Efecto de brillo */}
      <div className="car-card__glow"></div>
      
      <header className="car-card__header">
        <h3 className="car-card__title">
          {car.brand} {car.model}
        </h3>
        <span className="car-card__plate">{car.plate}</span>
      </header>

      <div className="car-card__details">
        <div className="car-card__detail">
          <span className="car-card__label">Año</span>
          <span className="car-card__value car-card__value--year">{car.year}</span>
        </div>
        
        <div className="car-card__detail">
          <span className="car-card__label">Color</span>
          <span 
            className="car-card__value car-card__value--color"
            style={{ color: getColorValue(car.color) }}
            title={car.color}
          >
            {car.color}
          </span>
        </div>
        
        {/* Información adicional que podrías tener */}
        {car.kilometers && (
          <div className="car-card__detail">
            <span className="car-card__label">Kilómetros</span>
            <span className="car-card__value">
              {car.kilometers.toLocaleString()} km
            </span>
          </div>
        )}
        
        {car.fuelType && (
          <div className="car-card__detail">
            <span className="car-card__label">Combustible</span>
            <span className="car-card__value">{car.fuelType}</span>
          </div>
        )}
      </div>

      <footer className="car-card__actions">
        <Button 
          className="btn--secondary" 
          onClick={onEdit}
          style={{
            background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
            color: '#475569',
            border: '1px solid #cbd5e1'
          }}
        >
          ✏️ Editar
        </Button>
        <Button 
          className="btn--danger" 
          onClick={onDelete}
          style={{
            background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
            color: '#dc2626',
            border: '1px solid #fecaca'
          }}
        >
          🗑️ Borrar
        </Button>
      </footer>
    </article>
  );
}