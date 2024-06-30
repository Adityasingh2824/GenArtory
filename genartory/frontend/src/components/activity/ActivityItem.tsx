import React from 'react';
import styles from './ActivityItem.module.css'; // Assuming you'll also create a CSS module for styling

interface ActivityItemProps {
  message: string;
  timestamp: string; // Could be a Date string
}

const ActivityItem: React.FC<ActivityItemProps> = ({ message, timestamp }) => {
  return (
    <div className={styles.activityItem}>
      <p className={styles.message}>{message}</p>
      <time className={styles.timestamp}>{timestamp}</time>
    </div>
  );
};

export default ActivityItem;
