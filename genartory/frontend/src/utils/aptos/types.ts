// frontend/src/utils/aptos/types.ts

import { Types } from 'aptos';

export interface NFT {
  id: Types.TokenId;
  creator_address: string;
  content_uri: string;
  royalty_percentage: number;
  collection_name: string;
  description: string; // optional
}

export interface Listing {
  token_id: Types.TokenId;
  seller_address: string;
  price: number;
  is_active: boolean;
}

export interface Collection {
  creator: string; // Address of the collection creator
  name: string; // Collection name
  uri: string; // Metadata URI for the collection
  description: string; // Collection description
}
export interface Proposal {
  proposer: string;
  proposal_type: number;
  description: string;
  yes_votes: number;
  no_votes: number;
  voting_end_time: number;
  executed: boolean;
  parameters: string; // This is an example, you may need to adjust based on your proposal parameter types
}

export interface Bid {
  bidder: string;
  amount: number;
  timestamp: number;
}

// ...add more types as needed for your project (e.g., Auction, Bid, etc.)...

// Auction Listing
export interface Auction {
    token_id: Types.TokenId;
    seller_address: string;
    starting_price: number;
    current_highest_bid: number;
    highest_bidder: string; // Address of the current highest bidder
    start_time: number;  // Unix timestamp
    end_time: number;   // Unix timestamp
    // ... other auction-specific fields as needed ...
  }
  
  // Bid
  export interface Bid {
    bidder: string;
    amount: number;
    timestamp: number;
    // ... other bid details (optional) ...
  }