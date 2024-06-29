// frontend/src/components/common/RadioGroup.tsx
import React, { useState } from 'react';
import styles from './RadioGroup.module.css';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string; // Name for the group of radio buttons
  options: RadioOption[];
  onChange?: (value: string) => void;
  value?: string;
  error?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  onChange,
  value,
  error,
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className={styles.radioGroup}>
      {options.map((option) => (
        <label key={option.value} className={styles.radioButton}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={handleChange}
          />
          {option.label}
        </label>
      ))}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default RadioGroup;
