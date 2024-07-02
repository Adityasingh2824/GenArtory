// backend/src/models/NFT.js

const mongoose = require('mongoose');

const NFTSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true,
  },
  creatorAddress: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  collectionName: {
    type: String,
    required: true,
  },
  imageUri: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  royaltyPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  ownerAddress: {
    type: String,
    default: '',
  },
  isListed: {
    type: Boolean,
    default: false,
  },
  // ... other fields you might want to store (e.g., attributes, history)
}, { timestamps: true }); // Add timestamps for when the NFT was created/updated

module.exports = mongoose.model('NFT', NFTSchema);
