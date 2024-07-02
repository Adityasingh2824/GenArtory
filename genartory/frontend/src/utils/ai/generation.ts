// frontend/src/utils/ai/generation.ts

import { GenerateArtRequest } from './types';

export async function generateArt(request: GenerateArtRequest): Promise<string> {
  const API_URL = 'https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4'; 

  const headers = { Authorization: `Bearer ${import.meta.env.VITE_HUGGING_FACE_API_KEY}` }; 

  console.log('request:', request);
  ///print headers to console
  console.log('headers:', headers);


  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        inputs: request.prompt,
        options: {
          wait_for_model: true,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Try to get error details from the response
      throw new Error(errorData?.error || 'Image generation failed'); // Use detailed error if available
    }

    const data = await response.json();
    if (data?.error) { // Check for specific error field in the response
      throw new Error(data.error); 
    }

    if (!data[0] || !data[0].generated) { // Ensure generated image exists
      throw new Error('No image was generated');
    }

    return data[0].generated; 
  } catch (error) {
    console.error('Error generating art:', error);
    throw error; // Re-throw the error to be handled by the calling component
  }
}
