// frontend/src/components/nft/NFTList.tsx

import React from 'react';
import NFTCard from './NFTCard';
import styles from './NFTList.module.css';
import { NFT } from '../../types'; // Make sure to define your NFT type

interface NFTListProps {
  nfts: NFT[]; // Array of NFT objects to display
}

const NFTList: React.FC<NFTListProps> = ({ nfts }) => {
  return (
    <div className={styles.list}>
      {nfts.map((nft) => (
        <div key={nft.id.name} className={styles.listItem}> {/* Added listItem container */}
          <NFTCard nft={nft} />
        </div>
      ))}
    </div>
  );
};

export default NFTList;
