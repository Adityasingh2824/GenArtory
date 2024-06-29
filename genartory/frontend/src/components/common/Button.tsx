// frontend/src/components/common/Button.tsx

import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';
import Spinner from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'; // Adjust variants as needed
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
  onClick?: () => void; // Explicitly define onClick prop
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className,
  isLoading = false,
  children,
  onClick, // Include onClick in destructuring
  ...rest
}) => {
  return (
    <button
      type="button" // Set default type to "button" (adjust if needed)
      className={clsx(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        { [styles['button--fullWidth']]: fullWidth },
        className
      )}
      disabled={isLoading}
      onClick={onClick} // Attach the onClick handler
      {...rest}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
