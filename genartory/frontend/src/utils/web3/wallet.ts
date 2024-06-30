// frontend/src/utils/web3/wallet.ts
import { useWallet, Wallet } from "@aptos-labs/wallet-adapter-react";

export function useConnectedWallet(): Wallet | null {
    const { account } = useWallet();
    return account;
}

export async function connectWallet() {
  const { connect } = useWallet();
  if (!connect) {
    throw new Error('No wallet adapter found');
  }
  try {
    await connect(); // This will prompt the user to connect their wallet
  } catch (error) {
    console.error('Error connecting wallet:', error);
    // Handle error, e.g., show an error notification
  }
}

export async function disconnectWallet() {
  const { disconnect } = useWallet();
  if (!disconnect) {
    throw new Error('No wallet adapter found');
  }
  try {
    await disconnect(); 
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    // Handle error, e.g., show an error notification
  }
}

