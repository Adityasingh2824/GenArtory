// frontend/src/components/common/Input.tsx
import React, { InputHTMLAttributes, ChangeEvent } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void; // Add onChange prop
}

const Input: React.FC<InputProps> = ({
  label, 
  error,
  onChange, // Include onChange in destructuring
  ...rest 
}) => {
  return (
    <div className={styles.inputContainer}>
      {label && (
        <label htmlFor={rest.id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        className={clsx(styles.input, { [styles.errorInput]: error })}
        {...rest} // Spread the rest of the input attributes
        onChange={onChange} // Attach the onChange handler
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Input;
