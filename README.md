# GenArtory: Unleashing the Power of AI in Art Creation and Ownership

GenArtory is a cutting-edge decentralized application (dApp) built on the Aptos blockchain that revolutionizes art creation and ownership. It leverages the power of artificial intelligence (AI) to generate unique digital artworks and mints them as non-fungible tokens (NFTs).

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

GenArtory aims to democratize art creation and ownership by harnessing AI to generate unique digital artworks. It provides a platform for artists to showcase their AI-generated art and for collectors to discover and own these unique pieces.

## Features

*   **AI-Powered Art Generation:** Generate unique and creative art pieces using cutting-edge AI models like Stable Diffusion.
*   **NFT Minting and Marketplace:** Mint AI-generated art as NFTs on the Aptos blockchain and trade them in a secure marketplace.
*   **Collection Management:**  Organize and manage your NFTs in collections.
*   **Royalty Distribution:**  Creators earn royalties on secondary sales of their NFTs.
*   **Decentralized Governance (DAO):** Participate in the governance of the platform through the GenArtory DAO.

## Technology Stack

*   **Blockchain:** Aptos
*   **Smart Contract Language:** Move
*   **Frontend:** React, TypeScript, Vite
*   **Backend:** Node.js, Express, MongoDB (or your chosen database)
*   **AI Model:**  Stable Diffusion (or any other compatible model)

## Installation and Setup

**Prerequisites:**

*   Aptos CLI: Install the Aptos CLI following the instructions on the Aptos website.
*   Node.js and npm: Install Node.js and npm.
*   Docker (Optional): Recommended for running a local Aptos node for development.

**Steps:**

1.  **Clone the Repository:**
    ```bash
    git clone [invalid URL removed]
    cd genartory
    ```

2.  **Launch The genartory:**
    ```bash
    cd genartory
    npm install 
    npm run dev
    ```

## Usage
* Refer to README.md in `/scripts` directory.

## API Endpoints

The backend exposes the following API endpoints:

*   **`/api/ai/generate` (POST):** Generate AI art.
*   **`/api/nft/mint` (POST):**  Mint an NFT.
*   **`/api/nft/:tokenId` (GET):**  Get NFT details.
*   **`/api/marketplace/listings` (GET):** Get all NFT listings.
*   **`/api/marketplace/listNFT` (POST):**  List an NFT for sale.
*   **`/api/marketplace/buyNFT` (POST):** Buy an NFT.
*   **`/api/dao/createProposal` (POST):**  Create a DAO proposal.
*   **`/api/dao/vote` (POST):** Vote on a DAO proposal.

## Testing

Run unit tests for the Move smart contracts:

```bash
aptos move test
