// frontend/src/components/nft/NFTDetails.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './NFTDetails.module.css';
import { getNFTDetails } from '../../utils/aptos';
import Button from '../common/Button';
import { formatAuctionDetails, formatBidHistory } from '@/utils/formatting';


const NFTDetails: React.FC = () => {
  const { creatorAddress, tokenId } = useParams();
  const [nft, setNft] = useState<any>(null); // Replace 'any' with your NFT type
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTDetails = async () => {
      try {
        const nftData = await getNFTDetails(creatorAddress!, tokenId!); // Fetch NFT details
        setNft(nftData);
      } catch (error) {
        console.error('Error fetching NFT details:', error);
        setError('Failed to load NFT details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTDetails();
  }, [creatorAddress, tokenId]);

  if (isLoading) return <p>Loading NFT details...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!nft) return <p>NFT not found.</p>; // Handle case where NFT is not found

  return (
    <div className={styles.container}>
      <img src={nft.content_uri} alt={nft.name} className={styles.image} />
      <div className={styles.details}>
        <h2 className={styles.title}>{nft.name}</h2>
        <p className={styles.creator}>Created by: {nft.creator_address}</p>
        <p className={styles.description}>{nft.description}</p>
        <p className={styles.collection}>Collection: {nft.collection_name}</p>
        {/* ... other NFT attributes/properties ... */}
        <p className={styles.royalty}>Royalty: {nft.royalty_percentage}%</p>

        {nft.price && ( 
          <div className={styles.priceContainer}>
            <p className={styles.price}>Price: {nft.price} GAC</p>
            <Button variant="primary">Buy Now</Button> 
            {/* Add "Place Bid" button if it's an auction */}
          </div>
        )}
      </div>

      {/* ... (Optional) Sections for bid history, ownership history, etc. */}
      {listing.is_auction && (
    <div className={styles.auctionDetails}>
      <p>{formatAuctionDetails(listing.auction)}</p>
      {listing.auction.bids && listing.auction.bids.length > 0 && (
        <div className={styles.bidHistory}>
          <h3>Bid History:</h3>
          <pre>{formatBidHistory(listing.auction.bids)}</pre>
        </div>
      )}
    </div>
)}
    </div>
  );
};

export default NFTDetails;
