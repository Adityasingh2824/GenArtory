import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import NFTCard from '../components/nft/NFTCard';
// import { getNFTs } from '../utils/aptos';
import Spline from '@splinetool/react-spline';


const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredNFTs, setFeaturedNFTs] = useState<any[]>([]); // Update with your NFT type
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      console.log("fetchNFTs");
      // Simulate loading state 
      // ...(Fetch or simulate NFT data logic)
      setIsLoading(false);
    };

    fetchNFTs();
  }, []);

  return (
    <div className={styles.container}>

      {/* Spline Background */}
      <div className={styles.splineBackground}>
      <Spline scene="https://prod.spline.design/pgW1fxHd2W7NRYsa/scene.splinecode" />
  
      </div>

      <section className={styles.callToAction}>
        <h2>Ready to start your creative journey?</h2>
        <Button variant="primary" onClick={() => navigate('/create')}>
          Create
        </Button>
        <Button variant="secondary" onClick={() => navigate('/explore')}>
          Marketplace
        </Button>
      </section>

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
    </div>
  );
};

export default Home;
