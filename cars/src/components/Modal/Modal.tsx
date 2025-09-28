/* src/components/Modal/Modal.tsx */
import './modal.css';
import Button from '../Button/Button';

interface Props {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ title, children, onClose }: Props) {
  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <header className="modal__header">
          <h3>{title}</h3>
          {/* sustituimos `variant="secondary"` por className */}
          <Button
            className="btn--secondary"
            onClick={onClose}
          >
            ✕
          </Button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
