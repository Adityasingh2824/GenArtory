// backend/src/services/aiService.js

const fetch = require('node-fetch');

// Function to generate art using the Hugging Face Inference API
async function generateArt(prompt, width, height, numOutputs) {
  const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-v1-5";
  const headers = { Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}` }; // Get API key from env

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        inputs: prompt, // The main prompt text
        parameters: {
          width: width,
          height: height,
          negative_prompt: null, // Or provide a negative prompt if needed
          num_inference_steps: 50,  // Adjust for quality/speed tradeoff
          guidance_scale: 7.5, // Adjust for creativity vs. accuracy
          num_images_per_prompt: numOutputs,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Image generation failed.');
    }

    const data = await response.json();
    if (data?.error) { // Check for specific error field in the response
      throw new Error(data.error); 
    }

    if (!data[0] || !data[0].generated) { // Ensure generated image exists
      throw new Error('No image was generated');
    }

    return data.map((item) => item.generated);
  } catch (error) {
    console.error("Error generating art:", error);
    throw error; // Re-throw the error to be handled by the error handler middleware
  }
};

module.exports = { generateArt };

