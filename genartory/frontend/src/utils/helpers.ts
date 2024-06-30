// frontend/src/utils/helpers.ts

// Shorten an Aptos address for display
export const shortenAddress = (address: string, numChars = 4): string => {
    return `${address.slice(0, numChars + 2)}...${address.slice(-numChars)}`;
  };
  
  // Format a timestamp (in seconds) into a human-readable string
  export const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Format a price with commas (e.g., 1,000,000)
  export const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US');
  };
  
  // Generate a random ID (you can use a more robust library like uuid for production)
  export const generateRandomId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
  
  // ... other helper functions you might need ...
  