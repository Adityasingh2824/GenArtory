// frontend/src/components/common/LoadingSpinner.tsx

import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'; // Allow customization of size
  color?: string;                     // Allow custom color override
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', color }) => {
  return (
    <div 
      className={styles.spinner}
      style={{
        width: size === 'small' ? '16px' : size === 'large' ? '32px' : '24px',
        height: size === 'small' ? '16px' : size === 'large' ? '32px' : '24px',
        borderTopColor: color || 'var(--primary-color)' // Use custom color or default primary color
      }}
    >
    </div>
  );
};

export default LoadingSpinner;
