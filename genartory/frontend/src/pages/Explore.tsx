// frontend/src/pages/Explore.tsx
import React, { useState, useEffect } from 'react';
import styles from './Explore.module.css';
import { useNavigate } from 'react-router-dom';
import ListingCard from '../components/marketplace/ListingCard'; 
import { getAllListings, getNFTDetails } from '../utils/aptos';
import { NFT } from '../types'; // Assuming you have defined a TypeScript type for NFTs

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]); // Update with your NFT type
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsData = await getAllListings();
        
        // Fetch additional details for each NFT (image, metadata, etc.)
        const detailedListings = await Promise.all(
          listingsData.map(async (listing) => {
            const nftDetails = await getNFTDetails(listing.creator, listing.token_id);
            return { ...listing, ...nftDetails };
          })
        );

        setListings(detailedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
        // Handle the error (e.g., show an error message)
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Explore the Marketplace</h1
      {/* Add filtering and sorting options here (if needed) */}
      {isLoading ? (
        <p>Loading marketplace listings...</p>
      ) : (
        <div className={styles.listingsGrid}>
          {listings.map((listing) => (
            <ListingCard 
              key={listing.token_id.name} 
              listing={listing} 
              onClick={() => navigate(`/nft/${listing.creator}/${listing.token_id.name}`)} // Navigate to NFT details
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
