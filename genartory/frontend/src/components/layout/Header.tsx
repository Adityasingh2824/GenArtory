// Updated Header.tsx with a "Back to Home" button
import React from 'react';
import styles from './Header.module.css'; // Corrected import to use Header.module.css
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation
import  mylogo from '../../../public/images/logo.jpg'; // Import mylogo from images/genartory_logo.svg

  const Header = () => {
  const { connect, account, connected } = useWallet();
  return (
    <header className={styles.header}>
      <img src={mylogo} alt="Genartory Logo" className={styles.logo} /> {/* Use mylogo as the source of the image */}
      <h1>My App</h1>
      
      <Link to="/" className={styles.homeButton}>Home</Link> {/* Add a "Back to Home" button */}

      {connected ? 
        <div className={styles.headerRight}>
          <Link to="/create" className={styles.homeButton}>Create</Link>
          <Link to="/explore" className={styles.homeButton}>Explore</Link>
          <Link to="/my-collections" className={styles.homeButton}>My Collections</Link>
          <Link to="/activity" className={styles.homeButton}>Activity</Link>
          <Link to="/my-nfts" className={styles.homeButton}>My NFTs</Link>
          <Link to="/profile" className={styles.homeButton}>Profile</Link>
        </div>
       : <div className={styles.welcomeMessage}>WELCOME</div>}
      
      <WalletConnector />
    </header>
  );
};

export default Header;