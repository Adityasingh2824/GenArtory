// backend/src/controllers/daoController.js
const aptosService = require('../services/aptosService');
const { body, param, validationResult } = require('express-validator'); 

// Create proposal
exports.createProposal = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { proposerAddress, proposalType, description, parameters } = req.body;
        const txHash = await aptosService.createProposal(proposerAddress, proposalType, description, parameters);
        if (!txHash) {
            return res.status(500).json({ error: 'Failed to create proposal.' });
        }
        res.status(201).json({ message: 'Proposal created successfully', txHash });
    } catch (error) {
        next(error);
    }
};

// Vote on a proposal
exports.voteOnProposal = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { voterAddress, proposalId, vote } = req.body;
        const txHash = await aptosService.voteOnProposal(voterAddress, proposalId, vote);
        if (!txHash) {
            return res.status(500).json({ error: 'Failed to cast vote.' });
        }
        res.status(200).json({ message: 'Vote cast successfully', txHash });
    } catch (error) {
        next(error);
    }
};

// Get proposal details
exports.getProposal = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const proposalId = req.params.proposalId;
        const proposal = await aptosService.getProposal(proposalId);
        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found.' });
        }
        res.status(200).json(proposal);
    } catch (error) {
        next(error);
    }
};

// Get all proposals
exports.getAllProposals = async (req, res, next) => {
    try {
        const proposals = await aptosService.getAllProposals();
        res.status(200).json(proposals);
    } catch (error) {
        next(error);
    }
};
exports.validate = (method) => {
    switch (method) {
        case 'createProposal': {
            return [
                body('proposerAddress', 'Invalid proposer address').exists().isString().custom(aptosService.isValidAptosAddress),
                body('proposalType', 'Invalid proposal type').exists().isInt({ min: 0, max: 1 }),
                body('description', 'Description is required').exists().isString(),
                body('parameters', 'Invalid parameters').optional().custom(aptosService.isValidHex),
            ]
        }
        case 'voteOnProposal': {
            return [
                body('voterAddress', 'Invalid voter address').exists().isString().custom(aptosService.isValidAptosAddress),
                body('proposalId', 'Invalid proposal ID').exists().isInt({ min: 1 }),
                body('vote', 'Invalid vote').exists().isBoolean(),
            ]
        }
        case 'getProposal': {
            return [
                param('proposalId', 'Invalid proposal ID').exists().isInt({ min: 1 }),
            ]
        }
    }
};

