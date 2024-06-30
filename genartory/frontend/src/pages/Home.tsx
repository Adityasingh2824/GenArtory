// frontend/src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
 import NFTCard from '../components/nft/NFTCard';
// import { getNFTs } from '../utils/aptos';
 //import HeroSection from '../components/layout/HeroSection';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredNFTs, setFeaturedNFTs] = useState<any[]>([]); // Update with your NFT type
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      console.log("fetchNFTs");
      // Simulate loading state 
      // try {
      //   const nfts = await getNFTs(); // Fetch featured NFTs (implement this function in utils/aptos.ts)
      //   setFeaturedNFTs(nfts);
      // } catch (error) {
      //   console.error('Error fetching NFTs:', error);
      //   // Handle the error (e.g., show an error message)
      // } finally {
        setIsLoading(false);
     // }
    };

    fetchNFTs();
  }, []);

  return (
    <div className={styles.container}>
      {/* <HeroSection 
      title="Discover and create extraordinary AI art."
      subtitle="Own a unique piece of the future." />*/}

      <section className={styles.featured}>
      
        <h2>Featured Artworks</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.nftGrid}>
            {featuredNFTs.map((nft) => (
              {/*    <NFTCard key={nft.id} nft={nft} /> */ }
            ))}
          </div>
        )}
      </section>

      <section className={styles.callToAction}>
        <h2>Ready to start your creative journey?</h2>
        <Button variant="primary" onClick={() => navigate('/create')}>
          Create Your NFT
        </Button>
        <Button variant="secondary" onClick={() => navigate('/explore')}>
          Explore Marketplace
        </Button>
      </section>
    </div>
  );
};

export default Home;

