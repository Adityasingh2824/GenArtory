// ./components/layout/Header.tsx

import React from 'react';
import styles from './Header.module.css'; // Corrected import to use Header.module.css

// Assuming Aptos Wallet integration
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";

const Header = () => {
  const { connect, account } = useWallet();


  return (
    <header className={styles.header}>
      <h1>My App</h1>

          <WalletConnector />
    </header>
  );
};

export default Header;