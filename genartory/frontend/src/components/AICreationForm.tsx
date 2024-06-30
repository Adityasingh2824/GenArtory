// frontend/src/components/AICreationForm.tsx

import React, { useState, FormEvent } from 'react';
import styles from './AICreationForm.module.css';
import Input from './common/Input';
import Select from './common/Select';
import Button from './common/Button';

interface AICreationFormProps {
  onSubmit: (formData: FormData) => void;
  error?: string;
}

const AICreationForm: React.FC<AICreationFormProps> = ({ onSubmit, error }) => {
  const [prompt, setPrompt] = useState('');
  // Additional states for other parameters (e.g., style, resolution, etc.)
  const [style, setStyle] = useState('abstract');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [seed, setSeed] = useState('');

  const styleOptions = [
    { value: 'abstract', label: 'Abstract' },
    { value: 'realistic', label: 'Realistic' },
    { value: 'pixelArt', label: 'Pixel Art' },
    // Add more styles as supported by your AI model
  ];

  const aspectRatioOptions = [
    { value: '1:1', label: 'Square' },
    { value: '16:9', label: 'Landscape' },
    { value: '9:16', label: 'Portrait' },
    // Add more aspect ratios as needed
  ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(new FormData(e.currentTarget));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Error Display */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Prompt Input */}
      <Input
        type="text"
        id="prompt"
        label="Prompt"
        placeholder="Enter a description of the artwork you want to generate."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        required
      />

      {/* Style Selection */}
      <Select
        id="style"
        label="Art Style"
        options={styleOptions}
        value={style}
        onChange={(e) => setStyle(e.target.value)}
      />

      {/* Aspect Ratio Selection */}
      <Select
        id="aspectRatio"
        label="Aspect Ratio"
        options={aspectRatioOptions}
        value={aspectRatio}
        onChange={(e) => setAspectRatio(e.target.value)}
      />

      {/* Seed Input (Optional) */}
      <Input
        type="text"
        id="seed"
        label="Seed (optional)"
        placeholder="Enter a seed for reproducibility"
        value={seed}
        onChange={(e) => setSeed(e.target.value)}
      />

      {/* Submit Button */}
      <Button type="submit">Generate</Button>
    </form>
  );
};

export default AICreationForm;
