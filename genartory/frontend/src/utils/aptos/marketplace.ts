// frontend/src/utils/aptos/marketplace.ts
import { AptosClient, Types, CoinClient } from "aptos";
import { NODE_URL, MODULE_ADDRESS } from "../constants";
import { toast } from "react-hot-toast";
//import { getConnectedWallet } from "./wallet";
import { useWallet } from "@aptos-labs/wallet-adapter-react";


const client = new AptosClient(NODE_URL);
const coinClient = new CoinClient(client);


  
// Function to fetch all listings from the marketplace
export async function getAllListings(): Promise<Listing[]> {
  try {
    const resources = await client.getAccountResources(MODULE_ADDRESS);
    const listingsResource = resources.find(
      (r) => r.type === `${MODULE_ADDRESS}::marketplace::Marketplace`
    );
    if (!listingsResource) {
      return [];
    }

    return Object.keys(listingsResource.data.listings).map(key => {
      const tokenId = JSON.parse(key);
      return {
        token_id: tokenId,
        ...listingsResource.data.listings[key],
      };
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error; // Re-throw error for handling in the component
  }
}

// Function to list an NFT for sale
export async function listNFT(
  account: any | null,
  tokenId: Types.TokenId,
  price: number
): Promise<Types.HexEncodedBytes | null> {
  if (!account) throw new Error("Please connect your wallet first");
  try {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::marketplace::list_nft`,
      type_arguments: [],
      arguments: [tokenId, price.toString()],
    };

    const txnRequest = await client.generateTransaction(account.address, payload);
    const signedTxn = await account.signAndSubmitTransaction(txnRequest);
    await client.waitForTransaction(signedTxn.hash);
    toast.success("NFT listed successfully!");
    return signedTxn.hash;
  } catch (error: any) {
    toast.error(error?.message || "Failed to list NFT.");
    return null;
  }
}

// Function to buy an NFT
export async function buyNFT(
  account: any | null,
  tokenId: Types.TokenId
): Promise<Types.HexEncodedBytes | null> {
  if (!account) throw new Error("Please connect your wallet first");
  try {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::marketplace::buy_nft`,
      type_arguments: [],
      arguments: [tokenId],
    };

    const txnRequest = await client.generateTransaction(account.address, payload);
    const signedTxn = await account.signAndSubmitTransaction(txnRequest);
    await client.waitForTransaction(signedTxn.hash);
    toast.success("NFT bought successfully!");
    return signedTxn.hash;
  } catch (error: any) {
    toast.error(error?.message || "Failed to buy NFT.");
    return null;
  }
}

// Function to cancel an NFT listing
export async function cancelListing(account: any | null, tokenId: Types.TokenId): Promise<Types.HexEncodedBytes | null> {
  if (!account) throw new Error("Please connect your wallet first");
  try {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::marketplace::cancel_listing`,
      type_arguments: [],
      arguments: [tokenId],
    };

    const txnRequest = await client.generateTransaction(account.address, payload);
    const signedTxn = await account.signAndSubmitTransaction(txnRequest);
    await client.waitForTransaction(signedTxn.hash);
    toast.success("Listing cancelled successfully!");
    return signedTxn.hash;
  } catch (error: any) {
    toast.error(error?.message || "Failed to cancel listing.");
    return null;
  }
}

// ... (other marketplace functions like placeBid, updateListing can be added here)
// Function to place a bid on an NFT
export async function placeBid(account: any | null, tokenId: Types.TokenId, bidAmount: number): Promise<Types.HexEncodedBytes | null> {
    if (!account) throw new Error("Please connect your wallet first");
  try {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::marketplace::place_bid`,
      type_arguments: [],
      arguments: [tokenId, bidAmount.toString()],
    };

    const txnRequest = await client.generateTransaction(account.address, payload);
    const signedTxn = await account.signAndSubmitTransaction(txnRequest);
    await client.waitForTransaction(signedTxn.hash);
    toast.success("Bid placed successfully!");
    return signedTxn.hash;
  } catch (error: any) {
    toast.error(error?.message || "Failed to place bid.");
    return null;
  }
}

// Function to update the listing price of an NFT
export async function updateListing(account: any | null, tokenId: Types.TokenId, newPrice: number): Promise<Types.HexEncodedBytes | null> {
    if (!account) throw new Error("Please connect your wallet first");
  try {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::marketplace::update_listing`,
      type_arguments: [],
      arguments: [tokenId, newPrice.toString()],
    };
    
    const txnRequest = await client.generateTransaction(account.address, payload);
    const signedTxn = await account.signAndSubmitTransaction(txnRequest);
    await client.waitForTransaction(signedTxn.hash);
    toast.success("Listing updated successfully!");
    return signedTxn.hash;
  } catch (error: any) {
    toast.error(error?.message || "Failed to update listing.");
    return null;
  }
}

// Function to get details of an NFT
export async function getNFTDetails(tokenId: Types.TokenId): Promise<Types.NFTDetails | null> {
  try {
    const nftDetails: Types.NFTDetails = await client.call({
      function: `${MODULE_ADDRESS}::marketplace::get_nft_details`,
      type_arguments: [],
      arguments: [tokenId],
    });

    return nftDetails;
  } catch (error: any) {
    toast.error(error?.message || "Failed to fetch NFT details.");
    return null;
  }
}