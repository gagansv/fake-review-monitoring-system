// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReviewLedger {
    struct Review {
        bytes32 reviewHash;
        uint256 timestamp;
        uint8 aiScore;
    }

    mapping(bytes32 => Review) public reviews;

    function storeReview(bytes32 _hash, uint8 _aiScore) public {
        reviews[_hash] = Review(_hash, block.timestamp, _aiScore);
    }

    function verifyReview(bytes32 _hash) public view returns (bool) {
        return reviews[_hash].timestamp != 0;
    }
}
