// frontend/src/components/nft/AICreationForm.tsx

import React, { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import styles from "./AICreationForm.module.css";
import Input from "./common/Input";
import Select from "./common/Select";
import Button from "./common/Button";
import { generateArt } from '../utils/ai';
import { GenerateArtRequest } from "../utils/ai/types";

interface AICreationFormProps {
  onArtGenerated: (imageData: string, prompt: string) => void;
  error?: string;
}

const AICreationForm: React.FC<AICreationFormProps> = ({ onArtGenerated, error }) => {
  // States for form fields
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [seed, setSeed] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Options for style dropdown
  const styleOptions = [
    { value: 'realistic', label: 'Realistic' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'pixelArt', label: 'Pixel Art' },
  ];

  // Options for aspect ratio dropdown
  const aspectRatioOptions = [
    { value: '1:1', label: 'Square' },
    { value: '16:9', label: 'Landscape' },
    { value: '9:16', label: 'Portrait' },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    //setFormError(null); // Clear previous errors

    const request: GenerateArtRequest = {
      prompt,
      style,
      aspectRatio,
      seed: seed ? parseInt(seed, 10) : undefined, // Parse seed if provided
    };

    try {
      const generatedImage = await generateArt(request); // Call the AI generation function
      onArtGenerated(generatedImage, prompt); // Notify the parent component
    } catch (err) {
      console.error("Error generating art:", err);
      toast.error("Failed to generate art. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state after completion or error
    }
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
        error={error} 
      />

      {/* Aspect Ratio Selection */}
      <Select
        id="aspectRatio"
        label="Aspect Ratio"
        options={aspectRatioOptions}
        value={aspectRatio}
        onChange={(e) => setAspectRatio(e.target.value)}
        error={error} 
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
      <Button type="submit" isLoading={isLoading} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Art"}
      </Button>
    </form>
  );
};

export default AICreationForm;
