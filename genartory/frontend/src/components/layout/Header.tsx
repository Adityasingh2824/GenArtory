// ./components/layout/Header.tsx

import React from 'react';
import styles from './Header.module.css'; // Corrected import to use Header.module.css

// Assuming Aptos Wallet integration
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";

const Header = () => {
  const { connect, account } = useWallet();

  const connectWallet = async () => {
    try {
      await connect();
      console.log('Connected account:', account);
      // You can add more logic here to set the account in your app's state
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  return (
    <header className={styles.header}>
      <h1>My App</h1>
          <button className={styles.connectWalletButton} onClick={connectWallet}>Connect Wallet</button>
          <WalletConnector />
    </header>
  );
};

export default Header;