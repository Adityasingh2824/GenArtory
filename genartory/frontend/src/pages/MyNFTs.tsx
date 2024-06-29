// frontend/src/pages/MyNFTs.tsx
import React, { useState, useEffect } from 'react';
import styles from './MyNFTs.module.css';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { getNFTsOwnedByAddress } from '../utils/aptos';
import NFTCard from '../components/nft/NFTCard';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { NFT } from '../types'; // Assuming you have defined a TypeScript type for NFTs


const MyNFTs: React.FC = () => {
  const { account } = useWallet();
  const navigate = useNavigate();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (account?.address) {
        try {
          const data = await getNFTsOwnedByAddress(account.address);
          setNfts(data);
        } catch (error) {
          console.error('Error fetching NFTs:', error);
          // Handle errors gracefully (e.g., show error message to user)
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchNFTs();
  }, [account?.address]);

  return (
    <div className={styles.container}>
      <h1>My NFTs</h1>
      
      {isLoading ? (
        <p>Loading your NFTs...</p>
      ) : (
        <div className={styles.nftGrid}>
          {nfts.length === 0 ? (
            <p>You don't own any NFTs yet.</p>
          ) : (
            nfts.map((nft) => (
              <NFTCard 
                key={nft.id.name} 
                nft={nft} 
                onClick={() => navigate(`/nft/${nft.creator_address}/${nft.id.name}`)} // Navigate to NFT details
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyNFTs;
