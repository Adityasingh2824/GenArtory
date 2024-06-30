// frontend/src/utils/web3/types.ts

import { Types } from 'aptos';

// Interface representing a connected wallet
export interface Wallet {
  name: string;
  adapter: string;
  readyState: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<Types.HexEncodedBytes>;
  signTransaction(
    transaction: Types.TransactionPayload
  ): Promise<Uint8Array>;
  signMessage(message: string): Promise<Uint8Array>;
  account(): Promise<Types.AccountData | null>;
  isConnected(): boolean;
  network(): Promise<Types.Network>;
}

// TypeScript type for transaction payload
export type TransactionPayload = Types.TransactionPayload;

// TypeScript type for transaction
export type Transaction = Types.Transaction;
