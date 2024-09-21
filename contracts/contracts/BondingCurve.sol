// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { SynthToken } from "./SynthToken.sol";

contract BondingCurve is Ownable {

    SynthToken public token;
    uint256 public initialPrice;
    uint256 public currentPrice;
    uint256 public priceIncrement;
    uint256 public nftExchangeRate;
    
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialPrice,
        uint256 _priceIncrement,
        uint256 _nftExchangeRate
    ) Ownable(msg.sender) {
        token = new SynthToken( _name, _symbol, address(this)); // deploy ERC20 SynthToken
        initialPrice = _initialPrice;
        currentPrice = _initialPrice;
        priceIncrement = _priceIncrement; // fixed gradient: every 1 native (eth) added how much does price change
        nftExchangeRate = _nftExchangeRate; // fixed ex/rate for nft <> native
    }

    function buyWithNative(uint256 nativeAmount, address buyer) public {
        uint256 tokensToBuy = getTokenAmount(nativeAmount);
        require(tokensToBuy > 0, "Not enough ETH sent");

        token.approve(address(this), tokensToBuy); 
        token.transfer(buyer, tokensToBuy); // need to change to mint on the go
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
        // to be implemented
    }

    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    // Getter functions
    function getInitialPrice() public view returns (uint256) {
        return initialPrice;
    }

    function getPriceIncrement() public view returns (uint256) {
        return priceIncrement;
    }

    function getNftExchangeRate() public view returns (uint256) {
        return nftExchangeRate;
    }

    // Setter functions (onlyOwner)
    function setInitialPrice(uint256 _newInitialPrice) public onlyOwner {
        initialPrice = _newInitialPrice;
    }

    function setPriceIncrement(uint256 _newPriceIncrement) public onlyOwner {
        priceIncrement = _newPriceIncrement;
    }

    function setNftExchangeRate(uint256 _newRate) public onlyOwner {
        nftExchangeRate = _newRate;
    }

    // // Withdraw functions
    // function withdraw() public onlyOwner {
    //     payable(owner()).transfer(address(this).balance);
    // }

    // function withdrawNFT(address nftContract, uint256 tokenId) public onlyOwner {
    //     IERC721(nftContract).safeTransferFrom(address(this), owner(), tokenId);
    // }
}