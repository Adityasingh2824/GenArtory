// frontend/src/utils/ai/types.ts

// Interface for requests sent to the AI model
export interface GenerateArtRequest {
    prompt: string;                // The text prompt to guide the AI generation
    style?: string;                // The desired art style (e.g., "abstract", "realistic")
    aspectRatio?: string;          // Aspect ratio of the generated image (e.g., "1:1", "16:9")
    seed?: number;                 // Optional seed for reproducibility
    // ... other parameters as needed ...
  }
  
  // Interface for the response from the AI model
  export interface GenerateArtResponse {
    success: boolean;            // Indicates whether the generation was successful
    imageUrl?: string;            // URL of the generated image (if hosted remotely)
    imageData?: string;           // Base64-encoded image data (if returned directly)
    error?: string;              // Error message (if generation failed)
    // ... other response data as needed ...
  }
  