// frontend/src/pages/MyNFTs.tsx
import React, { useState, useEffect } from 'react';
import styles from './MyNFTs.module.css';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network, queryIndexer } from "@aptos-labs/ts-sdk";
import { getNFTsOwnedByAddress } from '../utils/aptos';
import NFTCard from '../components/nft/NFTCard';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { NFT } from '../utils/aptos/types'; // Assuming you have defined a TypeScript type for NFTs


const MyNFTs: React.FC = () => {
  const { account } = useWallet();
  const navigate = useNavigate();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);


 const config = new AptosConfig({ network: Network.TESTNET });
  let myclient=new Aptos(config);


  useEffect(() => {
    const fetchNFTs = async () => {
      if (account?.address) {
        try {
          const data = await lgetNFTs(account.address);
          console.log('MyNFTs.tsx data', data);
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
                key={nft.id.token_data_id} 
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
