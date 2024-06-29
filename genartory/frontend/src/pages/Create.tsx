// frontend/src/pages/Create.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Create.module.css';
import AICreationForm from '../components/AICreationForm'; 
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { mintNFT } from '../utils/aptos';
import Select from '../components/common/Select';

const Create: React.FC = () => {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedArtStyle, setSelectedArtStyle] = useState('realistic');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null); // Clear previous errors

    try {
      const formData = new FormData(e.currentTarget);
      const prompt = formData.get('prompt') as string;

      // 2. Call AI model to generate image (replace with your actual API call)
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style: selectedArtStyle }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const { imageData } = await response.json();
      setGeneratedImage(imageData);

      // ... rest of the logic (preview, mint, redirect)
    } catch (error) {
      console.error('Error minting NFT:', error);
      setFormError('An error occurred while minting the NFT.'); // Show specific error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create Your AI-Powered NFT</h1>

      <form onSubmit={handleSubmit}>
        <Select
          id="artStyle"
          label="Art Style"
          options={[
            { value: 'realistic', label: 'Realistic' },
            { value: 'abstract', label: 'Abstract' },
            { value: 'pixelArt', label: 'Pixel Art' },
          ]}
          value={selectedArtStyle}
          onChange={(e) => setSelectedArtStyle(e.target.value)}
        />
        <AICreationForm error={formError} /> {/* Pass formError to AICreationForm */}
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create NFT'}
        </Button>
      </form>

       {/* Image Preview and Additional Actions */}
    {generatedImage && (
      <div className={styles.previewContainer}>
        <h2 className={styles.previewTitle}>Preview</h2>
        <img 
          src={generatedImage} 
          alt="Generated NFT" 
          className={styles.previewImage} 
        />

        {/* Additional Actions (Edit, Mint, etc.) */}
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => setGeneratedImage(null)}>
            Regenerate
          </Button>
          <Button variant="primary" onClick={() => /* Mint NFT logic */}>
            Mint NFT
          </Button>
        </div>
      </div>
    )}
  </div>
);
};

export default Create;