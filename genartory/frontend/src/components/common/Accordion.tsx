// Accordion.tsx

import React, { useState } from 'react';

import styles from './Accordion.module.css'; // Assuming you have or will create Accordion.module.css for styling

interface AccordionProps {
  question: string;
  answer: string;
}

export const Accordion: React.FC<AccordionProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className={styles.accordion}>
      <div className={styles.accordionHeader} onClick={toggleOpen}>
        {question}
      </div>
      {isOpen && (
        <div className={styles.accordionBody}>
          {answer}
        </div>
      )}
    </div>
  );
};

export default Accordion;