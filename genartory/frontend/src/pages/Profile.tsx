import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Profile.module.css';
import Button from '../components/common/Button'; // Assuming you have a Button component
import NFTCard from '../components/nft/NFTCard'; // Assuming you have an NFTCard component
import { useWallet } from '@aptos-labs/wallet-adapter-react'; 
import { Aptos, AptosConfig, Network, queryIndexer } from "@aptos-labs/ts-sdk";
import axios from 'axios'


// interface NFT {
//   // Define your NFT object structure here
//   id: string;
//   name: string;
//   imageUrl: string;
//   description?: string;
//   creator?: string;
// }

import { NFT } from '../utils/aptos';



interface Transaction {
  // Define your transaction object structure here
  id: string;
  type: string; // 'buy', 'sell', 'create', etc.
  amount: number;
  timestamp: string;
}

const Profile: React.FC = () => {
  const { walletAddress } = useParams();
  const { connected, account } = useWallet()

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (walletAddress) {
          // Fetch user's NFTs
          // const nftsResponse = await axios.get(`/api/nfts/${walletAddress}`);
          // setNfts(nftsResponse.data);
          const data = await lgetNFTs(account.address);
          setNfts(data);


        }

        // Fetch user's transactions
        // const transactionsResponse = await axios.get(`/api/transactions/${walletAddress}`);
        // setTransactions(transactionsResponse.data);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Handle error gracefully (e.g., show error message)
      }
    };
 
    fetchProfileData();
  }, [walletAddress]);

  const lgetNFTs = async (account: any) => {
          const objects = await myclient.queryIndexer({
        query: {
          query: `
          query GetAccountNfts($address: String) {
            current_token_ownerships_v2(
              where: {owner_address: {_eq: $address}, amount: {_gt: "0"}}
            ) {
              current_token_data {
                collection_id
                largest_property_version_v1
                current_collection {
                  collection_id
                  collection_name
                  description
                  creator_address
                  uri
                  __typename
                }
                description
                token_name
                token_data_id
                token_standard
                token_uri
                __typename
              }
              owner_address
              amount
              __typename
            }
          }
            `,
          variables: { address: account },
        },
      });
      let tempArray: NFT[] = [];
        objects.current_token_ownerships_v2.forEach(element => {
      let nft = {
        id:  element.current_token_data.token_data_id ,
        creator_address: element.current_token_data.creator_address,
        content_uri: element.current_token_data.token_uri,
        royalty_percentage: 0,
        collection_name: element.current_token_data.current_collection.collection_name,
        description: element.description, // optional
      };
      tempArray.push(nft);
    });
    return tempArray;
  };


  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Implement avatar upload logic here (e.g., using a cloud storage service)
      // Once uploaded, setAvatarUrl with the image URL
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className={styles.profileImage} />
        ) : (
          <div className={styles.profileImagePlaceholder}>{/* Placeholder icon */}</div>
        )}
        <input type="file" onChange={handleAvatarUpload} />

        <h2>{walletAddress}</h2> 
      </div>

      {/* NFT Section */}
      <section className={styles.profileSection}>
        <h3 className={styles.profileSection__title}>NFTs</h3>
        {isLoading ? (
          <p>Loading NFTs...</p>
        ) : (
          <div className={styles.nftGrid}>
            {nfts.map(nft => (
              
               <NFTCard 
                key={nft.id.token_data_id} 
                nft={nft} 
                
              />
            ))}
          </div>
        )}
      </section>

      {/* Transaction Section */}
      <section className={styles.profileSection}>
        <h3 className={styles.profileSection__title}>Transactions</h3>
        {/* Map and display transactions here */}
      </section>
    </div>
  );
};


export default Profile;
