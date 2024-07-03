module genartory::marketplace_tests {
    use std::signer;
    use std::vector;
    use aptos_std::token::TokenId;
    use aptos_framework::account;
    use aptos_framework::coin::{CoinStore, deposit};
    use genartory::nft;
    use genartory::token;
    use genartory::marketplace::{Self, Marketplace, Listing};

    #[test(seller = @0x123, buyer = @0x456)]
    fun test_list_and_buy_nft(seller: signer, buyer: signer) acquires NFT, Marketplace {
        let seller_addr = signer::address_of(&seller);
        let buyer_addr = signer::address_of(&buyer);

        // Initialize modules
        token::setup(&seller);
        nft::init_module(&seller);
        marketplace::init_module(&seller);

        // Mint an NFT to the seller
        let collection_name = vector<u8>::from("Test Collection");
        let content_uri = vector<u8>::from("ipfs://my_art_uri");
        nft::create_collection(
            &seller,
            collection_name,
            vector<u8>::from("ipfs://collection_uri"),
            vector<u8>::from("A description of my awesome collection"),
        );

        nft::mint_nft(&seller, collection_name, content_uri, 10);
        let token_data_id = TokenDataId {
            creator: @genartory,
            collection: collection_name,
            name: content_uri,
        };
        let nft_id = token::create_token_id_raw(token_data_id, 1);
        // Mint coins for the buyer
        token::mint(&seller, buyer_addr, 1000); // Mint 1000 GenArtoryCoins to the buyer

        // List the NFT
        let price = 500;
        marketplace::list_nft(&seller, nft_id, price);

        // Check if listing is active
        let marketplace = borrow_global<Marketplace>(@genartory);
        let listing = table::borrow(&marketplace.listings, nft_id);
        assert!(listing.is_active, 0);

        // Buy the NFT
        marketplace::buy_nft(&buyer, nft_id);

        // Check if the NFT has been transferred to the buyer
        assert!(!nft::exists_at(nft_id), 0); // NFT shouldn't exist in the seller's account

        // Check if the listing is inactive
        let listing = table::borrow(&marketplace.listings, nft_id);
        assert!(!listing.is_active, 0);

        // Check if the seller received the payment
        let seller_coin_store = CoinStore::borrow<GenArtoryCoin>(seller_addr);
        assert!(seller_coin_store.coin.value >= price, 0);
    }

    // ... other test cases for cancel_listing, etc.
}
