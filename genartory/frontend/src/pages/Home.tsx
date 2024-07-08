import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import NFTCard from '../components/nft/NFTCard';
// import { getNFTs } from '../utils/aptos';
import Spline from '@splinetool/react-spline'

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredNFTs, setFeaturedNFTs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      console.log("fetchNFTs");
      // ... (Fetch or simulate NFT data) ...
    };
    fetchNFTs();
  }, []);
  //<Spline scene="https://prod.spline.design/h5oaCvhO2NaUT988/scene.splinecode" />
  
  return (
    <div className={styles.container}>
      <Spline scene="https://prod.spline.design/clGQxaePHndGHZfG/scene.splinecode" />    
  
      <section className={styles.featured}>
        <h2>Featured Artworks</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.nftGrid}>
            {featuredNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} /> 
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
