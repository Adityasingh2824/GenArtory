// frontend/src/components/common/Card.tsx
import React from 'react';
import styles from './Card.module.css';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string; // Optional additional class name
  onClick?: () => void; // Optional onClick handler
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div 
      className={clsx(styles.card, className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
