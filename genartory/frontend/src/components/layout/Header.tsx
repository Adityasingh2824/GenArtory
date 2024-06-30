// Updated Header.tsx with a "Back to Home" button

import React from 'react';
import styles from './Header.module.css'; // Corrected import to use Header.module.css
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation

const Header = () => {
  const { connect, account } = useWallet();
  return (
    <header className={styles.header}>
      <h1>My App</h1>
      <Link to="/" className={styles.homeButton}>Home</Link> {/* Add a "Back to Home" button */}
      <WalletConnector />

    </header>
  );
};

export default Header;