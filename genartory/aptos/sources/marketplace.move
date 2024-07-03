module genartory::marketplace {
    use std::signer;
    use std::vector;
    use aptos_std::token::{Token, TokenId};
    use aptos_framework::coin::Coin;
    use aptos_framework::account;
    use genartory::nft::{Self, NFT};

    // Resource for Listings
    struct Listing has key, store {
        nft_id: TokenId,
        seller_address: address,
        price: u64, // Price in your chosen currency (e.g., Aptos Coin)
        is_active: bool, // Indicates whether the listing is still available
    }

    // Table for Managing Listings
    struct Marketplace has key {
        listings: table<TokenId, Listing>
    }

    // Events for Tracking Marketplace Activities
    struct ListNFTEvent has copy, drop, store {
        nft_id: TokenId,
        seller_address: address,
        price: u64
    }

    struct BuyNFTEvent has copy, drop, store {
        nft_id: TokenId,
        buyer_address: address,
        seller_address: address,
        price: u64
    }

    // Error Codes
    const ENFT_NOT_FOUND: u64 = 0;
    const ELISTING_NOT_ACTIVE: u64 = 1;
    const EALREADY_LISTED: u64 = 2;
    const ELOW_PRICE: u64 = 3;

    // Functions

    public entry fun init_module(account: &signer) {
        move_to(account, Marketplace {
            listings: table::new(),
        });
    }

    public entry fun list_nft(
        account: &signer,
        nft_id: TokenId,
        price: u64,
    ) acquires NFT {
        let seller_address = signer::address_of(account);

        // Ensure the NFT exists
        assert!(nft::exists_at(nft_id), ENFT_NOT_FOUND);

        // Ensure NFT owner
        let nft = borrow_global<NFT>(seller_address, nft_id);
        assert!(nft.creator_address == seller_address, ENOT_ADMIN);
        
        // Ensure the NFT is not already listed
        let marketplace = borrow_global_mut<Marketplace>(@genartory);
        assert!(!table::contains(marketplace.listings, nft_id), EALREADY_LISTED);

        // Ensure price is reasonable (add your own logic)
        assert!(price > 0, ELOW_PRICE);

        // Create a Listing
        let listing = Listing {
            nft_id,
            seller_address,
            price,
            is_active: true,
        };
        table::add(marketplace.listings, nft_id, listing);

        // Emit Event
        event::emit(ListNFTEvent { nft_id, seller_address, price });
    }
    
    // ... additional functions for buy_nft, cancel_listing, etc.
     public entry fun buy_nft(buyer: &signer, nft_id: TokenId) acquires NFT, Listing {
        let buyer_address = signer::address_of(buyer);
        let marketplace = borrow_global_mut<Marketplace>(@genartory);

        // Ensure the NFT is listed and active
        assert!(table::contains(marketplace.listings, nft_id), ELISTING_NOT_ACTIVE);
        let listing = table::borrow_mut(marketplace.listings, nft_id);
        assert!(listing.is_active, ELISTING_NOT_ACTIVE);
        
        //Ensure Buyer has sufficient funds
        let coin_store = account::balance<Coin>(buyer_address);
        assert!(coin_store > listing.price, ELOW_PRICE);

        // Transfer the NFT
        let seller_address = listing.seller_address;
        let nft = move_from<NFT>(seller_address, nft_id);
        token::transfer(account, buyer_address, nft_id);
        account::deposit(seller_address, Coin::withdraw(buyer_address, listing.price));

        // Deactivate Listing
        listing.is_active = false;

        // Emit Event
        event::emit(BuyNFTEvent { nft_id, buyer_address, seller_address, price: listing.price });
    }

    public entry fun cancel_listing(account: &signer, nft_id: TokenId) acquires NFT, Listing {
        let seller_address = signer::address_of(account);
        let marketplace = borrow_global_mut<Marketplace>(@genartory);

        // Ensure the NFT is listed and owned by the seller
        assert!(table::contains(marketplace.listings, nft_id), ENFT_NOT_FOUND);
        let listing = table::borrow_mut(marketplace.listings, nft_id);
        assert!(listing.seller_address == seller_address, ENOT_ADMIN);
        
        // Ensure NFT owner
        let nft = borrow_global<NFT>(seller_address, nft_id);
        assert!(nft.creator_address == seller_address, ENOT_ADMIN);

        // Deactivate Listing
        listing.is_active = false;
        // Optionally, you could remove the listing from the table entirely.
    }

    // ... (Unit Tests for both nft.move and marketplace.move)

    #[test_only]
    public fun test_buy_nft() {
        // ... (set up test environment, create NFT and listing)
        buy_nft(buyer, nft_id);
        // ... (assert that NFT is transferred, listing is inactive, etc.)
    }

    #[test_only]
    public fun test_cancel_listing() {
        // ... (set up test environment, create NFT and listing)
        cancel_listing(seller, nft_id);
        // ... (assert that listing is inactive)
    }
}

