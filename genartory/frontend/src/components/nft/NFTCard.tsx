// frontend/src/components/nft/NFTCard.tsx
import React from 'react';
import styles from './NFTCard.module.css';
import { useNavigate } from 'react-router-dom';
import { NFT } from '../../types'; // Make sure to define your NFT type

interface NFTCardProps {
  nft: NFT;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/nft/${nft.creator_address}/${nft.id.name}`); // Navigate to details page
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <img src={nft.content_uri} alt={nft.name} className={styles.image} />
      </div>
      <div className={styles.details}>
        <h3 className={styles.title}>{nft.name}</h3>
        <p className={styles.creator}>by {nft.creator_address}</p>
        <p className={styles.collection}>{nft.collection_name}</p>
        {nft.price && (
          <div className={styles.price}>
            Price: {nft.price} GAC {/* Assuming GAC is your token */}
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTCard;
