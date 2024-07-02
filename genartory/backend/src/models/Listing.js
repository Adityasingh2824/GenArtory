// backend/src/models/Listing.js

const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
  },
  sellerAddress: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Listing', ListingSchema);
