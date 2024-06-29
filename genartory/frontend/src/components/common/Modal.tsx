// frontend/src/components/common/Modal.tsx
import React from 'react';
import styles from './Modal.module.css';
import clsx from 'clsx'; // For conditional classes


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // Optional title
  showCloseButton?: boolean; // Option to show/hide the close button
  className?: string; // Optional additional class name for the modal
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  showCloseButton = true,
  className,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className={clsx(styles.overlay, className)}>
      <div className={styles.modalContent}>
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            {showCloseButton && (
              <button onClick={onClose} className={styles.closeButton}>
                {/* You can add an X icon or "Close" text here */}
                &times;
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
