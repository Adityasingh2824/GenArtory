// frontend/src/utils/aptos/account.ts

import { AptosClient, AptosAccount, Types, TokenClient } from "aptos";
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { NODE_URL, MODULE_ADDRESS } from "../constants";

const client = new AptosClient(NODE_URL);
const tokenClient = new TokenClient(client); // for token related functions

export function useAptosAccount() {
  const { account } = useWallet(); // Get connected account from Aptos Wallet Adapter
  return account;
}

// Function to get the account balance
export async function getAccountBalance(accountAddress: string): Promise<number | null> {
  try {
    const resources = await client.getAccountResources(accountAddress);
    const accountResource = resources.find((r) => r.type === `${MODULE_ADDRESS}::coin::CoinStore<${MODULE_ADDRESS}::token::Token>`);
    return accountResource?.data?.coin?.value;
  } catch (error) {
    console.error("Error fetching account balance:", error);
    return null;
  }
}

// Function to get a list of NFTs owned by an address
export async function getNFTsOwnedByAddress(address: string): Promise<any[]> {
  try {
    const nfts = await tokenClient.getTokens(address);
    return nfts;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
}

// Function to get the profile of an address
export async function getProfileDetails(address: string): Promise<any> {
  // Implement your logic to fetch profile details from your smart contract or backend
  // For example, you could query a table in your contract that stores profile information

  try {
    // Example query to your smart contract
    const profileResource = await client.getAccountResource(address, `${MODULE_ADDRESS}::profile::Profile`);

    if (profileResource) {
      return profileResource.data;
    } else {
      return null; // Or return a default profile object if the user doesn't have one
    }
  } catch (error) {
    console.error("Error fetching profile details:", error);
    return null;
  }
}
