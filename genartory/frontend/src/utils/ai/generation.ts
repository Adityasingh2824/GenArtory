// frontend/src/utils/ai/generation.ts

import { GenerateArtRequest } from './types'; // Import your type definitions

// Assuming you are using a backend API for AI generation
export async function generateArt(request: GenerateArtRequest): Promise<string> {
  try {
    const response = await fetch('/api/ai/generate', {  // Replace with your actual API endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    // Check for errors in the response (optional)
    if (data.error) {
      throw new Error(data.error);
    }

    return data.imageUrl; // or data.imageData, depending on your API response format
  } catch (error) {
    console.error('Error generating art:', error);
    throw error; // Re-throw the error to be handled by the calling component
  }
}
