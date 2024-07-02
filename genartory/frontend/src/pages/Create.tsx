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
import { GenerateArtRequest } from '../utils/ai/types';


const Create: React.FC = () => {
  const navigate = useNavigate();
  const { account } = useWallet();

  // Combined useState for better readability
  const [nftCreationState, setNFTCreationState] = useState<{
    isLoading: boolean;
    generatedImages: string[] | null; // Array to store multiple generated images
    mintSuccess: boolean;
    prompt: string;
    error: string | null;
  }>({
    isLoading: false,
    generatedImages: null, // Initialize as null
    mintSuccess: false,
    prompt: '',
    error: null,
  });

  // Destructure state for easier use
  const { isLoading, generatedImages, mintSuccess, prompt, error } = nftCreationState;

  const handleArtGenerated = (imageDataArray: string[], prompt: string) => {
    setNFTCreationState({
      ...nftCreationState,
      generatedImages: imageDataArray,
      prompt,
      mintSuccess: false,
      error: null,
    });
  };
  const handleMint = async () => {
    if (!account?.address || !generatedImages || !prompt) {
      toast.error("Please connect your wallet and generate an image first.");
      return;
    }
    setIsLoading(true);

    try {
      const nftId = await mintNFT(account.address, generatedImages, prompt);
      if (nftId) {
        setNFTCreationState({
          ...nftCreationState,
          mintSuccess: true,
          isLoading: false,
        });
        toast.success("NFT minted successfully!");
      } else {
        throw new Error("Minting failed");
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
      setNFTCreationState({
        ...nftCreationState,
        error: "An error occurred while minting the NFT. Please try again.",
        isLoading: false,
      });
      toast.error(error?.message || "Failed to mint NFT");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create Your AI-Powered NFT</h1>
      <AICreationForm onArtGenerated={handleArtGenerated} error={error} />
      {/* Image Preview Section */}
      {generatedImages && (
        <div className={styles.previewContainer}>
          <h2 className={styles.previewTitle}>Preview</h2>
          {/* Display all generated images */}
          {generatedImages.map((image: string, index: number) => (
            <img src={image} alt={prompt} key={index} className={styles.previewImage} />
          ))}
          {!mintSuccess && (
            <Button onClick={handleMint} isLoading={isLoading} disabled={isLoading || minting}>
              Mint NFT
            </Button>
          )}

          {mintSuccess && mintedNft && (
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
