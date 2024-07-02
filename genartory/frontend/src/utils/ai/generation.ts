// frontend/src/utils/ai/generation.ts

import { GenerateArtRequest } from './types';

export async function generateArt(request: GenerateArtRequest): Promise<string> {
  const API_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3-medium';
  const headers = { Authorization: `Bearer ${import.meta.env.VITE_HUGGING_FACE_API_KEY}` }; // Get API key from env

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        inputs: request.prompt,
        options: {
          wait_for_model: true,
        },
        // Parameters specific to stable-diffusion-v1-5:
        parameters: {
          width: 512,                 // Set your desired width
          height: 512,                // Set your desired height
          negative_prompt: null,     // You can set this if you want to specify what NOT to generate
          num_inference_steps: 50,   // Number of steps to refine the image (adjust as needed)
          guidance_scale: 7.5,        // How strongly the model should adhere to the prompt (adjust as needed)
          // ... other parameters you might want to adjust ...
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Image generation failed.');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob); 
  } catch (error) {
    console.error('Error generating art:', error);
    throw error; 
  }
}
