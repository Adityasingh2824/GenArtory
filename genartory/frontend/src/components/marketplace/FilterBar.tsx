// frontend/src/components/marketplace/FilterBar.tsx

import React, { useState, useEffect } from 'react';
import styles from './FilterBar.module.css';
import Checkbox from '../common/Checkbox'; // Import your Checkbox component

interface FilterBarProps {
  onFilterChange: (filters: string[]) => void; // Callback to update parent component
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [collections, setCollections] = useState<string[]>([]);

  useEffect(() => {
    // Fetch collection names from your backend or smart contract
    const fetchCollections = async () => {
      try {
        const collectionsData = await fetch('/api/collections').then(res => res.json()); // Replace with your actual API call
        setCollections(collectionsData);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    onFilterChange(checked 
      ? [...selectedFilters, value] 
      : selectedFilters.filter(filter => filter !== value)
    );
  };

  return (
    <div className={styles.filterBar}>
      <h3>Filters</h3>
      <div className={styles.filters}>

        {/* Collection Filters */}
        <h4>Collections</h4>
        {collections.map((collection) => (
          <Checkbox
            key={collection}
            id={collection}
            label={collection}
            onChange={handleCheckboxChange}
          />
        ))}

        {/* Add more filter sections (e.g., Price Range, Categories, etc.) */}
      </div>
    </div>
  );
};

export default FilterBar;
