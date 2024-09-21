// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import { BondingCurve } from "./BondingCurve.sol";
import { SynthToken } from "./SynthToken.sol";

contract Coinmunity is ERC721Holder {

    event Launched(address indexed collectionAddress, address indexed curveAddress, address indexed tokenAddress);

    mapping (address => bool) public isCollectionLaunched; // check if nft collection is launched before
    mapping (address => address) public nftToTokenAddress; // nft ccollection address -> synth token address
    mapping (address => address) public nftToCurveAddress; // nft ccollection address -> synth token bonding curve address

    // launch the token & bonding curve
    function launch(
        string memory name,
        string memory symbol,
        address collectionAddress,
        uint256 initialPrice, 
        uint256 priceIncrement,  
        uint256 nftExchangeRate) public {
        require(!isCollectionLaunched[collectionAddress], "Collection has been launched");

        // update states
        BondingCurve bc = new BondingCurve(name, symbol, initialPrice, priceIncrement, nftExchangeRate);
        address curveAddress = address(bc);
        address token = bc.token();
        isCollectionLaunched[curveAddress] = true;
        nftToCurveAddress[collectionAddress] = curveAddress;
        nftToTokenAddress[collectionAddress] = tokenAddress;
        emit Launched(collectionAddress, curveAddress, tokenAddress);
    }

    function buyWithNative(address collectionAddress) public payable {
        BondingCurve bc = BondingCurve(getCurveFromCollection(collectionAddress));
        bc.buyWithNative(msg.value, msg.sender);
    }

    function buyWithNFT(address collectionAddress, uint256 tokenId) public payable {
        BondingCurve bc = BondingCurve(getCurveFromCollection(collectionAddress));
        bc.buyWithNFT(collectionAddress, tokenId, msg.sender);
    }

    function getCurveFromCollection(address collectionAdress) public view returns (address) {
        return nftToCurveAddress[collectionAddress];
    }

    function getTokenFromCollection(address collectionAdress) public view returns (address) {
        return nftToTokenAddress[collectionAddress];
    }

}