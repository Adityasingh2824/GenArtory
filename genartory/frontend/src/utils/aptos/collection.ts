// frontend/src/utils/aptos/collection.ts
import { AptosClient, Types } from "aptos";
import { NODE_URL, MODULE_ADDRESS } from "../constants";
import { getConnectedWallet } from "./wallet";
import { toast } from "react-hot-toast";


const client = new AptosClient(NODE_URL);

// Function to create a new collection
export async function createCollection(
  account: any | null,
  collectionName: string,
  uri: string,
  description: string
): Promise<Types.HexEncodedBytes | null> {
  if (!account) {
    throw new Error('Please connect your wallet first');
  }

  try {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::nft::create_collection`,
      type_arguments: [],
      arguments: [collectionName, uri, description],
    };

    const txnRequest = await client.generateTransaction(account.address, payload);
    const signedTxn = await account.signAndSubmitTransaction(txnRequest);
    await client.waitForTransaction(signedTxn.hash);
    toast.success("Collection created successfully!");
    return signedTxn.hash;
  } catch (error: any) {
    toast.error(error?.message || "Failed to create collection.");
    return null;
  }
}

// Function to get details of a collection
export async function getCollectionDetails(collectionName: string): Promise<any | null> {
  try {
    const resources = await client.getAccountResources(MODULE_ADDRESS);
    const collectionResource = resources.find(
      (r) => r.type === `${MODULE_ADDRESS}::token::Collections<${MODULE_ADDRESS}::nft::NFT>` && 
             r.data.collections.find(collection => collection.name === collectionName)
    );
    return collectionResource?.data.collections.find(collection => collection.name === collectionName);
  } catch (error) {
    console.error("Error fetching collection details:", error);
    return null;
  }
}

// Function to get all collections created by a user
export async function getUserCollections(creatorAddress: string): Promise<any[]> {
  try {
    const resources = await client.getAccountResources(creatorAddress);
    const collectionsResource = resources.find(
      (r) =>
        r.type ===
        `${MODULE_ADDRESS}::token::Collections<${MODULE_ADDRESS}::nft::NFT>`
    );

    if (collectionsResource) {
      return collectionsResource.data.collections.filter(
        (collection) => collection.creator === creatorAddress
      );
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching user collections:", error);
    return [];
  }
}
//add a mintnft funtion please
// Function to mint an NFT
export async function mintNFT(
  account: any | null,
  collectionName: string,
  metadataURI: string
): Promise<Types.HexEncodedBytes | null> {
  if (!account) {
    throw new Error('Please connect your wallet first');
  }

  try {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::nft::mint_nft`,
      type_arguments: [],
      arguments: [collectionName, metadataURI],
    };

    const txnRequest = await client.generateTransaction(account.address, payload);
    const signedTxn = await account.signAndSubmitTransaction(txnRequest);
    await client.waitForTransaction(signedTxn.hash);
    toast.success("NFT minted successfully!");
    return signedTxn.hash;
  } catch (error: any) {
    toast.error(error?.message || "Failed to mint NFT.");
    return null;
  }
}

// Function to get recent activities
export async function getRecentActivities(): Promise<any[]> {
  try {
    const activities = await client.getRecentTransactions();
    return activities;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
}