// frontend/src/utils/validation.ts

export const validatePrompt = (prompt: string): string | null => {
    if (prompt.trim().length === 0) {
      return 'Prompt is required';
    }
    if (prompt.length > 200) { // Assuming a maximum of 200 characters for a prompt
      return 'Prompt should be less than 200 characters';
    }
    return null; // No errors
  };
  
  export const validateRoyaltyPercentage = (percentage: number): string | null => {
    const parsedPercentage = parseFloat(percentage.toString()); // Convert to number
  
    if (isNaN(parsedPercentage) || parsedPercentage < 0 || parsedPercentage > 100) {
      return 'Royalty percentage must be between 0 and 100';
    }
    return null; // No errors
  };
  
  export const validatePrice = (price: number): string | null => {
    if (isNaN(price) || price <= 0) {
      return 'Price must be a positive number';
    }
    return null; // No errors
  };
  
  export const validateAddress = (address: string): string | null => {
    // Implement Aptos address validation logic here using regex
    const addressRegex = /^0x[a-fA-F0-9]{64}$/; // Basic Aptos address pattern
  
    if (!addressRegex.test(address)) {
      return 'Invalid Aptos address';
    }
    return null; // No errors
  };
  
  // ... add more validation functions as needed ...
  
  