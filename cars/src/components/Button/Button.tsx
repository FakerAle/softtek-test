// src/components/Button/Button.tsx
import React from 'react';
import './button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({
  children,
  variant = 'primary',
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={['btn', `btn--${variant}`, className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}
