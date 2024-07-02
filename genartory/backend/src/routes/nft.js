// backend/src/routes/nft.js

const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');
const { body, validationResult } = require('express-validator'); 
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

// Create collection route with validation
router.post(
    '/createCollection',
    authMiddleware, // Authenticate the request 
    body('collectionName').notEmpty().withMessage('Collection name is required'),
    body('uri').notEmpty().withMessage('URI is required'),
    body('description').notEmpty().withMessage('Description is required'),
    nftController.createCollection
);


// Mint NFT route with validation
router.post(
    '/mint',
    authMiddleware,
    body('creatorAddress').notEmpty().withMessage('Creator address is required').custom(aptosService.isValidAptosAddress),
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional().isString(),
    body('collectionName').notEmpty().withMessage('Collection name is required'),
    body('royaltyPercentage').isNumeric().withMessage('Royalty percentage must be a number').isInt({ min: 0, max: 100 }).withMessage('Royalty percentage must be between 0 and 100'),
    body('imageUri').notEmpty().withMessage('Image URI is required'),
    nftController.mintNFT
);

// Get NFT details route with validation
router.get(
    '/:tokenId',
    nftController.getNFTDetails
);
router.put(
    '/:tokenId',
    authMiddleware,
    nftController.updateNFT
)

module.exports = router;
