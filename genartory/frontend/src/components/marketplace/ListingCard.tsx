// frontend/src/components/marketplace/ListingCard.tsx

import React from 'react';
import styles from './ListingCard.module.css';
import { Listing } from '@/types';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button'; // Import your Button component
import { formatAuctionDetails, formatBidHistory } from '@/utils/formatting';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const navigate = useNavigate();
  const { nft, price } = listing; // Destructure listing object

  const handleCardClick = () => {
    navigate(`/nft/${nft.creator_address}/${nft.id.name}`);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <img src={nft.content_uri} alt={nft.name} className={styles.image} />
      <div className={styles.details}>
        <h3 className={styles.title}>{nft.name}</h3>
        <p className={styles.creator}>by {nft.creator_address}</p>
        <p className={styles.price}>{price} GAC</p>
        <Button variant="primary">Buy Now</Button> 
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
    </div>
    
  );
};

export default ListingCard;
