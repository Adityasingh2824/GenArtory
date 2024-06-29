// frontend/src/pages/Activity.tsx
import React, { useState, useEffect } from 'react';
import styles from './Activity.module.css';
import { getRecentActivities } from '../utils/aptos';
import ActivityItem from '../components/activity/ActivityItem'; // Assuming you have an ActivityItem component

interface Activity {
  type: string; // 'mint', 'list', 'sale', 'bid', 'proposal', etc.
  timestamp: number; // Unix timestamp
  actor: string;  // Address of the user who performed the action
  nft: any;      // Relevant NFT details (if applicable)
  details: any;  // Additional details about the activity
}

const Activity: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getRecentActivities(); 
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
        // Handle errors (e.g., display an error message)
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Recent Activity</h1>

      {isLoading ? (
        <p>Loading activities...</p>
      ) : (
        <ul className={styles.activityList}>
          {activities.map((activity) => (
            <ActivityItem key={activity.timestamp} activity={activity} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Activity;
