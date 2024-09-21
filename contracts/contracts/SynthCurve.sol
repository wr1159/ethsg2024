// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { LinearBondingCurve } from "./LinearBondingCurve.sol";
import { SynthToken } from "./SynthToken.sol";

contract SynthCurve is LinearBondingCurve {
    
    constructor(
        IERC20 _acceptedToken,
        IERC20 _token,
        uint256 _initialPrice,
        uint256 _priceIncrement,
        uint256 _nftExchangeRate
    ) LinearBondingCurve(_acceptedToken, _token, block.timestamp + 1000000000, 1000000, _priceIncrement, _initialPrice) {
    }

    

    function buyWithNative(uint256 nativeAmount, address buyer) public {
        uint256 tokensToMint = getTokenAmount(nativeAmount);

    }

    function buyWithNFT(address collectionAddress, uint256 tokenId, address buyer) public {
        IERC721 nft = IERC721(collectionAddress);
        require(nft.ownerOf(tokenId) == buyer, "You don't own this NFT");
        
        nft.safeTransferFrom(buyer, address(this), tokenId);
        
        uint256 nativeEquivalent = nftExchangeRate; // 1PP <> 1 ether
        buyWithNative(nativeEquivalent, buyer);
    }

    // Helper functions
    function getTokenAmount(uint256 nativeAmount) public view returns (uint256) {
        
    }
}