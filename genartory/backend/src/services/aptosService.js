// backend/src/services/aptosService.js
const { isAddressValid } = require("@aptos-labs/ts-sdk"); 
const { AptosClient, AptosAccount, TokenClient, FaucetClient, HexString } = require("aptos");
const { NODE_URL, FAUCET_URL, COLLECTION_CREATOR_ADDRESS, MODULE_ADDRESS } = require("../utils/constants");
const { HexString } = require('aptos');

const client = new AptosClient(NODE_URL);
const tokenClient = new TokenClient(client);
const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);

const COIN_TYPE_MOVER = `${MODULE_ADDRESS}::token::Token`;
const COIN_MODULE = `${MODULE_ADDRESS}::coin`;

// ... other service functions ...

async function getAccountFromSession(session) {
    let account = session.account;
    if (!account) {
      await faucetClient.fundAccount(session.address, 5000); // Fund the account with 5000 testnet coins
      account = new AptosAccount(HexString.ensure(session.address).toUint8Array());
    }
    return account;
}

async function createCollection(
    collectionName,
    uri,
    description
  ) {
    try {
      const collectionPayload: Types.TransactionPayload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::nft::create_collection`,
        type_arguments: [],
        arguments: [
          collectionName,
          uri,
          description,
        ],
      };
      const account = await getAccountFromSession(req.session);
      const txnRequest = await client.generateTransaction(
        account.address,
        collectionPayload,
        { max_gas_amount: "4000" }
      );
      const signedTxn = await client.signTransaction(account, txnRequest);
      const transactionRes = await client.submitTransaction(signedTxn);
      await client.waitForTransaction(transactionRes.hash);
      return transactionRes.hash;
    } catch (err) {
      console.error("Error creating collection:", err);
      throw err;
    }
  }

  async function mintNFT(
    creatorAddress, imageData, name, description, collectionName, royaltyPercentage
  ) {
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::nft::mint_nft`,
        type_arguments: [],
        arguments: [collectionName, imageData, name, royaltyPercentage.toString()],
      };
      // Get the connected account from the session.
      const account = await getAccountFromSession(req.session);
      const txnRequest = await client.generateTransaction(account.address, payload, {
        max_gas_amount: "4000",
      });
      const signedTxn = await client.signTransaction(account, txnRequest);
      const transactionRes = await client.submitTransaction(signedTxn);
      await client.waitForTransaction(transactionRes.hash);

      const token = await tokenClient.getToken(
        creatorAddress,
        collectionName,
        name
      );
      return token.id; 
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw error;
    }
  }

// ... other aptos service functions (listNFT, buyNFT, cancelListing, placeBid, updateListing, etc.)

// Helper function to get NFT details by tokenId
async function getNFTDetails(tokenId) {
  const [creatorAddress, collectionName, tokenName] = tokenId.split("::")[2].split("::");

  try {
      const nft = await tokenClient.getTokenForAccount(
          creatorAddress,
          `${MODULE_ADDRESS}::nft::NFT`,
          {
              creator: creatorAddress,
              collection: collectionName,
              name: tokenName,
          }
      );

      return {
          creatorAddress,
          collectionName,
          name: tokenName,
          description: nft.description,
          imageUri: nft.uri,
          tokenId: tokenId,
      };
  } catch (error) {
      console.error('Error fetching NFT details:', error);
      throw error;
  }
}

//Helper Function to get token id from name
async function getTokenIdFromName(creatorAddress, collectionName, name) {
  try {
      const resources = await client.getAccountResources(creatorAddress);
      const accountResource = resources.find((r) => r.type === '0x1::token::TokenStore');
      if (accountResource && 'data' in accountResource) {
          for (const token of accountResource.data.tokens.value) {
              if (token.id.token_data_id.collection === collectionName && token.id.token_data_id.name === name) {
                  return token.id;
              }
          }
      }
  } catch (error) {
      console.error("Error getting token ID from name:", error);
  }
  return null;
}

//helper function to update an existing NFT
async function updateNFT(tokenId, updates) {
  try {
    const nft = await getNFTDetails(tokenId);
    if (!nft) {
      throw new Error('NFT not found');
    }
    const [_, collectionName, name] = tokenId.split("::")[2].split("::");

    const payload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::nft::update_nft`,
      type_arguments: [],
      arguments: [collectionName, name, updates],
    };

    // Get the connected account from the session.
    const account = await getAccountFromSession(req.session);
    const txnRequest = await client.generateTransaction(account.address, payload, {
      max_gas_amount: "4000",
    });
    const signedTxn = await client.signTransaction(account, txnRequest);
    const transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);
    return transactionRes.hash;
  } catch (error) {
    console.error("Error updating NFT:", error);
    throw error;
  }
}

// Helper functions for validation
function isValidAptosAddress(address) {
        return isAddressValid(address);

}

function isValidTokenId(tokenId) {
  // Implement your token ID validation logic here
    try {
      // Parse the TokenId string
      const parts = tokenId.split("::");
  
      // Basic validation: Ensure the correct number of parts and format
      if (parts.length !== 3) {
        return false; // Invalid format
      }
  
      const [creatorAddress, collectionName, tokenName] = parts[2].split("::");
  
      // Check if addresses are valid
      if (!isValidAptosAddress(creatorAddress) || !isValidAptosAddress(collectionName)) {
        return false; // Invalid address
      }
  
      // Check if name is valid
      if (!tokenName.match(/^[a-zA-Z0-9_-]+$/)) {
        return false; // Invalid name format
      }
  
      return true; // TokenId is valid
    } catch (error) {
      console.error("Error validating TokenId:", error);
      return false; // Treat errors as invalid
    }
  
}

// ... (other Aptos service functions from previous response)

module.exports = { 
  mintNFT, 
  createCollection, 
  listNFT, 
  buyNFT, 
  cancelListing, 
  placeBid, 
  updateListing,
  isNftListed, 
  getNFTDetails,
  getTokenIdFromName,
  updateNFT,
  isValidAptosAddress, 
  isValidTokenId 
};
