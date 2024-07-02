// backend/src/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  address: { 
    type: String,
    required: true,
    unique: true, 
  },
  username: { 
    type: String, 
    unique: true, 
  }, // Consider making this unique
  email: { 
    type: String, 
    unique: true, // Consider making this unique if you want email-based login
  },
  profilePicture: String, // Can be a URL or IPFS hash
  bio: String,
  createdNFTs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NFT' }], // Array referencing NFTs created by the user
  ownedNFTs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NFT' }],  // Array referencing NFTs owned by the user
  // ... other fields (e.g., preferences, activity history, etc.)
}, { timestamps: true }); // Add timestamps for when the user was created/updated

module.exports = mongoose.model('User', UserSchema);
