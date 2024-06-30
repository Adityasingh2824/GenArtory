// ./components/layout/Header.tsx

import React from 'react';
import styles from './Footer.module.css';



const Header = () => {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        console.log('Connected account:', accounts[0]);
        // You can add more logic here to set the account in your app's state
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      console.error('Ethereum object not found, install MetaMask.');
    }
  };

  return (
    <header>
      <h1>My App</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
    </header>
  );
};

export default Header;