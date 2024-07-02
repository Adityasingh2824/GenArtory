import React from 'react';
import { Routes, Route } from 'react-router-dom';
//import { MartianWalletAdapter } from '@martianwap/martian-wallet-adapter';

import { PetraWallet } from 'petra-plugin-wallet-adapter';

import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import './styles/index.css'; 
import { API_URL } from './utils/constants'; // Assuming you have this in constants.ts


// Import your page components
import Home from './pages/Home';
import Create from './pages/Create';
import Explore from './pages/Explore';
import MyNFTs from './pages/MyNFTs';
import MyCollections from './pages/MyCollections';
import Profile from './pages/Profile';
import Activity from './pages/Activity';
import About from './pages/About';
import FAQ from './pages/FAQ';

// Import your layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Create an array of supported wallet adapters
const wallets = [
  new PetraWallet(),
  //new FewchaWalletAdapter(), // Include other wallet adapters as needed
];

function App() {
  console.log("App.tsx");
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect>
      <div className="app">
        <Header /> 
        <main>
          <Routes> 
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore apiUrl={API_URL} />} />
            <Route path="/create" element={<Create />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<About />} /> 
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-collections" element={<MyCollections />} />
            <Route path="/my-nfts" element={<MyNFTs />} />
            <Route path="/activity" element={<Activity />} />
           
            {/* Add more routes as needed */}
            
            <Route path="*" element={<h1>Page Not Found</h1>}/>
          </Routes>
        </main>
        <Footer /> 
      </div>
    </AptosWalletAdapterProvider>
  );
}

export default App;