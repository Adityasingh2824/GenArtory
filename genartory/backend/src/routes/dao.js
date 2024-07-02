// backend/src/routes/dao.js

const express = require('express');
const router = express.Router();
const daoController = require('../controllers/daoController');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

// Create proposal route with validation
router.post(
    '/createProposal',
    authMiddleware,
    daoController.validate('createProposal'),
    daoController.createProposal
);

// Vote on proposal route with validation
router.post(
    '/vote',
    authMiddleware,
    daoController.validate('voteOnProposal'),
    daoController.voteOnProposal
);

// Get proposal details route with validation
router.get(
    '/:proposalId',
    daoController.validate('getProposal'),
    daoController.getProposal
);

// Get all proposals route
router.get(
    '/',
    daoController.getAllProposals
);

module.exports = router;
