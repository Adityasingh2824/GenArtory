// backend/src/routes/ai.js

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { body } = require('express-validator');

// Define the image generation route (POST /api/ai/generate)
router.post(
  '/generate',
  body('prompt').notEmpty().withMessage('Prompt is required'), // Input validation
  body('width').isInt({ min: 256, max: 1024 }).withMessage('Width must be between 256 and 1024 pixels').toInt(), // Input validation for width
  body('height').isInt({ min: 256, max: 1024 }).withMessage('Height must be between 256 and 1024 pixels').toInt(), // Input validation for height
  body('numOutputs').isInt({ min: 1 }).withMessage('numOutputs must be at least 1').toInt(), // Input validation for numOutputs
  aiController.generateImage 
);

module.exports = router;
