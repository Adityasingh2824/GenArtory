#!/bin/bash

# Check for required arguments
if [ $# -lt 1 ]; then
    echo "Usage: ./deploy.sh <profile>"
    echo "  profile: devnet or testnet"
    exit 1
fi

# Set profile (devnet or testnet)
PROFILE=$1

# Path to the Move.toml file
MOVE_TOML="./Move.toml"

# Check if Move.toml exists
if [ ! -f "$MOVE_TOML" ]; then
    echo "Error: Move.toml not found. Please make sure you are in the project root directory."
    exit 1
fi

# Compile Move modules
echo "Compiling Move modules..."
aptos move compile

# Publish modules
echo "Publishing modules to $PROFILE..."
aptos move publish --named-addresses genartory=@genartory --profile $PROFILE

# Get account address from profile
ACCOUNT_ADDRESS=$(aptos account list --profile $PROFILE | head -n 1 | awk '{print $1}')
echo "Account address: $ACCOUNT_ADDRESS"

# Initialize modules
echo "Initializing modules..."
aptos move run --function-id genartory::nft::initialize --profile $PROFILE
aptos move run --function-id genartory::marketplace::initialize --profile $PROFILE

# Additional Initialization (if needed)
# For example, if you have a custom token contract:
 aptos move run --function-id genartory::token::initialize --args ... --profile $PROFILE 

# For DAO (if implemented):
 aptos move run --function-id genartory::dao::initialize --args ... --profile $PROFILE

echo "Deployment completed successfully!"
