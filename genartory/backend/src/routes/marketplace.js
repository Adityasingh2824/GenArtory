// backend/src/routes/marketplace.js

const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');
const { body, param, validationResult } = require('express-validator'); 
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

// List NFT
router.post(
    '/listNFT',
    authMiddleware,
    marketplaceController.validate('listNFT'),
    marketplaceController.listNFT
);

// Buy NFT
router.post(
    '/buyNFT',
    authMiddleware,
    marketplaceController.validate('buyNFT'),
    marketplaceController.buyNFT
);

// Cancel Listing
router.delete(
    '/cancelListing',
    authMiddleware,
    marketplaceController.validate('cancelListing'),
    marketplaceController.cancelListing
);

// Is NFT listed
router.get(
    '/isNftListed/:tokenId',
    marketplaceController.validate('isNftListed'),
    marketplaceController.isNftListed
);

// Get all listings
router.get(
    '/listings',
    marketplaceController.getAllListings
);

module.exports = router;
