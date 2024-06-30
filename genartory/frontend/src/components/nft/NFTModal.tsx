// frontend/src/components/nft/NFTModal.tsx

import React from 'react';
import styles from './NFTModal.module.css';
import Modal from '../common/Modal'; // Make sure the path is correct
import Button from '../common/Button';
import { NFT } from '../../types'; // Make sure you have this type defined

interface NFTModalProps {
  nft: NFT;
  isOpen: boolean;
  onClose: () => void;
  onBuy?: () => void; // Optional callback for buying the NFT
  onPlaceBid?: (bidAmount: number) => void; // Optional callback for placing a bid
}

const NFTModal: React.FC<NFTModalProps> = ({
  nft,
  isOpen,
  onClose,
  onBuy,
  onPlaceBid
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={nft.name}>
      <div className={styles.modalContent}>
        <img src={nft.content_uri} alt={nft.name} className={styles.image} />

        <div className={styles.details}>
          <p className={styles.creator}>
            Created by: <span>{nft.creator_address}</span>
          </p>
          <p className={styles.description}>{nft.description}</p>
          <p className={styles.collection}>
            Collection: <span>{nft.collection_name}</span>
          </p>
          {/* Display other NFT attributes as needed */}
          <p className={styles.royalty}>
            Royalty: <span>{nft.royalty_percentage}%</span>
          </p>

          {nft.price && (
            <div className={styles.priceContainer}>
              <p className={styles.price}>Price: {nft.price} GAC</p>
              <Button onClick={onBuy}>Buy Now</Button>
            </div>
          )}

          {/* Conditional rendering for auction functionality */}
          {onPlaceBid && (
            <div className={styles.bidding}>
              {/* Add your bidding form here */}
              <Button onClick={() => onPlaceBid(/* Bid amount */)}>Place Bid</Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NFTModal;

