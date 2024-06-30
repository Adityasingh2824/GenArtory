// frontend/src/pages/FAQ.tsx
import React from 'react';
import styles from './FAQ.module.css';
import Accordion from '../components/common/Accordion'; // Assuming you have an Accordion component

export const FAQ: React.FC = () => {
  const faqs = [
    {
      question: 'What is GenArtory?',
      answer: 'GenArtory is a decentralized marketplace for AI-generated NFT art on the Aptos blockchain. It allows artists to create and sell unique digital art pieces, while providing collectors a platform to discover and own these creations.'
    },
    {
      question: 'How does AI-generated art work?',
      answer: 'Our platform utilizes advanced AI models to generate unique art pieces based on text prompts, styles, or other parameters provided by the user.'
    },
    {
      question: 'What are NFTs?',
      answer: 'NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of a specific item, like a piece of art. They are stored on the blockchain, ensuring their authenticity and scarcity.'
    },
    {
      question: 'How do I create an NFT on GenArtory?',
      answer: 'Simply visit our Create page, use the AI tools to generate your artwork, and then mint it as an NFT on the Aptos blockchain.'
    },
    {
      question: 'How do I buy an NFT?',
      answer: 'You can browse our marketplace, find an NFT you like, and purchase it using your Aptos-compatible wallet.'
    },
    // Add more FAQs here
  ];

  return (
    <div className={styles.container}>
      <h1>Frequently Asked Questions</h1>

      <div className={styles.faqList}>
        {faqs.map((faq, index) => (
          <Accordion key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQ;
