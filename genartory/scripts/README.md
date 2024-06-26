# GenArtory: An Aptos-Powered AI NFT Marketplace

GenArtory is a decentralized marketplace built on the Aptos blockchain that empowers creators to mint, sell, and collect unique AI-generated art as NFTs.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Scripts](#scripts)
- [Contract Structure](#contract-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

GenArtory leverages the power of artificial intelligence (AI) to create one-of-a-kind digital art pieces. These artworks are then minted as non-fungible tokens (NFTs) on the Aptos blockchain, ensuring secure ownership and provenance. The platform also incorporates a DAO (Decentralized Autonomous Organization) for community governance.

## Features

*   **AI-Generated Art:** Create unique art pieces using advanced AI models.
*   **NFT Minting:**  Mint your AI creations as NFTs on the Aptos blockchain.
*   **Marketplace:**  Buy and sell AI-generated NFTs.
*   **Royalty Distribution:**  Creators earn royalties on secondary sales.
*   **Community-Driven AI:**  Participate in training AI models and earn rewards.
*   **DAO Governance:**  Vote on proposals and shape the future of the platform.

## Getting Started

1.  **Prerequisites:**
    *   Install the Aptos CLI: Follow instructions on the [Aptos website](https://aptoslabs.com/).
    *   Install Node.js and npm:  Get them from the official website or your package manager.
    *   Install Docker (optional): Recommended for local development.

2.  **Clone the Repository:**
    ```bash
    git clone [invalid URL removed]
    cd genartory
    ```

3.  **Install Dependencies:**
    ```bash
    # Smart Contract Dependencies
   aptos install 0 x1::coin
    aptos install 0x1::token
    aptos install 0x1::managed_coin
    aptos install 0x1::account

    # Frontend Dependencies
    cd frontend
    npm install
    ```

## Usage

### Scripts

Navigate to the `scripts` directory and use the provided bash scripts to interact with the contracts:

*   **Account Management:**
    *   `./accounts/create_account.sh <profile>`: Create a new account.
    *   `./accounts/fund_account.sh <profile> <account_name>`: Fund an account on the testnet.
    *   `./accounts/list_accounts.sh <profile>`: List accounts and balances.
*   **NFT Interactions:**
    *   `./nft/create_collection.sh <profile> <collection_name> <uri> <description>`: Create a collection.
    *   `./nft/mint_nft.sh <profile> <collection_name> <content_uri> <royalty_percentage>`: Mint an NFT.
    *   `./nft/list_nft.sh <profile> <creator_address> <token_id> <price>`: List an NFT.
    *   `./nft/buy_nft.sh <profile> <buyer_address> <creator_address> <token_id>`: Buy an NFT.
    *   `./nft/transfer_nft.sh <profile> <sender_address> <receiver_address> <token_id>`: Transfer an NFT.
    *   `./nft/burn_nft.sh <profile> <admin_address> <token_id>`: Burn an NFT.
    *   `./nft/get_nft_info.sh <profile> <owner_address> <token_id>`: Get NFT info.
*   **Marketplace Interactions:**
    *   See scripts in `./scripts/marketplace/`.
*   **DAO Interactions:**
    *   See scripts in `./scripts/dao/`.

### Frontend

1.  Start the frontend development server:
    ```bash
    cd frontend
    npm start
    ```
2.  Connect your wallet and interact with the marketplace.

## Contract Structure

*   **`nft.move`:** Defines the NFT resource and functions for creating, minting, transferring, burning, and updating royalties for NFTs.
*   **`marketplace.move`:**  Handles listing, buying, and other marketplace interactions for NFTs.
*   **`token.move` (Optional):**  Defines a custom token for the GenArtory ecosystem.
*   **`dao.move` (Optional):** Implements the DAO governance structure for the platform.

## Testing

Unit tests for the Move contracts can be found in the `tests` directory. Run them with:

```bash
aptos move test
