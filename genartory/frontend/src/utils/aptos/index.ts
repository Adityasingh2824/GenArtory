// frontend/src/utils/aptos/index.ts

// Re-export all functions from each module
export * from './account';
export * from './collection';
export * from './marketplace';
export * from './dao';
export * from './types'; 

interface Activity {
  type: string; // 'mint', 'list', 'sale', 'bid', 'proposal', etc.
  timestamp: number; // Unix timestamp
  actor: string;  // Address of the user who performed the action
  nft: any;      // Relevant NFT details (if applicable)
  details: any;  // Additional details about the activity
}

/**
 * Fetches recent activities from the backend or a mock API.
 * @returns A promise that resolves to an array of Activity objects.
 */
export const getRecentActivities = async (): Promise<Activity[]> => {
  try {
    const response = await fetch('https://your-api-endpoint.com/activities');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const activities: Activity[] = await response.json();
    return activities;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error; // Rethrow to handle it in the calling component
  }
};