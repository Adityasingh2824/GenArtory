module genartory::nft_tests {
    use std::signer;
    use std::vector;
    use aptos_std::token::TokenId;
    use aptos_token_objects::{TokenDataId, Collection};
    use genartory::nft::{Self, NFT, Admin, ENOT_ADMIN, EINVALID_ROYALTY, ENOT_TOKEN_OWNER};

    // Helper Functions

    #[test_only]
    fun init_module(account: &signer) {
        nft::initialize(account);
    }

    // Test Scenarios

    // Test 1: Initialize Module (Success)
    #[test(account = @genartory)] 
    public entry fun test_initialize_module(account: &signer) {
        nft::initialize(account);
        let admin_resource = borrow_global<Admin>(@genartory);
        assert!(admin_resource.admin_address == signer::address_of(account), ENOT_ADMIN);
    }

    // Test 2: Create Collection (Success)
    #[test(creator = @genartory)]
    public entry fun test_create_collection(creator: &signer) acquires Admin {
        init_module(creator);
        let collection_name = string::utf8(b"Test Collection");
        let uri = string::utf8(b"https://example.com/collection");
        let description = string::utf8(b"This is a test collection");
        nft::create_collection(creator, b"Test Collection", b"https://example.com/collection", b"This is a test collection");

        // Assert collection exists
        let collections = &token::get_collections(signer::address_of(creator));
        assert!(vector::length(collections) == 1, 0);
        let collection = vector::borrow(collections, 0);
        assert!(collection.name == collection_name, 0);
        assert!(collection.uri == uri, 0);
        assert!(collection.description == description, 0);
    }

    // Test 3: Mint NFT (Success)
    #[test(creator = @genartory)]
    public entry fun test_mint_nft(creator: &signer) acquires Admin {
        init_module(creator);
        nft::create_collection(creator, b"Test Collection", b"https://example.com/collection", b"This is a test collection");
        let content_uri = string::utf8(b"ipfs://my_art_uri");
        let royalty_percentage = 10;
        nft::mint_nft(creator, b"Test Collection", b"ipfs://my_art_uri", b"Test NFT", royalty_percentage);

        // Ensure the NFT exists
        let token_data_id = TokenDataId {
            creator: @genartory,
            collection: string::utf8(b"Test Collection"),
            name: content_uri,
        };
        let token_id = token::create_token_id_raw(token_data_id, 1);
        assert!(nft::exists_at(token_id), 0);

        // Get the NFT resource
        let nft_resource = borrow_global<NFT>(@genartory, token_id);

        // Verify the NFT properties
        assert!(nft_resource.creator_address == signer::address_of(creator), 0);
        assert!(nft_resource.content_uri == content_uri, 0);
        assert!(nft_resource.royalty_percentage == royalty_percentage, 0);
        assert!(nft_resource.collection_name == string::utf8(b"Test Collection"), 0);
    }

    // Test 4: Mint NFT (Failure - Invalid Royalty)
    #[test(creator = @genartory)]
    public entry fun test_mint_nft_invalid_royalty(creator: &signer) acquires Admin {
        init_module(creator);
        let result = nft::mint_nft(creator, b"Test Collection", b"ipfs://my_art_uri", b"Invalid Royalty", 101);
        assert!(result == EINVALID_ROYALTY, result);
    }
   
    // Test 5: Update NFT (Success)
    #[test(creator = @genartory)]
    public entry fun test_update_nft(creator: &signer) acquires Admin {
        init_module(creator);
        nft::create_collection(creator, b"Test Collection", b"https://example.com/collection", b"This is a test collection");
        let content_uri = string::utf8(b"ipfs://my_art_uri");
        nft::mint_nft(creator, b"Test Collection", b"ipfs://my_art_uri", b"Test NFT", 10);

        let token_data_id = TokenDataId {
            creator: @genartory,
            collection: string::utf8(b"Test Collection"),
            name: content_uri,
        };
        let token_id = token::create_token_id_raw(token_data_id, 1);

        nft::update_nft(creator, token_id, Option::some(string::utf8(b"New Description")));
    }

    // Test 6: Update NFT (Failure - Not Owner)
    #[test(creator = @genartory, user = @0x123)]
    public entry fun test_update_nft_not_owner(creator: &signer, user: &signer) acquires Admin {
        init_module(creator);
        nft::create_collection(creator, b"Test Collection", b"https://example.com/collection", b"This is a test collection");
        let content_uri = string::utf8(b"ipfs://my_art_uri");
        nft::mint_nft(creator, b"Test Collection", b"ipfs://my_art_uri", b"Test NFT", 10);

        let token_data_id = TokenDataId {
            creator: @genartory,
            collection: string::utf8(b"Test Collection"),
            name: content_uri,
        };
        let token_id = token::create_token_id_raw(token_data_id, 1);

        let result = nft::update_nft(user, token_id, Option::some(string::utf8(b"New Description")));
        assert!(result == ENOT_TOKEN_OWNER, result);
    }


    // ... more test cases for other NFT functions (transfer, burn, etc.)
}
