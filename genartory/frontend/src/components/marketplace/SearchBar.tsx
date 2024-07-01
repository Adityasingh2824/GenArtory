// frontend/src/components/marketplace/SearchBar.tsx
import React, { useState, ChangeEvent } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void; // Callback for search query changes
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query); // Update local state
    onSearch(query); // Notify parent component of the new query
  };


  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        className={styles.input}
        placeholder="Search for NFTs..."
        value={searchQuery}
        onChange={handleChange}
      />
      {/* You can add a search icon or button here if you want */}
    </div>
  );
};

export default SearchBar;
