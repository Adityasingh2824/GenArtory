// frontend/src/components/common/Checkbox.tsx
import React, { InputHTMLAttributes, ChangeEvent } from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, error, ...rest }) => {
  return (
    <div className={styles.checkboxContainer}>
      <input type="checkbox" className={styles.checkbox} {...rest} />
      <label htmlFor={rest.id} className={styles.label}>
        {label}
      </label>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Checkbox;
