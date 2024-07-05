// frontend/src/pages/Create.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Create.module.css';
import AICreationForm from '../components/AICreationForm';

import { mintNFT } from '../utils/aptos/nft';
import toast, { Toaster } from 'react-hot-toast';

import { NFT } from '../types';
import { getUserCollections } from '../utils/aptos';
import { validateRoyaltyPercentage } from '../utils/validation';
 
//please import Input and Button components from the common folder
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network, queryIndexer } from "@aptos-labs/ts-sdk";

import { checkIfFund, uploadFolder } from "../utils/web3/";

import { isAscii } from 'buffer';



const Create: React.FC = () => {

  const config = new AptosConfig({ network: Network.TESTNET });
  let myclient=new Aptos(config);

  const navigate = useNavigate();
  const aptosWallet = useWallet();
  const { account} = useWallet();
  
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState('');
  const [collectionName, setCollectionName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [royaltyPercentage, setRoyaltyPercentage] = useState(10);

  const notifToast = (mytext:string) => toast(mytext);

  useEffect(() => {
    const fetchCollections = async () => {
      if (account?.address) {
        try {
         // const userCollections = await getUserCollections(account.address);
          const datafetched = await lgetinfos(account);
          const userCollections = datafetched;
          //console.log(userCollections);
          setCollections(userCollections.current_collections_v2);
          setSelectedCollection(userCollections[0]?.description || "hhhhh");
        } catch (error) {
          console.error('Error fetching collections:', error);
        } 
      }
    };

    fetchCollections();
  }, [account?.address]); // Re-fetch collections when the account changes



const lgetinfos = async (account: any ) => {
    
  const objects = await myclient.queryIndexer({
      query: {
        query: `
          query MyQuery($ownerAddress: String)  {
  current_collections_v2(
    where: {creator_address: {_eq:  $ownerAddress}}
  ) {
    creator_address
    collection_name
    collection_id
    current_supply
    description
    uri
    total_minted_v2
    token_standard
    table_handle_v1
    mutable_uri
    mutable_description
    max_supply
    last_transaction_version
    last_transaction_timestamp
  }
}
          `,
        variables: { ownerAddress: account.address },
      },
    });
    return objects;
  };












  const handleArtGenerated = (imageDataArray: string[], prompt: string) => {
    console.log('imageDataArray', imageDataArray);
    setGeneratedImages(imageDataArray);
    setPrompt(prompt);
   // setMintSuccess(false);
    setError(null); // Clear any previous errors
  };

  const handleMint = async () => {
     
    if (!account?.address || generatedImages.length === 0) {
       notifToast("Please connect your wallet and generate at least one image first.");
      return;
    }


 
     

    const validRoyalty = validateRoyaltyPercentage(royaltyPercentage);
    if(validRoyalty) {
      toast.error(validRoyalty);
      return;
    }
    setIsLoading(true);

    try {

let myarrayFile:File = [];
    ///add generatedImages to myarrayFile
      myarrayFile.push(generatedImages);
   


        let myres = checkIfFund(aptosWallet, myarrayFile);
      console.log('myres', myres);
  
    


     // console.log('myres', myres);
      
      notifToast("Uploading images to Irys...");
      
      // const collectionDetails = await getCollectionDetails(selectedCollection);
      // const nftIds = await mintNFT(
      //   account.address, 
      //   generatedImages, 
      //   prompt, 
      //   selectedCollection, 
      //   royaltyPercentage, 
      //   collectionDetails?.uri, 
      //   collectionDetails?.description
      // );
      
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
      <Toaster />
      <h1>Create Your AI-Powered NFT</h1>
      <AICreationForm onArtGenerated={handleArtGenerated} error={error} collections={collections} />
      
      {/* Image Preview Section */}
      
      {generatedImages && (
        <div className={styles.previewContainer}>
          <h2 className={styles.previewTitle}>Preview</h2>
          <div className={styles.nftGrid}>
            <img src={generatedImages.imageUrl} alt={prompt} key={0} className={styles.previewImage} />
            <h4>{prompt}</h4>
            {/*{generatedImages.map((imageUrl: string, index: number) => 
                <img src={imageUrl} alt={prompt} key={index} className={styles.previewImage} />
             
            )}*/}
          </div>
      
          <div className={styles.select}>
            <label htmlFor="collection">Select Collection:</label>
            <select
              id="collection"
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
            >
              {collections.map((collection) => (
                <option key={collection.description} value={collection.description}>
                  {collection.description}
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
      )
      }

    </div>
  );
};

export default Create;
