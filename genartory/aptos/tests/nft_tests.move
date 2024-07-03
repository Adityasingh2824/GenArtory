module genartory::nft_tests {
    use std::signer;
    use std::vector;
    use aptos_framework::account;
    use aptos_std::token::TokenId;
    use aptos_token_objects::TokenDataId;
    use genartory::nft::{Self, NFT};

    // Test Scenarios

    #[test(creator = @genartory)] // Use the genartory address for the creator
    fun test_mint_nft(creator: signer) acquires Admin {
        // Initialize the module with the genartory account
        nft::init_module(&creator);

        // Mint an NFT
        let collection_name = vector<u8>::from("Test Collection");
        let content_uri = vector<u8>::from("ipfs://my_art_uri");
        let royalty_percentage = 10;
        nft::mint_nft(&creator, collection_name, content_uri, royalty_percentage);

        // Ensure the NFT exists
        let token_data_id = TokenDataId {
            creator: @genartory,
            collection: collection_name,
            name: content_uri,
        };
        let token_id = token::create_token_id_raw(token_data_id, 1);
        assert!(nft::exists_at(token_id), 0);

        // Get the NFT resource
        let nft_resource = borrow_global<NFT>(@genartory, token_id);

        // Verify the NFT properties
        assert!(nft_resource.creator_address == signer::address_of(&creator), 0);
        assert!(nft_resource.content_uri == content_uri, 0);
        assert!(nft_resource.royalty_percentage == royalty_percentage, 0);
        assert!(nft_resource.collection_name == collection_name, 0);
    }

    #[test(creator = @genartory, collector = @0x123)]
    public entry fun test_create_collection(creator: &signer, collector: &signer) acquires Admin {
        // Initialize the module with the genartory account
        nft::init_module(creator);

        // Create a new collection
        nft::create_collection(
            creator,
            vector<u8>::from("My Collection"),
            vector<u8>::from("ipfs://collection_uri"),
            vector<u8>::from("A description of my awesome collection"),
        );
    }

    // ... other test cases
}
