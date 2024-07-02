// frontend/src/utils/aptos/nft.ts

import { AptosClient, Types, CoinClient } from "aptos";
import { NODE_URL, MODULE_ADDRESS } from "../constants";
import { getConnectedWallet, signAndSubmitTransaction } from "../web3";
import { toast } from "react-hot-toast";
import { NFT } from "./types"; // Assuming you have defined a TypeScript type for NFTs


const client = new AptosClient(NODE_URL);
const coinClient = new CoinClient(client);

export async function mintNFT(
  creatorAddress: string,
  imageDataArray: string[], 
  prompt: string
): Promise<NFT[] | null> {
  const account = getConnectedWallet();
  if (!account) throw new Error("Please connect your wallet first");

  try {
    const collectionName = "GenArt"; 
    const royaltyPercentage = 10; // Replace with your desired royalty percentage
    const namePrefix = "GenArtNFT_";
    let index = 1;

    // Create a transaction payload for each image
    const txns = imageDataArray.map((imageData) => {
      const payload: Types.TransactionPayload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::nft::mint_nft`,
        type_arguments: [],
        arguments: [collectionName, imageData, `${namePrefix}${index++}`, royaltyPercentage.toString()],
      };

      return client.generateTransaction(account.address, payload);
    });

    // Sign and submit transactions in parallel
    const signedTxns = await account.signTransaction(txns);

    const nftPromises = signedTxns.map(async (signedTxn) => {
        const response = await client.submitTransaction(signedTxn);
        await client.waitForTransaction(response.hash);
        return getNFTDetails(creatorAddress, response.hash)
    });
    const mintedNFTs = await Promise.all(nftPromises)
      .then(values => values.filter(nft => nft !== null))
      .catch((error) => {
        console.error("Error fetching minted NFT details:", error);
        return null;
      });


    if (mintedNFTs && mintedNFTs.length === imageDataArray.length) {
      toast.success(`${imageDataArray.length} NFT${imageDataArray.length > 1 ? 's' : ''} minted successfully!`);
      return mintedNFTs as NFT[];
    } else {
      throw new Error('Minting failed for some NFTs');
    }
  } catch (error: any) {
    console.error("Error minting NFTs:", error);
    toast.error(error?.message || "Failed to mint NFTs.");
    return null;
  }
}

// ...getNFTDetails...


