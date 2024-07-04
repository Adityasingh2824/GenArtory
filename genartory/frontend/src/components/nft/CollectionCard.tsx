import React from 'react';
import styles from './CollectionCard.module.css';

interface CollectionCardProps {
  title: string;
  imageUrl: string;
  itemCount: number;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ title, imageUrl, itemCount, collection }) => {
  return (
    <div className={styles.collectionCard}>
      <img src={imageUrl} alt={title} className={styles.collectionImage} />
      <div className={styles.collectionInfo}>
        <h3 className={styles.collectionTitle}>{title}</h3>
        <h3 className={styles.collectionTitle}>{collection.description}</h3>
        <p className={styles.collectionCount}>{itemCount} items</p>
      </div>
    </div>
  );
};

export default CollectionCard;