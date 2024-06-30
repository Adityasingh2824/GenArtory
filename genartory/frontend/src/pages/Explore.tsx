// frontend/src/pages/Explore.tsx

import React, { useState, useEffect } from 'react';
import styles from './Explore.module.css';
//import { getAllListings, getNFTDetails } from '@/utils/aptos';
import { NFT, Listing } from '@/types'; 
import ListingCard from '../components/marketplace/ListingCard';
import FilterBar from '../components/marketplace/FilterBar';
import SearchBar from '../components/marketplace/SearchBar';

const Explore: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      // try {
      //   const listingsData = await getAllListings();
        
      //   // Fetch additional details for each NFT (image, metadata, etc.)
      //   const detailedListings = await Promise.all(
      //     listingsData.map(async (listing) => {
      //       const nftDetails = await getNFTDetails(listing.creator, listing.token_id.name);
      //       return { ...listing, nft: nftDetails }; 
      //     })
      //   );

      //   setListings(detailedListings);
      //   setFilteredListings(detailedListings);
      // } catch (error) {
      //   console.error('Error fetching listings:', error);
      //   // Handle the error appropriately (e.g., display an error message)
      // } finally {
        setIsLoading(false);
     // }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    // Apply filtering and search based on state updates
    const filtered = listings.filter(
      (listing) =>
        listing.collection_name.includes(searchQuery) ||
        listing.nft.name.includes(searchQuery) ||
        listing.nft.description.includes(searchQuery)
    ).filter((listing) => selectedFilters.length === 0 || selectedFilters.includes(listing.collection_name));
    
    setFilteredListings(filtered);
  }, [listings, searchQuery, selectedFilters]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  return (
    <div className={styles.container}>
      <h1>Explore the Marketplace</h1>

      <div className={styles.filterAndSearch}>
        <SearchBar onSearch={handleSearchChange} />
        <FilterBar onFilterChange={handleFilterChange} />
      </div>

      {isLoading ? (
        <p>Loading marketplace listings...</p>
      ) : (
        <div className={styles.listingsGrid}>
          {filteredListings.map((listing) => (
            <ListingCard key={listing.token_id.toString()} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
