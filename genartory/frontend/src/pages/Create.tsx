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
 import {AIImageprops } from '../utils/ai';
//please import Input and Button components from the common folder
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import {  AccountInfo, useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network, queryIndexer,Account ,mintTokenTransaction } from "@aptos-labs/ts-sdk";
import { checkIfFund, uploadFile } from "../utils/web3/";
import { isAscii } from 'buffer';
import { NODE_URL, MODULE_ADDRESS } from "../utils/constants";
import Spline from '@splinetool/react-spline';
const Create: React.FC = () => {
  
  
    
     
  const config = new AptosConfig({ network: Network.TESTNET });
  let myclient=new Aptos(config);

  const navigate = useNavigate();
  const aptosWallet = useWallet();
  const { account,signAndSubmitTransaction} = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImage] = useState<AIImageprops[]>([]);
  const [myMintedImage, setMyMintedImage] = useState('');
  const [prompt, setPrompt] = useState('');
  const [collectionName, setCollectionName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [royaltyPercentage, setRoyaltyPercentage] = useState(10);
  const [buttonText, setButtonText] = useState('Mint NFT');

  const notifToast = (mytext:string) => toast(mytext);

  useEffect(() => {
    const fetchCollections = async () => {
     
      if (account?.address) {
        try {
          const datafetched = await lgetinfos(account);
          const userCollections = datafetched;
          setCollections(userCollections.current_collections_v2);
          setSelectedCollection(userCollections.current_collections_v2[0]?.collection_name);
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






  const lcreateNFT = async (
    account: AccountInfo ,
    collectionName: string,
    uri: string,
    name: string,
    description: string,
    royalty: number,
    
  ) => {
      if (!account) {
        throw new Error('Please connect your wallet first');
      }
   
        const response = await signAndSubmitTransaction({
          sender: account,
          data: {
            function:`${MODULE_ADDRESS}::nft2::mint_token`,
            typeArguments: [],
            functionArguments:  [collectionName,description,name,royalty, uri],
          }
        });
        let myresult = await myclient.waitForTransaction({ transactionHash: response.hash });
       return response.hash;
    }
  const handleArtGenerated = (imageData: AIImageprops, prompt: string) => {
    setGeneratedImage(imageData);
    setPrompt(prompt);
    setError(null); // Clear any previous errors
  };

  const handleMint = async () => {

    if (collections.length  == 0) {
      notifToast("Please create a collection first.");
      setTimeout(() => {
        navigate("/my-collections");        
      }, 3000);
      return;
    }

    if (!account?.address || generatedImages.length === 0) {
       notifToast("Please connect your wallet and generate at least one image first.");
      return;
    }

    
    setButtonText('Minting...');

    const validRoyalty = validateRoyaltyPercentage(royaltyPercentage);
    if(validRoyalty) {
      toast.error(validRoyalty);
      return;
    }
    setIsLoading(true);

    try {
      let myres = checkIfFund(aptosWallet, generatedImages);
      notifToast("Uploading images to Irys...");
      let tt:File=new File([generatedImages.blob], "image.jpeg", {
        type: "image/jpeg",
        lastModified: new Date(),
        size: 2,
      });
      const myres2 = await uploadFile(aptosWallet, tt);
      setMyMintedImage(myres2);
      console.log('handleMint',myres2);
      notifToast(myres2);
      notifToast("Images uploaded to Irys successfully");
      const aname = prompt;
      const nftIds = await lcreateNFT(
         account, 
         selectedCollection, 
         myres2,
        aname,
        prompt, 
        royaltyPercentage 
      );
      
      if (nftIds && nftIds.length > 0) {
        toast.success("NFT(s) minted successfully!");
        setButtonText('Mint NFT');

        //navigate("/explore"); // Navigate back to marketplace after successful mint
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

      {generatedImages && (
        <div className={styles.previewContainer}>
          <h2 className={styles.previewTitle}>Preview</h2>
          <div className={styles.nftGrid}>
            <img src={generatedImages.url} alt={prompt} key={0} className={styles.previewImage} />
            
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
                  <option key={collection.collection_name} value={collection.collection_name}>
                    {collection.collection_name}
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
            {buttonText}
          </Button>

        </div> 
      )
      }

    </div>
  );
};

export default Create;
