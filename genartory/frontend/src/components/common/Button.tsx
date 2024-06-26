// frontend/src/components/common/Button.tsx

import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'; // Define your variants
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    fullWidth, // Correct typo
    className,
    isLoading, // Correct typo
    children,
    ...rest
  }) => {
}) => {
  return (
    <button
      className={clsx(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        { [styles['button--fullWidth']]: fullWidth },
        className
      )}
      disabled={isLoading}
      {...rest} // Spread the rest of the button attributes
    >
      {isLoading ? (
        <span className={styles.loader}>Loading...</span> // Simple loading indicator
      ) : (
        children // The content passed to the button
      )}
    </button>
  );
};

export default Button;
