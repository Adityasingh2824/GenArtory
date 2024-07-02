// backend/src/controllers/nftController.js

const aptosService = require('../services/aptosService'); // Import your Aptos service

// Controller function to handle NFT minting
exports.mintNFT = async (req, res, next) => {
    try {
        const tokenId = req.params.tokenId; 
    
        // Input validation
        if (!tokenId) {
          return res.status(400).json({ error: 'Token ID is required' });
        }
    
        // Get NFT details using the Mongoose model
        const nft = await NFT.findOne({ tokenId });
    
        if (!nft) {
          return res.status(404).json({ error: 'NFT not found' });
        }
    
        res.status(200).json(nft);
      } catch (err) {
        next(err); 
      }
  try {
    const { creatorAddress, imageData, name, description, collectionName, royaltyPercentage, collectionUri, collectionDesc } = req.body;

    // Input validation (add more thorough validation as needed)
    if (!creatorAddress || !imageData || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    //Check if the collection name already exists
    const collectionExists = await aptosService.getCollectionDetails(collectionName);
    if (!collectionExists) {
        // If collection doesn't exist, create it
        const collectionTxHash = await aptosService.createCollection(collectionName, collectionUri, collectionDesc);
        if (!collectionTxHash) {
            return res.status(500).json({ error: 'Failed to create collection' });
        }
    }
    // Mint the NFT using the Aptos service
    const txHash = await aptosService.mintNFT(creatorAddress, imageData, name, description, collectionName, royaltyPercentage);

    if (!txHash) {
      return res.status(500).json({ error: 'Failed to mint NFT' });
    }

    res.status(201).json({ message: 'NFT minted successfully', txHash });
  } catch (err) {
    next(err); // Pass error to the error handler middleware
  }
};


// ... Other NFT-related controller functions (updateNFT, getNFTDetails, etc.)

// Controller function to update NFT details
exports.updateNFT = async (req, res, next) => {
    try {
      const { tokenId, updates } = req.body;
  
      // Input validation 
      if (!tokenId || !updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'Invalid update request' });
      }

      const { royalty_percentage } = updates;
      // Check if royalty percentage is valid
      if (royalty_percentage && (royalty_percentage < 0 || royalty_percentage > 100)) {
        return res.status(400).json({ error: 'Invalid royalty percentage' });
      }  
  
      // Update the NFT using the Aptos service
      const txHash = await aptosService.updateNFT(tokenId, updates);
  
      if (!txHash) {
        return res.status(500).json({ error: 'Failed to update NFT' });
      }
  
      res.status(200).json({ message: 'NFT updated successfully', txHash });
    } catch (err) {
      next(err); 
    }
  };

// Controller function to get NFT details
exports.getNFTDetails = async (req, res, next) => {
  try {
    const tokenId = req.params.tokenId; 

    // Input validation
    if (!tokenId) {
      return res.status(400).json({ error: 'Token ID is required' });
    }

    // Get NFT details using the Aptos service
    const nft = await aptosService.getNFTDetails(tokenId);

    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    res.status(200).json(nft);
  } catch (err) {
    next(err); 
  }
};