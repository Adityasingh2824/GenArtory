// frontend/src/utils/ai/generation.ts
import { GenerateArtRequest } from './types';
import { toast } from "react-hot-toast";
import { API_URL } from '../constants';
import { blob } from 'stream/consumers';



export interface AIImageProps {
  //blob:blob,
  blob: blob;
  url: string;
};



export async function generateArt(request: GenerateArtRequest): Promise<AIImageProps> {
  //const API_URL = 'https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4'; 
  const headers = { Authorization: `Bearer ${import.meta.env.VITE_HUGGING_FACE_API_KEY}` }; 
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        inputs: request.prompt, // The main prompt text
        parameters: {
          width: request.width,                 
          height: request.height,                
          negative_prompt: null,     
          num_inference_steps: 50,  
          guidance_scale: 7.5,        
          num_images_per_prompt: request.numOutputs, //Specify the number of images you want to generate per prompt
        }
      }),
    });

    // More specific error handling
    if (!response.ok) {
      const errorData = await response.json(); 
      if (errorData.error) { // Check for specific error field
        throw new Error(errorData.error); 
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      } else {
        throw new Error('Image generation failed. Please check your API key and prompt.');
      }
    }

 
    //const imageBlob = await response.blob();//.blob(); // Convert the response body to a Blob
    const imageData = await response.blob(); // Convert the response body to a Blob
    //console.log('imageBlob arraybuffer', imageBlob);
    //console.log('imageData blob', imageData);
     const imageUrl = URL.createObjectURL(imageData); // Create a URL for the Blob
    // console.log('imageUrl', imageUrl);

    //let tt:File = new File([imageBlob], 'image.png', { type: 'image/png' });
    //convert blob to base64
    // const reader = new FileReader();
    // reader.readAsDataURL(imageBlob);
    
    // reader.onloadend = function() {
    //   const base64data = reader.result;
    //   console.log('base64data', base64data);
    // }

    //console.log('reader', await reader);  

    


    // const data = await response.json();

    // if (!Array.isArray(data)) {
    //   throw new Error("Unexpected API response format. Please try again.");
    // }

    const imageUrls = [];// data.map((item: { generated: string }) => item.generated); 
    //add imageUrl to array of imageUrls
    imageUrls.push({   blob: imageData, url: imageUrl});
//console.log('imageUrls', imageUrls);
    if (imageUrls.length === 0) {
      throw new Error('No images were generated. Please try a different prompt or settings.');
    }
    return {   blob: imageData, url: imageUrl}; 
  } catch (error) {
    console.error('Error generating art:', error);
    toast.error(error?.message || 'An unexpected error occurred.'); // Display user-friendly error
    throw error; 
  }
}
