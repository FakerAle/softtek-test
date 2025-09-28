/* src/pages/CarsPage/CarForm.tsx */
import { useEffect, useState } from 'react'
import * as api from '@/api/cars'
import Button from '@/components/Button/Button'
import { useForm } from '@/hooks/useForm'
import './form.css'

interface Props {
  initial?: api.Car
  onSubmit: (c: api.Car) => void
  onCancel: () => void
}

const COLOR_OPTIONS = [
  'Rojo', 'Azul', 'Verde', 'Negro', 'Blanco', 'Gris', 
  'Plateado', 'Amarillo', 'Naranja', 'Morado'
];

const BRAND_OPTIONS = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Volkswagen', 'Nissan',
  'BMW', 'Mercedes-Benz', 'Audi', 'Hyundai', 'Kia', 'Mazda'
];

export default function CarForm({ initial, onSubmit, onCancel }: Props) {
  const { values, onChange, setValues } = useForm<api.Car>(
    initial ?? {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      plate: '',
      color: ''
    }
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initial) setValues(initial)
  }, [initial, setValues])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (values.plate && !/^[A-Z0-9]{3,10}$/i.test(values.plate)) {
      newErrors.plate = 'Placa: solo letras y números (3-10 caracteres)'
    }

    const currentYear = new Date().getFullYear()
    if (values.year < 1900 || values.year > currentYear + 1) {
      newErrors.year = `Año debe ser entre 1900 y ${currentYear + 1}`
    }

    const requiredFields: (keyof api.Car)[] = ['brand', 'model', 'plate', 'color']
    requiredFields.forEach(field => {
      if (!values[field]?.toString().trim()) {
        newErrors[field] = 'Campo requerido'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(values)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(e)
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }
  }

  const getInputClassName = (fieldName: string) => {
    return `car-form__input ${errors[fieldName] ? 'car-form__input--error' : ''}`
  }

  return (
    <form className="car-form" onSubmit={handleSubmit} noValidate>
      <div className="car-form__header">
        <h3 className="car-form__title">
          {initial ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        </h3>
        <p className="car-form__subtitle">
          {initial ? 'Modifica la información del vehículo' : 'Completa la información del vehículo'}
        </p>
      </div>

      <div className="car-form__fields">
        {/* Marca */}
        <div className="car-form__field">
          <label htmlFor="brand" className="car-form__label">
            Marca
          </label>
          <input
            id="brand"
            name="brand"
            list="brand-options"
            value={values.brand}
            onChange={handleChange}
            className={getInputClassName('brand')}
            placeholder="Ej: Toyota"
            required
          />
          <datalist id="brand-options">
            {BRAND_OPTIONS.map(brand => (
              <option key={brand} value={brand} />
            ))}
          </datalist>
          {errors.brand && (
            <span className="car-form__error">{errors.brand}</span>
          )}
        </div>

        {/* Modelo */}
        <div className="car-form__field">
          <label htmlFor="model" className="car-form__label">
            Modelo
          </label>
          <input
            id="model"
            name="model"
            value={values.model}
            onChange={handleChange}
            className={getInputClassName('model')}
            placeholder="Ej: Corolla"
            required
          />
          {errors.model && (
            <span className="car-form__error">{errors.model}</span>
          )}
        </div>

        {/* Año y Color en fila (solo en desktop) */}
        <div className="car-form__row">
          <div className="car-form__field">
            <label htmlFor="year" className="car-form__label">
              Año
            </label>
            <input
              id="year"
              name="year"
              type="number"
              value={values.year}
              onChange={handleChange}
              className={getInputClassName('year')}
              min="1900"
              max={new Date().getFullYear() + 1}
              required
            />
            {errors.year && (
              <span className="car-form__error">{errors.year}</span>
            )}
          </div>

          <div className="car-form__field">
            <label htmlFor="color" className="car-form__label">
              Color
            </label>
            <select
              id="color"
              name="color"
              value={values.color}
              onChange={handleChange}
              className={`${getInputClassName('color')} car-form__select`}
              required
            >
              <option value="">Selecciona color</option>
              {COLOR_OPTIONS.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            {errors.color && (
              <span className="car-form__error">{errors.color}</span>
            )}
          </div>
        </div>

        {/* Placa */}
        <div className="car-form__field">
          <label htmlFor="plate" className="car-form__label">
            Placa
          </label>
          <input
            id="plate"
            name="plate"
            value={values.plate}
            onChange={handleChange}
            className={getInputClassName('plate')}
            placeholder="Ej: ABC123"
            style={{ textTransform: 'uppercase' }}
            required
          />
          {errors.plate && (
            <span className="car-form__error">{errors.plate}</span>
          )}
          <span className="car-form__hint">Solo letras y números</span>
        </div>
      </div>

      <div className="car-form__actions">
        <Button type="button" className="btn--secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initial ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  )
}