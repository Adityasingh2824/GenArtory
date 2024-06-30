// frontend/src/components/nft/NFTEditForm.tsx
import React, { useState, FormEvent } from 'react';
import styles from './NFTEditForm.module.css';
import Input from '../common/Input';
import Button from '../common/Button';
import { NFT } from '../../types'; // Make sure to define your NFT type
import { updateNFT } from '../../utils/aptos';

interface NFTEditFormProps {
  nft: NFT;
  onUpdateSuccess: () => void; // Callback for successful update
}

const NFTEditForm: React.FC<NFTEditFormProps> = ({ nft, onUpdateSuccess }) => {
  const [name, setName] = useState(nft.name);
  const [description, setDescription] = useState(nft.description || '');
  const [price, setPrice] = useState(nft.price ? nft.price.toString() : '');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateNFT(nft.id, name, description, price); 
      onUpdateSuccess(); // Notify the parent component of success
    } catch (error) {
      console.error('Error updating NFT:', error);
      setError('Failed to update NFT');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input type="text" id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input type="text" id="description" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input type="number" id="price" label="Price (GAC)" value={price} onChange={(e) => setPrice(e.target.value)} />
      {/* Add more input fields for other editable attributes as needed */}

      {error && <p className={styles.error}>{error}</p>}
      <Button type="submit" isLoading={isLoading} disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update NFT'}
      </Button>
    </form>
  );
};

export default NFTEditForm;
