// frontend/src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import styles from './Profile.module.css';
import NFTCard from '../components/nft/NFTCard';
import { getNFTsOwnedByAddress, getProfileDetails } from '../utils/aptos';

const Profile: React.FC = () => {
  const { account } = useWallet();
  const [profile, setProfile] = useState<any>(null); // Replace 'any' with your profile type
  const [ownedNFTs, setOwnedNFTs] = useState<any[]>([]); // Update with your NFT type
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (account?.address) {
        try {
          const profileData = await getProfileDetails(account.address); // Fetch user profile details
          setProfile(profileData);

          const nfts = await getNFTsOwnedByAddress(account.address);
          setOwnedNFTs(nfts);
        } catch (error) {
          console.error('Error fetching profile data:', error);
          // Handle errors gracefully (e.g., show error message)
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [account?.address]); // Re-fetch when account changes

  return (
    <div className={styles.container}>
      {isLoading ? (
        <p>Loading profile...</p>
      ) : (
        <>
          <h1>{profile?.username || "User Profile"}</h1> 
          <p>Wallet Address: {account?.address}</p>
          {/* Display other profile details here (bio, avatar, etc.) */}

          <h2>Owned NFTs</h2>
          <div className={styles.nftGrid}>
            {ownedNFTs.length === 0 ? (
              <p>No NFTs owned yet.</p>
            ) : (
              ownedNFTs.map((nft) => (
                <NFTCard key={nft.id} nft={nft} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
