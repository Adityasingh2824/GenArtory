// backend/src/controllers/aiController.js

const aiService = require('../services/aiService'); // Import your AI service

// Controller function to handle the image generation request
exports.generateImage = async (req, res, next) => {
  try {
    const { prompt, width, height, numOutputs } = req.body;

    // Basic validation (add more as needed)
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    
    // Additional validation here for other parameters
    
    // Generate image using your AI service
    const imageUrls = await aiService.generateArt(prompt, width, height, numOutputs);

    res.status(200).json({ images: imageUrls }); 
  } catch (err) {
    next(err); // Pass error to the error handler middleware
  }
};

