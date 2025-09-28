import Modal from '@/components/Modal/Modal';
import Button from '@/components/Button/Button';
import './confirm-delete.css';

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDelete({ open, title, message, onConfirm, onCancel }: Props) {
  if (!open) return null;

  return (
    <Modal title={title} onClose={onCancel}>
      <div className="confirm-delete">
        <p>{message}</p>
        <div className="confirm-delete__actions">
          <Button className="btn--secondary" onClick={onCancel}>Cancelar</Button>
          <Button className="btn--danger" onClick={onConfirm}>Eliminar</Button>
        </div>
      </div>
    </Modal>
  );
}
