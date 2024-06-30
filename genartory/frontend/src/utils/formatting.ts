// frontend/src/utils/formatting.ts

import { NFT } from './aptos/types'; // Make sure to import your NFT type
import { formatPrice, formatTimestamp, shortenAddress } from './helpers';


// Function to format NFT metadata for display
export function formatNFTMetadata(nft: NFT): string {
  return `
    **Name:** ${nft.name}
    **Creator:** ${shortenAddress(nft.creator_address)}
    **Collection:** ${nft.collection_name}
    **Price:** ${formatPrice(nft.price)} GAC
    **Royalty:** ${nft.royalty_percentage}%
    **Description:** ${nft.description || 'No description available'}
  `;
}

// Function to format an Aptos address for display
export function formatAptosAddress(address: string) {
  return shortenAddress(address); // Assuming you have a shortenAddress function in helpers.ts
}

// Function to format a date for display
export function formatDate(timestamp: number) {
  return formatTimestamp(timestamp); // Assuming you have a formatTimestamp function in helpers.ts
}


// ... Add more formatting functions as needed (e.g., for auction details, bids, etc.)

// Function to format auction details for display
export function formatAuctionDetails(auction: Auction): string {
    const startTime = formatTimestamp(auction.start_time);
    const endTime = formatTimestamp(auction.end_time);
  
    return `
      **Starting Price:** ${formatPrice(auction.starting_price)} GAC
      **Current Highest Bid:** ${formatPrice(auction.current_highest_bid || 0)} GAC
      **Highest Bidder:** ${shortenAddress(auction.highest_bidder || '')}
      **Start Time:** ${startTime}
      **End Time:** ${endTime}
    `;
  }
  
  // Function to format a bid for display
  export function formatBid(bid: Bid): string {
    const timestamp = formatTimestamp(bid.timestamp);
  
    return `
      **Bidder:** ${shortenAddress(bid.bidder)}
      **Amount:** ${formatPrice(bid.amount)} GAC
      **Time:** ${timestamp}
    `;
  }
  
  // Function to format multiple bids for display
  export function formatBidHistory(bids: Bid[]): string {
    return bids.map(bid => formatBid(bid)).join('\n\n');
  }