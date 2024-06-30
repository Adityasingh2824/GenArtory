// frontend/src/components/nft/NFTGrid.tsx

import React from 'react';
import NFTCard from './NFTCard';
import styles from './NFTGrid.module.css';
import { NFT } from '../../types'; // Make sure to define your NFT type

interface NFTGridProps {
  nfts: NFT[]; // Array of NFT objects to display
}

const NFTGrid: React.FC<NFTGridProps> = ({ nfts }) => {
  return (
    <div className={styles.grid}>
      {nfts.map((nft) => (
        <NFTCard key={nft.id.name} nft={nft} />
      ))}
    </div>
  );
};

export default NFTGrid;
