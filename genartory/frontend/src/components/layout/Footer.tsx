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
    </footer>
  );
};

export default Footer;