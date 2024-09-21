// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./BondingCurve.sol";
import "./SynthToken.sol";

contract Coinmunity is ERC721Holder {

    event Launched(address indexed collectionAddress, address indexed curveAddress);

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
        uint256 maxSupply, 
        uint256 nftExchangeRate) public {
        require(!isCollectionLaunched[collectionAddress], "Collection has been launched");

        // update states
        BondingCurve bc = new BondingCurve(name, symbol, initialPrice, priceIncrement, maxSupply, nftExchangeRate);
        address curveAddress = address(bc);
        isCollectionLaunched[curveAddress] = true;
        nftToCurveAddress[collectionAddress] = curveAddress;
        emit Launched(collectionAddress, curveAddress);
    }

    // buy with token


    // buy with nft


}