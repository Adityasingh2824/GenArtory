// frontend/src/components/nft/NFTCreateForm.tsx
import React, { useState, FormEvent } from 'react';
import styles from './NFTCreateForm.module.css';
import Input from '../common/Input';
import Button from '../common/Button';
import { validatePrompt, validateRoyaltyPercentage, validatePrice } from '@/utils/validation';


interface NFTCreateFormProps {
  onSubmit: (formData: FormData) => void;
  error?: string;
}

const NFTCreateForm: React.FC<NFTCreateFormProps> = ({ onSubmit, error }) => {
  const [prompt, setPrompt] = useState('');
  const [collection, setCollection] = useState(''); // Or select options from existing collections
  const [royaltyPercentage, setRoyaltyPercentage] = useState('10'); // Default royalty percentage
  // Add more state variables for other parameters (e.g., style, resolution, etc.)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData); // Pass the form data to the parent component
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}

      <Input 
        type="text" 
        id="prompt" 
        label="Prompt" 
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)} 
        required 
      />

      <Input 
        type="text" 
        id="collection" 
        label="Collection" 
        value={collection} 
        onChange={(e) => setCollection(e.target.value)} 
        required 
      />

      <Input
        type="number"
        id="royaltyPercentage"
        label="Royalty Percentage"
        value={royaltyPercentage}
        onChange={(e) => setRoyaltyPercentage(e.target.value)}
        min="0"
        max="100"
        required

      />
      const errors: Record<string, string> = {};
        if (validatePrompt(prompt)) {
    errors.prompt = validatePrompt(prompt);
    }
    if (validateRoyaltyPercentage(royaltyPercentage)) {
    errors.royaltyPercentage = validateRoyaltyPercentage(royaltyPercentage);
    }

      {/* Add more input fields for other parameters as needed */}
      <Button type="submit">Generate Art</Button>
    </form>
  );
};

export default NFTCreateForm;
