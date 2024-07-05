// frontend/src/pages/MyCollections.tsx
import React, { useState, useEffect } from 'react';
import styles from './MyCollections.module.css';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network, queryIndexer } from "@aptos-labs/ts-sdk";

import { getUserCollections, createCollection } from '../utils/aptos';
import CollectionCard from '../components/nft/CollectionCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal'; // Assuming you have a Modal component
import Input from '../components/common/Input';
import { useNavigate } from 'react-router-dom'
import { NODE_URL, MODULE_ADDRESS } from "../utils/constants";




const MyCollections: React.FC = () => {

  const { account , signAndSubmitTransaction} = useWallet();
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionUri, setNewCollectionUri] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const navigate = useNavigate();

 const config = new AptosConfig({ network: Network.TESTNET });
  let myclient=new Aptos(config);

  useEffect(() => {
    const fetchCollections = async () => {
      if (account?.address) {
        try {
          const datafetched = await lgetinfos(account);
          //console.log(datafetched.current_collections_v2);
            setCollections(datafetched.current_collections_v2);
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




  const lgetinfos = async (account: any ) => {
    
  const objects = await myclient.queryIndexer({
      query: {
        query: `
          query MyQuery($ownerAddress: String)  {
  current_collections_v2(
    where: {creator_address: {_eq:  $ownerAddress}}
  ) {
    creator_address
    collection_name
    collection_id
    current_supply
    description
    uri
    total_minted_v2
    token_standard
    table_handle_v1
    mutable_uri
    mutable_description
    max_supply
    last_transaction_version
    last_transaction_timestamp
  }
}
          `,
        variables: { ownerAddress: account.address },
      },
    });


    return objects;
  };

  

  const lcreateCollection = async (
    account: any | null,
    collectionName: string,
    uri: string,
    description: string
  ) => {
      if (!account) {
        throw new Error('Please connect your wallet first');
      }
      try {

        const response = await signAndSubmitTransaction({
          sender: account,
          data: {
            function:`${MODULE_ADDRESS}::nft::create_collection`,
            typeArguments: [],
            functionArguments:  [collectionName, uri, description],
          }
        });
        let myresult = await myclient.waitForTransaction({ transactionHash: response.hash });
       return response.hash;
      } catch (error: any) {
         toast.error(error?.message || "Failed to create collection.");
        //return null;
      }
    }




  const handleCreateCollection = async () => {

    try {
      // Call the createCollection function from aptos.ts
        console.log('handleCreateCollection',newCollectionName, newCollectionUri, newCollectionDesc);
        let result = await lcreateCollection(account?.address, newCollectionName, newCollectionUri, newCollectionDesc);
        console.log('handleCreateCollection',result);
      // Update the collections state or refetch collections
        setShowModal(false); // Close the modal
     } catch (error) {
       console.error('Error creating collection:', error);
       // Handle errors here
     }
  };
  const handleCollectionClick = (collectionName: string) => {
      //console.log(`navigate to /collection/${collectionName}`);
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
            <a> hi {account?.address} length {collections?.length}</a>
          {collections.map((collection) => (
            <CollectionCard 
              key={collection.collection_id} 
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
