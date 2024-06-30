// ./components/layout/Footer.tsx

import React from 'react';
import { Link } from 'react-router-dom';
///add styles to footer with module
import styles from './Footer.module.css';


const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <Link to="/faq">FAQ</Link>
      
      </div>
<div className="footer-content">
      <Link to="/about">About</Link> {/* Add this line for the About page link */}
      </div>
    </footer>
  );
};

export default Footer;