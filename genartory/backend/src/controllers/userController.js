// backend/src/controllers/userController.js

const User = require('../models/User');
const NFT = require('../models/NFT');
const { body, param, validationResult } = require('express-validator');
const aptosService = require('../services/aptosService');


// Get user profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const address = req.params.address;
    // fetch the user details and populate its nfts
    const user = await User.findOne({ address })
      .populate('createdNFTs')
      .populate('ownedNFTs');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // fetch the total number of listings for each NFT
    for (const nft of user.createdNFTs) {
      nft.totalListings = await Listing.countDocuments({tokenId: nft.tokenId})
    }
    for (const nft of user.ownedNFTs) {
      nft.totalListings = await Listing.countDocuments({tokenId: nft.tokenId})
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Update user profile (username, bio, profile picture)
exports.updateUserProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const address = req.params.address;
    const { username, bio, profilePicture } = req.body;

    let user = await User.findOne({ address });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    // Update the user's profile
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;
    
    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    next(err);
  }
};

// Get NFTs created by a user
exports.getNFTsCreatedByUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
      const address = req.params.address;
      const nfts = await NFT.find({ creatorAddress: address }); //find nfts created by the user
      res.status(200).json(nfts);
    } catch (err) {
      next(err);
    }
};

//Get NFTs owned by user
exports.getNFTsOwnedByUser = async (req, res, next) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
    const address = req.params.address;
    const nfts = await NFT.find({ ownerAddress: address });  // Find the NFTs owned by the address
    res.status(200).json(nfts);
  } catch (err) {
    next(err);
  }
};

exports.validate = (method) => {
    switch (method) {
        case 'getUserProfile': {
            return [
                param('address', 'Invalid address').exists().isString().custom(aptosService.isValidAptosAddress),
            ]
        }
        case 'updateUserProfile': {
            return [
                param('address', 'Invalid address').exists().isString().custom(aptosService.isValidAptosAddress),
                body('username', 'Username must be a string').optional().isString(),
                body('bio', 'Bio must be a string').optional().isString(),
                body('profilePicture', 'Profile picture must be a string').optional().isString(),
            ]
        }
        case 'getNFTsCreatedByUser': {
            return [
                param('address', 'Invalid address').exists().isString().custom(aptosService.isValidAptosAddress),
            ]
        }
        case 'getNFTsOwnedByUser': {
            return [
                param('address', 'Invalid address').exists().isString().custom(aptosService.isValidAptosAddress),
            ]
        }
    }
};
