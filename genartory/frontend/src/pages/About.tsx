// frontend/src/pages/About.tsx

import React from 'react';
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h1 className={styles.heading}>About GenArtory</h1>
        <p>
          GenArtory is a revolutionary platform that empowers artists and collectors to explore the
          exciting intersection of artificial intelligence (AI) and art. 
        </p>

        <p>
          We believe in democratizing art creation and ownership, leveraging AI to generate unique
          digital artworks that are minted as non-fungible tokens (NFTs) on the Aptos blockchain.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Our Mission</h2>
        <p>
          Our mission is to foster a thriving community where artists can harness the power of AI to
          unlock their creativity and collectors can discover and own truly unique digital art pieces.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>The Team</h2>
        <p>
          GenArtory was founded by two passionate blockchain enthusiasts, Aditya Singh and Damien narozniak , who share a vision to create a new generation of art collectors and creators.
           </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>The Technology</h2>
        <p>
          GenArtory is built on the cutting-edge Aptos blockchain, which offers unparalleled speed, 
          security, and scalability. Our AI art generation is powered by state-of-the-art models 
          trained on diverse datasets, ensuring a wide range of styles and possibilities.
        </p>
      </section>
    </div>
  );
};

export default About;
