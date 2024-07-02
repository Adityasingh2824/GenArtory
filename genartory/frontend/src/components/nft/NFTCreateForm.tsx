// frontend/src/components/nft/NFTCreateForm.tsx

import React, { useState, FormEvent } from "react";
import { toast } from "react-hot-toast";
import styles from "./NFTCreateForm.module.css";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import { generateArt } from '@/utils/ai';
import { GenerateArtRequest } from "@/utils/ai/types";

interface AICreationFormProps {
  onArtGenerated: (imageDataArray: string[], prompt: string, collection: string, royaltyPercentage: number) => void;
  isLoading: boolean;
  collections: any[];
}

const NFTCreationForm: React.FC<AICreationFormProps> = ({ onArtGenerated, isLoading, collections }) => {
  // States for form fields
  const [formData, setFormData] = useState<GenerateArtRequest>({
    prompt: '',
    numOutputs: 1, // Generate one image at a time (can be adjusted)
    width: 512,
    height: 512,
  });

  const [formErrors, setFormErrors] = useState<Partial<GenerateArtRequest>>({});

  const [selectedCollection, setSelectedCollection] = useState('');
  const [royaltyPercentage, setRoyaltyPercentage] = useState(10);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Immediate validation
    if (name === 'prompt') {
      setFormErrors({ ...formErrors, prompt: validatePrompt(value) });
    } else if (name === 'royaltyPercentage') {
      setFormErrors({ ...formErrors, royaltyPercentage: validateRoyaltyPercentage(parseFloat(value)) });
    }
  };

  const handleCollectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCollection(event.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Final validation before submission
    const errors: Partial<GenerateArtRequest> = {};
    if (validatePrompt(formData.prompt)) {
      errors.prompt = validatePrompt(formData.prompt);
    }
    if (validateRoyaltyPercentage(royaltyPercentage)) {
      errors.royaltyPercentage = validateRoyaltyPercentage(royaltyPercentage);
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const generatedImages = await generateArt(formData);
      onArtGenerated(generatedImages, formData.prompt, selectedCollection, royaltyPercentage);
    } catch (err) {
      console.error("Error generating art:", err);
      toast.error("Failed to generate art. Please try again.");
    } finally {
      setIsLoading(false);
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
        name="prompt"  // Name for form data
        value={formData.prompt}
        onChange={handleChange}
        error={formErrors.prompt} // Display error if it exists
      />

      {/* Collection Dropdown */}
      <Select
        id="collection"
        label="Collection"
        options={collections.map((collection) => ({
          value: collection.name,
          label: collection.name,
        }))}
        value={selectedCollection}
        onChange={handleCollectionChange}
      />

      {/* Royalty Percentage Input */}
      <Input
        type="number"
        id="royaltyPercentage"
        label="Royalty Percentage"
        name="royaltyPercentage"
        value={royaltyPercentage}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          if (!isNaN(value) && value >= 0 && value <= 100) { // Validate input
            setRoyaltyPercentage(value);
          } else {
            toast.error("Royalty percentage must be between 0 and 100"); // Show a toast message if invalid
          }
        }}
      />
      {/* Number of Images Input */}
      <Input
        type="number"
        id="numOutputs"
        label="Number of Images"
        name="numOutputs"
        value={formData.numOutputs}
        onChange={handleChange}
        min="1"
      />
      {/* Width Input */}
      <Input
        type="number"
        id="width"
        label="Width"
        name="width"
        value={formData.width}
        onChange={handleChange}
        min="256" // Minimum image width
        max="1024" // Maximum image width
        required
      />
      {/* Height Input */}
      <Input
        type="number"
        id="height"
        label="Height"
        name="height"
        value={formData.height}
        onChange={handleChange}
        min="256" // Minimum image height
        max="1024" // Maximum image height
        required
      />

      {/* Submit Button */}
      <Button type="submit" isLoading={isLoading} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Art'}
      </Button>
    </form>
  );
};

export default NFTCreationForm;
