import './EmptyState.css';

interface Props {
  title: string;
  message: string;
  icon?: string;
}

export default function EmptyState({ title, message, icon = '🚘' }: Props) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__text">{message}</p>
    </div>
  );
}
