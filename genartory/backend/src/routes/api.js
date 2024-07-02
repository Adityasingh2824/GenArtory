// backend/src/routes/api.js

const express = require('express');
const router = express.Router();

// Import your other routers
const aiRoutes = require('./ai');
const nftRoutes = require('./nft');
const marketplaceRoutes = require('./marketplace');
const daoRoutes = require('./dao');

// Mount the routers under their respective paths
router.use('/ai', aiRoutes);
router.use('/nft', nftRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/dao', daoRoutes);

module.exports = router; 
