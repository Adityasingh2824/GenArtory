// frontend/src/pages/Create.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Create.module.css';
import AICreationForm from '../components/nft/AICreationForm';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { mintNFT } from '../utils/aptos/nft';
import { toast } from 'react-hot-toast';
import { NFT } from '../types';
import { getUserCollections, validateRoyaltyPercentage } from '@/utils/aptos';

const Create: React.FC = () => {
  const navigate = useNavigate();
  const { account } = useWallet();

  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [collectionName, setCollectionName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [royaltyPercentage, setRoyaltyPercentage] = useState(10);

  useEffect(() => {
    const fetchCollections = async () => {
      if (account?.address) {
        try {
          const userCollections = await getUserCollections(account.address);
          setCollections(userCollections);
          setSelectedCollection(userCollections[0]?.name || "");
        } catch (error) {
          console.error('Error fetching collections:', error);
        } 
      }
    };

    fetchCollections();
  }, [account?.address]); // Re-fetch collections when the account changes

  const handleArtGenerated = (imageDataArray: string[], prompt: string) => {
    setGeneratedImages(imageDataArray);
    setPrompt(prompt);
    setMintSuccess(false);
    setError(null); // Clear any previous errors
  };

  const handleMint = async () => {
    if (!account?.address || generatedImages.length === 0) {
      toast.error("Please connect your wallet and generate at least one image first.");
      return;
    }

    const validRoyalty = validateRoyaltyPercentage(royaltyPercentage);
    if(validRoyalty) {
      toast.error(validRoyalty);
      return;
    }
    setIsLoading(true);

    try {
      const collectionDetails = await getCollectionDetails(selectedCollection);
      const nftIds = await mintNFT(
        account.address, 
        generatedImages, 
        prompt, 
        selectedCollection, 
        royaltyPercentage, 
        collectionDetails?.uri, 
        collectionDetails?.description
      );
      
      if (nftIds && nftIds.length > 0) {
        toast.success("NFT(s) minted successfully!");
        navigate("/explore"); // Navigate back to marketplace after successful mint
      } else {
        throw new Error("Minting failed");
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
      setError("An error occurred while minting the NFT. Please try again.");
      toast.error(error?.message || "Failed to mint NFT");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create Your AI-Powered NFT</h1>
      <AICreationForm onArtGenerated={handleArtGenerated} error={error} collections={collections} />

      {/* Image Preview Section */}
      {generatedImages?.length > 0 && (
        <div className={styles.previewContainer}>
          <h2 className={styles.previewTitle}>Preview</h2>
          <div className={styles.nftGrid}>
            {generatedImages.map((image: string, index: number) => (
              <img src={image} alt={prompt} key={index} className={styles.previewImage} />
            ))}
          </div>
          {/* Select Collection & Royalty */}
          <div className={styles.select}>
            <label htmlFor="collection">Select Collection:</label>
            <select
              id="collection"
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
            >
              {collections.map((collection) => (
                <option key={collection.name} value={collection.name}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.royaltyPercentage}>
            <Input
              type="number"
              id="royaltyPercentage"
              label="Royalty Percentage"
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
          </div>

          <Button onClick={handleMint} isLoading={isLoading} disabled={isLoading || minting}>
            {minting ? 'Minting...' : 'Mint NFT'}
          </Button>

        </div>
      )}
    </div>
  );
};

export default Create;
