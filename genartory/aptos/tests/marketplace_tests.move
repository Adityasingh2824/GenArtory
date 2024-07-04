module genartory::marketplace_tests {
    use std::signer;
    use std::vector;
    use aptos_std::token::TokenId;
    use aptos_framework::coin::{Coin, mint};
    use aptos_framework::timestamp;
    use genartory::nft;
    use genartory::token;
    use genartory::marketplace::{Self, Marketplace, Listing, ENOT_ADMIN, ENFT_NOT_FOUND, EALREADY_LISTED, ELOW_PRICE, ELOW_BID, EAUCTION_NOT_ENDED, EINVALID_LISTING_TYPE};

    // Helper Functions

    #[test_only]
    fun init_modules(account: &signer) {
        timestamp::set_time_has_started_for_testing(account);
        token::initialize(account, b"GenArtoryCoin", b"GAC", 8);
        nft::initialize(account);
        marketplace::init_module(account);
        // Mint coins for the account
        let coins = mint<Coin>(100000000, account); // Mint 1000 GAC (8 decimals)
        account::deposit(signer::address_of(account), coins);
    }

    #[test_only]
    fun create_dummy_nft(account: &signer): TokenId acquires Admin {
        let collection_name = vector<u8>::from("Test Collection");
        let content_uri = vector<u8>::from("ipfs://my_art_uri");
        let nft_name = vector<u8>::from("Test NFT");
        nft::create_collection(account, collection_name, content_uri, vector<u8>::from("Test Collection Description"));
        nft::mint_nft(account, collection_name, content_uri, nft_name, 10);

        let token_data_id = TokenDataId {
            creator: @genartory,
            collection: string::utf8(collection_name),
            name: string::utf8(content_uri),
        };
        token::create_token_id_raw(token_data_id, 1)
    }

    // Fixed Price Listing Tests

    #[test(seller = @0x123, buyer = @0x456)]
    public entry fun test_fixed_price_listing_and_buy(
        seller: &signer, buyer: &signer
    ) acquires NFT, Marketplace {
        init_modules(seller);
        let nft_id = create_dummy_nft(seller);
        token::mint(seller, signer::address_of(buyer), 1000); // Mint tokens to buyer
        marketplace::list_nft(seller, nft_id, 500, 0, Option::none()); // Fixed price listing

        // buyer buys nft
        marketplace::buy_nft(buyer, nft_id);

        // assert listing inactive and buyer has nft
        let marketplace_resource = borrow_global<Marketplace>(@genartory);
        assert!(!table::borrow(&marketplace_resource.listings, nft_id).is_active, ELISTING_NOT_ACTIVE);
        assert!(token::owns<NFT>(signer::address_of(buyer), nft_id), ENFT_NOT_FOUND);

    }
    
    #[test(seller = @0x123)]
    public entry fun test_cancel_listing(seller: &signer) acquires Marketplace, NFT {
        init_modules(seller);
        let nft_id = create_dummy_nft(seller);
        marketplace::list_nft(seller, nft_id, 500, 0, Option::none());
        marketplace::cancel_listing(seller, nft_id);
        // assert listing inactive
        let marketplace_resource = borrow_global<Marketplace>(@genartory);
        assert!(!table::borrow(&marketplace_resource.listings, nft_id).is_active, ELISTING_NOT_ACTIVE);
    }
    
    #[test(seller = @0x123)]
    public entry fun test_list_nft_fail_not_owner(seller: &signer) acquires NFT {
        init_modules(seller);
        let nft_id = create_dummy_nft(seller);
        let nft = borrow_global_mut<NFT>(signer::address_of(seller), nft_id);
        nft.creator_address = @0x1;
        let result = marketplace::list_nft(seller, nft_id, 500, 0, Option::none());
        assert!(result == ENOT_ADMIN, result);
    }

    #[test(seller = @0x123, user = @0x456)]
    public entry fun test_list_nft_fail_already_listed(seller: &signer, user: &signer) acquires Marketplace, NFT {
        init_modules(seller);
        let nft_id = create_dummy_nft(seller);
        token::mint(seller, signer::address_of(user), 1000); // Mint tokens to user

        marketplace::list_nft(seller, nft_id, 500, 0, Option::none());
        let result = marketplace::list_nft(seller, nft_id, 600, 0, Option::none());

        assert!(result == EALREADY_LISTED, result);
    }
    
    #[test(seller = @0x123)]
    public entry fun test_list_nft_fail_low_price(seller: &signer) acquires NFT {
        init_modules(seller);
        let nft_id = create_dummy_nft(seller);
        let result = marketplace::list_nft(seller, nft_id, 0, 0, Option::none());
        assert!(result == ELOW_PRICE, result);
    }

    // Auction Listing Tests
    #[test(seller = @0x123, bidder1 = @0x456, bidder2 = @0x789)]
    public entry fun test_auction_listing_and_bid(
        seller: &signer, bidder1: &signer, bidder2: &signer
    ) acquires NFT, Marketplace {
        init_modules(seller);
        let nft_id = create_dummy_nft(seller);

        token::mint(seller, signer::address_of(bidder1), 1000); // Mint tokens to bidder1
        token::mint(seller, signer::address_of(bidder2), 2000); // Mint tokens to bidder2

        let auction_end_time = timestamp::now_seconds() + 3600; // 1 hour from now
        marketplace::list_nft(seller, nft_id, 100, 1, Option::some(auction_end_time));

        // Place bids
        marketplace::place_bid(bidder1, nft_id, 500);
        marketplace::place_bid(bidder2, nft_id, 1200);

        // Check highest bid and bidder
        let marketplace_resource = borrow_global<Marketplace>(@genartory);
        let listing = table::borrow(&marketplace_resource.listings, nft_id);
        assert!(listing.highest_bid == 1200, 0);
        assert!(listing.highest_bidder == signer::address_of(bidder2), 0);

        // simulate auction ending
        timestamp::update_global_time_for_testing(seller, auction_end_time + 1); // Move 1 second past the end time
    }
    
    #[test(seller = @0x123, bidder = @0x456)]
    public entry fun test_place_bid_fail_low_bid(
        seller: &signer, bidder: &signer
    ) acquires NFT, Marketplace {
        init_modules(seller);
        let nft_id = create_dummy_nft(seller);

        token::mint(seller, signer::address_of(bidder), 1000); // Mint tokens to bidder
        marketplace::list_nft(seller, nft_id, 100, 1, Option::some(timestamp::now_seconds() + 3600));

        let result = marketplace::place_bid(bidder, nft_id, 50);
        assert!(result == ELOW_BID, result);
    }
    
    #[test(seller = @0x123, bidder = @0x456)]
    public entry fun test_place_bid_fail_ended_auction(
        seller: &signer, bidder: &signer
    ) acquires NFT, Marketplace {
        init_modules(seller);
        let nft_id
#[test(seller = @0x123, bidder = @0x456)]
    public entry fun test_place_bid_fail_ended_auction(
        seller: &signer, bidder: &signer
    ) acquires NFT, Marketplace {
        init_modules(seller);
        let nft_id = create_dummy_nft(seller);

        token::mint(seller, signer::address_of(bidder), 1000); // Mint tokens to bidder

        let auction_end_time = timestamp::now_seconds() + 3600; // 1 hour from now
        marketplace::list_nft(seller, nft_id, 100, 1, Option::some(auction_end_time));

        // Simulate auction ending
        timestamp::update_global_time_for_testing(seller, auction_end_time + 1); // Move 1 second past the end time

        let result = marketplace::place_bid(bidder, nft_id, 500);
        assert!(result == EAUCTION_NOT_ENDED, result);
    }

    #[test(seller = @0x123, buyer = @0x456)]
    public entry fun test_fixed_price_listing_fail_insufficient_balance(
        seller: &signer, buyer: &signer
    ) acquires NFT, Marketplace {
        init_modules(seller);
        let nft_id = create_dummy_nft(seller);

        marketplace::list_nft(seller, nft_id, 500, 0, Option::none());
        let result = marketplace::buy_nft(buyer, nft_id);

        assert!(result == ELOW_PRICE, result);
    }


    // Additional Test Cases
    // Test 7: Buy NFT (Success with royalties paid to creator)
    // Test 8: Buy NFT (Failure - NFT not listed for sale)
    // Test 9: Update Listing (Success)
    // Test 10: Update Listing (Failure - NFT not listed)
    // Test 11: Update Listing (Failure - User is not the owner)
    // Test 12: Update Listing (Failure - Invalid new price)
    // ... Add more tests for error handling in place_bid, and other cases
}
