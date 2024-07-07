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
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network, queryIndexer } from "@aptos-labs/ts-sdk";
import { checkIfFund, uploadFile } from "../utils/web3/";
import { isAscii } from 'buffer';
import { NODE_URL, MODULE_ADDRESS } from "../utils/constants";

const Create: React.FC = () => {

  const config = new AptosConfig({ network: Network.TESTNET });
  let myclient=new Aptos(config);

  const navigate = useNavigate();
  const aptosWallet = useWallet();
  const { account,signAndSubmitTransaction} = useWallet();
  
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImage] = useState<AIImageprops[]>([]);
  const [myMintedImage, setMyMintedImage] = useState('');
  
  //const [generatedBlobs, setGeneratedBlobs] = useState<blob[]>([]);
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






  const lcreateNFT = async (
    account: any | null,
    collectionName: string,
    uri: string,
    name: string,
    royalty: number,
    
  ) => {
      if (!account) {
        throw new Error('Please connect your wallet first');
      }
      try {

        const response = await signAndSubmitTransaction({
          sender: account,
          data: {
            function:`${MODULE_ADDRESS}::nft::mint_nft`,
            typeArguments: [],
            functionArguments:  [collectionName, uri, name, royalty],
          }
        });
        let myresult = await myclient.waitForTransaction({ transactionHash: response.hash });
       return response.hash;
      } catch (error: any) {
         toast.error(error?.message || "Failed to create collection.");
        //return null;
      }
    }








  const handleArtGenerated = (imageData: AIImageprops, prompt: string) => {
    console.log('here it is',imageData);
    
    //const imageUrl =  URL.createObjectURL(imageDataArray.blob); // Create a URL for the Blob
    
    setGeneratedImage(imageData);
    //setGeneratedBlobs(imageDataArray);
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
      //let myarrayFile:blob = [];
      //myarrayFile.push(generatedBlobs);

      console.log('myres checkgeneratedImageIfFund', generatedImages);
      let myres = checkIfFund(aptosWallet, generatedImages.blob);
      console.log('myres checkIfFund', myres);
     // console.log('myres', myres);
      
      notifToast("Uploading images to Irys...");
      
      //please upload my file myarrayFile[0] to Irys using  Irys.ts uploadFile file function

      //create a File from url
      //const myblob = new Blob([generatedImages[0]], { type: 'image/jpeg' });

     //let tt:File = new File(generatedBlobs, 'image.jpeg', { type: 'image/jpeg' });
let tt:File=new File([generatedImages.blob], "my_image.jpeg", {
  type: "image/jpeg",
  lastModified: new Date(),
  size: 2,
});
      const myres2 = await uploadFile(aptosWallet, tt);
      console.log('myres2', myres2);
setMyMintedImage(myres2);

    notifToast(myres2);

      notifToast("Images uploaded to Irys successfully");


    //  const collectionDetails = await getCollectionDetails(selectedCollection);
      
       const nftIds = await lcreateNFT(
         account.address, 
         selectedCollection, 
        myres2,
        prompt, 
        royaltyPercentage 
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
      <Toaster />
      <h1>Create Your AI-Powered NFT</h1>
   

      <AICreationForm onArtGenerated={handleArtGenerated} error={error} collections={collections} />
      {/* Image Preview Section */}
      {myMintedImage &&
        <img src={myMintedImage} alt="myMintedImage" className={styles.previewImage} />
      }

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
