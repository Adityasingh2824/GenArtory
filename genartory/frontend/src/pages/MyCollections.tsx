// frontend/src/pages/MyCollections.tsx
import React, { useState, useEffect } from 'react';
import styles from './MyCollections.module.css';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { getUserCollections, createCollection } from '../utils/aptos';
import CollectionCard from '../components/nft/CollectionCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal'; // Assuming you have a Modal component
import Input from '../components/common/Input';
import { useNavigate } from 'react-router-dom'


const MyCollections: React.FC = () => {
  const { account } = useWallet();
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionUri, setNewCollectionUri] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCollections = async () => {
      if (account?.address) {
        try {
          const data = await getUserCollections(account.address);
          setCollections(data);
        } catch (error) {
          console.error('Error fetching collections:', error);
          // Handle errors gracefully here
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCollections();
  }, [account?.address]);

  const handleCreateCollection = async () => {
    try {
      // Call the createCollection function from aptos.ts
      await createCollection(account?.address, newCollectionName, newCollectionUri, newCollectionDesc);
      // Update the collections state or refetch collections
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error('Error creating collection:', error);
      // Handle errors here
    }
  };
  const handleCollectionClick = (collectionName: string) => {
    navigate(`/collection/${collectionName}`);
  };


  return (
    <div className={styles.container}>
      <h1>My Collections</h1>

      <Button onClick={() => setShowModal(true)}>
        Create New Collection
      </Button>

      {isLoading ? (
        <p>Loading collections...</p>
      ) : (
        <div className={styles.collectionsGrid}>
          {collections.map((collection) => (
            <CollectionCard 
              key={collection.name} 
              collection={collection} 
              onClick={() => handleCollectionClick(collection.name)}
            />
          ))}
        </div>
      )}

      {/* Create Collection Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>Create New Collection</h2>
        <form onSubmit={handleCreateCollection}>
            <Input
                label="Collection Name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
            />
            <Input
                label="Collection URI"
                value={newCollectionUri}
                onChange={(e) => setNewCollectionUri(e.target.value)}
            />
            <Input
                label="Collection Description"
                value={newCollectionDesc}
                onChange={(e) => setNewCollectionDesc(e.target.value)}
            />
            <Button type="submit" variant="primary" isLoading={isLoading}>Create</Button>
        </form>
      </Modal>
    </div>
  );
};

export default MyCollections;
