// backend/src/controllers/marketplaceController.js
const aptosService = require('../services/aptosService');
const { body, param, validationResult } = require('express-validator'); 
const Listing = require('../models/Listing');

// Function to validate tokenId 
const tokenIdValidation = () => param('tokenId', 'Invalid Token ID').exists().isString().custom(aptosService.isValidTokenId);

// Function to validate address
const addressValidation = (addressName) => body(addressName, 'Invalid Address').exists().isString().custom(aptosService.isValidAptosAddress);

// Controller function to list an NFT for sale
exports.listNFT = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { creatorAddress, tokenId, price } = req.body;

        // List the NFT
        const txHash = await aptosService.listNFT(creatorAddress, tokenId, price);

        // Store listing in MongoDB
        const newListing = new Listing({ tokenId, sellerAddress: creatorAddress, price });
        await newListing.save(); 

        if (!txHash) {
            return res.status(500).json({ error: 'Failed to list NFT' });
        }

        res.status(201).json({ message: 'NFT listed successfully', txHash });
    } catch (error) {
        next(error); // Pass error to error handling middleware
    }
};

// Controller function to buy a listed NFT
exports.buyNFT = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { buyerAddress, tokenId } = req.body;
        const listing = await Listing.findOne({ tokenId, isActive: true });

        if (!listing) {
            return res.status(404).json({ error: 'Active listing not found for this NFT' });
        }
        const creatorAddress = listing.sellerAddress;
  
        // Buy the NFT
        const txHash = await aptosService.buyNFT(buyerAddress, creatorAddress, tokenId);

        // Update listing in MongoDB
        listing.isActive = false;
        listing.buyerAddress = buyerAddress; // (Optional) Store buyer address for records
        await listing.save();

        if (!txHash) {
            return res.status(500).json({ error: 'Failed to buy NFT' });
        }

        res.status(200).json({ message: 'NFT purchased successfully', txHash });
    } catch (error) {
        next(error);
    }
};

// Controller function to cancel an NFT listing
exports.cancelListing = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { creatorAddress, tokenId } = req.body;

        // Cancel the NFT listing
        const txHash = await aptosService.cancelListing(creatorAddress, tokenId);

        // Update listing in MongoDB
        const listing = await Listing.findOne({ tokenId, sellerAddress: creatorAddress });
        if (listing) {
            listing.isActive = false;
            await listing.save();
        }

        if (!txHash) {
            return res.status(500).json({ error: 'Failed to cancel listing' });
        }

        res.status(200).json({ message: 'NFT listing cancelled successfully', txHash });
    } catch (error) {
        next(error);
    }
};

// Controller function to check if NFT is listed
exports.isNftListed = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const tokenId = req.params.tokenId; 
        const isListed = await aptosService.isNftListed(tokenId);

        res.status(200).json({ isListed: isListed });
    } catch (err) {
        next(err); 
    }
};

exports.validate = (method) => {
  switch (method) {
      case 'listNFT': {
          return [
              addressValidation('creatorAddress'),
              body('tokenId', 'Invalid tokenId').exists().isString().custom(aptosService.isValidTokenId),
              body('price', 'Invalid price').exists().isNumeric().isLength({ min: 1}),
          ]
      }
      case 'buyNFT': {
          return [
              addressValidation('buyerAddress'),
              tokenIdValidation(),
          ]
      }
      case 'cancelListing': {
          return [
              addressValidation('creatorAddress'),
              tokenIdValidation(),
          ]
      }
      case 'isNftListed': {
          return [
              tokenIdValidation(),
          ]
      }
  }
};


