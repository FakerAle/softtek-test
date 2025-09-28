/* src/pages/CarsPage/CarDetails.tsx */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as api from '@/api/cars'
import Button from '@/components/Button/Button'
import './details.css'

export default function CarDetails() {
  const { plate = '' } = useParams()
  const nav = useNavigate()
  const [car, setCar] = useState<api.Car>()

  useEffect(() => {
    api.getByPlate(plate).then(setCar)
  }, [plate])

  if (!car) return <p style={{ textAlign: 'center' }}>Cargando…</p>

  return (
    <section className="detail">
      <h2>
        {car.brand} {car.model} {car.year}
      </h2>
      <ul>
        <li><b>Año:</b> {car.year}</li>
        <li><b>Placa:</b> {car.plate}</li>
        <li><b>Color:</b> {car.color}</li>
      </ul>
      {/* aquí también cambiamos variant por clase */}
      <Button
        className="btn--secondary"
        onClick={() => nav(-1)}
      >
        Volver
      </Button>
    </section>
  )
}
