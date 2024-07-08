// backend/sources/modules/error.move

module genartory::error {

    // General Errors
    const ENOT_IMPLEMENTED: u64 = 0;
    const EINVALID_ARGUMENT: u64 = 1;
    const EINVALID_STATE: u64 = 2;
    const EPERMISSION_DENIED: u64 = 3;

    // NFT Module Errors
    const EINVALID_ROYALTY: u64 = 101;
    const ENOT_NFT_OWNER: u64 = 102; // Not an NFT owner error code
    const ENFT_ALREADY_EXISTS: u64 = 103;
    const EINVALID_TOKEN_METADATA: u64 = 104;

    // Marketplace Module Errors
    const ENFT_NOT_LISTED: u64 = 201;
    const ELISTING_NOT_ACTIVE: u64 = 202;
    const EALREADY_LISTED: u64 = 203;
    const ELOW_PRICE: u64 = 204;
    const ELOW_BID: u64 = 205;
    const EAUCTION_NOT_ENDED: u64 = 206;
    const EINVALID_LISTING_TYPE: u8 = 207;
    const EINVALID_AUCTION_END_TIME: u64 = 208;
    const EINVALID_BID_AMOUNT: u64 = 209;

    // DAO Module Errors
    const ENOT_ENOUGH_TOKENS: u64 = 301;
    const EPROPOSAL_NOT_FOUND: u64 = 302;
    const EVOTING_NOT_STARTED: u64 = 303;
    const EVOTING_ENDED: u64 = 304;
    const EALREADY_VOTED: u64 = 305;
    const EQUORUM_NOT_REACHED: u64 = 306;
    const EPROPOSAL_NOT_PASSED: u64 = 307;
    const EINVALID_PROPOSAL_DATA: u64 = 308;
}

