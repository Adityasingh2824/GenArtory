// frontend/src/pages/Create.tsx
import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Create.module.css";
import AICreationForm from "../components/AICreationForm";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Button from "../components/common/Button";
import { toast } from "react-hot-toast";
import { mintNFT } from '../utils/aptos';
import { NFT } from '../types';
import { generateArt } from '../utils/ai';


const Create: React.FC = () => {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [mintedNft, setMintedNft] = useState<NFT | null>(null);

  const handleArtGenerated = async (imageData: string, prompt: string) => {
    setGeneratedImage(imageData);
    setPrompt(prompt);
  };

  const handleMint = async () => {
    if (!account?.address || !generatedImage || !prompt) {
      toast.error("Please connect your wallet, generate an image, and fill in the prompt.");
      return;
    }

    try {
      setMinting(true); // Set loading state for minting button
      const nftData = await mintNFT(account.address, generatedImage, prompt);
      if (nftData) {
        setMintedNft(nftData as NFT);
        toast.success("NFT minted successfully!");
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast.error('An error occurred while minting the NFT.');
    } finally {
      setMinting(false); // Reset loading state after minting
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create Your AI-Powered NFT</h1>
      <AICreationForm onArtGenerated={handleArtGenerated} error={formError} />

      {/* Image Preview Section */}
      {generatedImage && (
        <div className={styles.previewContainer}>
          <h2 className={styles.previewTitle}>Preview</h2>
          <img src={generatedImage} alt={prompt} className={styles.previewImage} />
          <Button onClick={handleMint} isLoading={minting} disabled={minting}>
            {minting ? "Minting..." : "Mint NFT"}
          </Button>
          {/* Optional: Display minted NFT details */}
          {mintedNft && (
            <div className={styles.mintedNft}>
              <h3>Your NFT has been minted!</h3>
              <p>Token ID: {mintedNft.id.name}</p>
              <Button onClick={() => navigate(`/nft/${mintedNft.creator_address}/${mintedNft.id.name}`)}>
                View Details
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Create;