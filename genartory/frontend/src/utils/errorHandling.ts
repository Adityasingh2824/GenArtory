// frontend/src/utils/errorHandling.ts

import { toast } from "react-hot-toast";

export const handleError = (error: any) => {
  console.error(error); // Log the error to the console for debugging

  let errorMessage = "An error occurred. Please try again later.";

  // Check for specific error types and customize the message
  if (error.response) {
    // Handle Axios errors (if you're using it for API calls)
    errorMessage = error.response.data.message || errorMessage;
  } else if (error.message.includes('Move abort')) {
    // Handle Move abort errors from the blockchain
    errorMessage = error.message.match(/Move abort: (.*)/)?.[1] || errorMessage;
  }

  toast.error(errorMessage); // Display an error toast notification
};
