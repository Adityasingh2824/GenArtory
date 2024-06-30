// frontend/src/utils/web3/index.ts

export * from './wallet';
export * from './transaction'; // If you have this file
export * from './types';

// Add specific functions for clarity (optional)
export { connectWallet, disconnectWallet, getConnectedWallet } from './wallet';
export { signAndSubmitTransaction } from './transaction';  // If you have this file
