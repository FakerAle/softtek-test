import { useEffect, useState } from 'react';
import * as api from '@/api/cars';
import CarCard from './CarCard';
import CarForm from './CarForm';
import Modal from '@/components/Modal/Modal';
import Button from '@/components/Button/Button';
import './cars.css';
import EmptyState from '@/components/EmptyState/EmptyState';
import ConfirmDelete from '@/components/ConfirmDelete/ConfirmDelete';
import { toast } from 'react-toastify';

export default function CarsPage() {
  const [cars, setCars] = useState<api.Car[]>([]);
  const [editing, setEditing] = useState<api.Car | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [plateToDelete, setPlateToDelete] = useState<string | null>(null);

  /* ────────────── Cargar vehículos ────────────── */
  const load = async () => {
    // 🔧 Llamado real a la API (desactivado en entorno local)
    setCars(await api.listMine());
  };

  useEffect(() => {
    void load(); // 👈 descartamos la Promise
  }, []);

  /* ────────────── CRUD helpers ────────────── */
  const save = async (car: api.Car) => {
    try {
      let updatedCar: api.Car;

      if (editing) {
        // Actualizar vehículo existente
        updatedCar = await api.update(editing.plate, car);
        setCars(prev => prev.map(c => (c.plate === editing.plate ? updatedCar : c)));
        toast.success(`Vehículo ${updatedCar.plate} actualizado.`);
      } else {
        // Crear nuevo vehículo
        updatedCar = await api.create(car);
        setCars(prev => [...prev, updatedCar]);
        toast.success(`Vehículo ${updatedCar.plate} creado.`);
      }
    } catch (error) {
      toast.error('Hubo un error al guardar el vehículo. Intenta nuevamente.');
      console.error('Error guardando vehículo:', error);
    } finally {
      setEditing(null);
      setShowNew(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (plateToDelete) {
      try {
        await api.remove(plateToDelete);
        setCars(cars.filter(c => c.plate !== plateToDelete));
        toast.success(`Vehículo ${plateToDelete} eliminado correctamente.`);
      } catch (error) {
        console.error("Error eliminando el vehículo:", error);
        toast.error("No se pudo eliminar el vehículo. Intenta nuevamente.");
      } finally {
        setPlateToDelete(null);
      }
    }
  };

  /* ────────────── UI ────────────── */
  return (
    <section className="cars">
      <header className="cars__header">
        <h2>Mis vehículos</h2>
        <Button onClick={() => setShowNew(true)}>Añadir</Button>
      </header>

      <div className="cars__grid">
        {cars.map(c => (
          <CarCard
            key={c.plate}
            car={c}
            onEdit={() => setEditing(c)}
            onDelete={() => setPlateToDelete(c.plate)}
          />
        ))}
        {cars.length === 0 && (
          <EmptyState
            title="Sin vehículos registrados"
            message="Agrega tu primer auto para empezar a gestionar tu flota."
            icon="🚘"
          />
        )}
      </div>

      {(showNew || editing) && (
        <Modal
          title={editing ? 'Editar vehículo' : 'Nuevo vehículo'}
          onClose={() => {
            setShowNew(false);
            setEditing(null);
          }}
        >
          <CarForm
            initial={editing ?? undefined}
            onSubmit={save}
            onCancel={() => {
              setShowNew(false);
              setEditing(null);
            }}
          />
        </Modal>
      )}
      <ConfirmDelete
        open={!!plateToDelete}
        title="Eliminar vehículo"
        message={`¿Eliminar el vehículo ${plateToDelete}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPlateToDelete(null)}
      />
    </section>
  );
}
