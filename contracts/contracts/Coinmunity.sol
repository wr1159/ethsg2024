// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import { LinearBondingCurve } from "./LinearBondingCurve.sol";
import { SynthToken } from "./SynthToken.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Coinmunity is ERC721Holder {
	IERC20 private weth;

	event Launched(
		address indexed collectionAddress,
		address indexed curveAddress,
		address indexed tokenAddress
	);

	mapping(address => bool) public isCollectionLaunched; // check if nft collection is launched before
	mapping(address => address) public nftToTokenAddress; // nft ccollection address -> synth token address
	mapping(address => address) public nftToCurveAddress; // nft ccollection address -> synth token bonding curve address

	constructor(IERC20 _weth) {
		weth = _weth;
	}

	// launch the token & bonding curve
	function launch(
		string memory name,
		string memory symbol,
		address collectionAddress,
		uint256 initialPrice,
		uint256 priceIncrement,
		uint256 nftExchangeRate
	) public {
		require(
			!isCollectionLaunched[collectionAddress],
			"Collection has been launched"
		);

		// update states
		SynthToken st = new SynthToken(name, symbol, address(this)); // deploy ERC20 SynthToken
		LinearBondingCurve lbc = new LinearBondingCurve(
			weth,
			st,
			block.timestamp + 1000000000,
			1000000,
			priceIncrement,
			initialPrice,
			nftExchangeRate
		);
		address curveAddress = address(lbc);
		address tokenAddress = address(st);
		isCollectionLaunched[curveAddress] = true;
		nftToCurveAddress[collectionAddress] = curveAddress;
		nftToTokenAddress[collectionAddress] = tokenAddress;
		emit Launched(collectionAddress, curveAddress, tokenAddress);
	}

	function buyWithNative(address collectionAddress, uint256 amountIn) public {
		LinearBondingCurve lbc = LinearBondingCurve(
			getCurveFromCollection(collectionAddress)
		);
		lbc.purchase(msg.sender, amountIn);
	}

	function buyWithNFT(address collectionAddress, uint256 tokenId) public {
		LinearBondingCurve lbc = LinearBondingCurve(
			getCurveFromCollection(collectionAddress)
		);
		lbc.buyWithNFT(collectionAddress, tokenId);
	}

	function getCurveFromCollection(
		address collectionAddress
	) public view returns (address) {
		return nftToCurveAddress[collectionAddress];
	}

	function getTokenFromCollection(
		address collectionAddress
	) public view returns (address) {
		return nftToTokenAddress[collectionAddress];
	}
}
