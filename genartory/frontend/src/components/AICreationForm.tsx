// frontend/src/components/nft/AICreationForm.tsx
import React, { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import styles from './AICreationForm.module.css';
import Input from './common/Input';
import Select from './common/Select';
import Button from './common/Button';
import { generateArt,AIImageprops } from '../utils/ai';
import { GenerateArtRequest } from '../utils/ai/types';
import { DEFAULT_IMAGE_WIDTH, DEFAULT_IMAGE_HEIGHT } from '../utils/constants';


interface AICreationFormProps {
  onArtGenerated: (imageData: AIImageprops, prompt: string) => void;
  error?: string;
}

const AICreationForm: React.FC<AICreationFormProps> = ({ onArtGenerated, error }) => {
  
  const worldCapitals = [
  'Tokyo', 'London', 'Paris', 'Berlin', 'Ottawa',
  'Canberra', 'Washington D.C.', 'Kyiv', 'Beijing', 'New Delhi'
];

// Select a random capital
const randomCapital = worldCapitals[Math.floor(Math.random() * worldCapitals.length)];

// States for form fields
const [prompt, setPrompt] = useState(randomCapital);
  const [isLoading, setIsLoading] = useState(false);
  const [numOutputs, setNumOutputs] = useState(1);
  const [width, setWidth] = useState(DEFAULT_IMAGE_WIDTH);
  const [height, setHeight] = useState(DEFAULT_IMAGE_HEIGHT);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Show loading indicator while generating

    const request: GenerateArtRequest = {
      prompt,
      numOutputs,
      width,
      height
    };

    try {
      const generatedImages = await generateArt(request); // Get an array of generated images
      onArtGenerated(generatedImages, prompt); // Pass the first generated image and prompt to the parent
     
      // Optionally, show a gallery with all generated images
    } catch (err) {
      console.error('Error generating art:', err);
      toast.error('Failed to generate art. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}
      <Input
        type="text"
        id="prompt"
        label="Prompt"
        placeholder="Enter a description of the artwork you want to generate."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
       className={styles.inputfield}
        required
      />
   
   
      <Input
        type="number"
        id="width"
        label="Width"
        value={width}
        onChange={(e) => setWidth(parseInt(e.target.value))}
        min="256" // Minimum image width (adjust as needed)
        max="1024" // Maximum image width (adjust as needed)
        required
        className={styles.inputfield}
      />
      <Input
        type="number"
        id="height"
        label="Height"
        value={height}
        onChange={(e) => setHeight(parseInt(e.target.value))}
        min="256" // Minimum image height (adjust as needed)
        max="1024" // Maximum image height (adjust as needed)
        required
        className={styles.inputfield}
      />
      {/* ... you can add more input fields here for style, seed etc. ... */}
      <Button type="submit" isLoading={isLoading} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Art'}
      </Button>
    </form>
  );
};

export default AICreationForm;
