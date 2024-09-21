// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import { ContinuousLinearToken } from "./bondingcurve/ContinuousLinearToken.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { ENS } from "./ens/registry/ENS.sol";
import { IReverseRegistrar } from "./ens/reverseRegistrar/IReverseRegistrar.sol";

contract Coinmunity is ERC721Holder {
	uint256 public nftExchangeRate;

	event Launched(
		address indexed collectionAddress,
		address indexed tokenAddress
	);

	mapping(address => bool) public isCollectionLaunched; // check if nft collection is launched before
	mapping(address => address) public nftToTokenAddress; // nft ccollection address -> synth token address

	// launch the token & bonding curve
	function launch(
		string memory name,
		string memory symbol,
		address collectionAddress,
		uint256 initialPrice,
		uint256 priceIncrement,
		uint256 _nftExchangeRate,
		ENS ens,
		address reverseRegistrar,
		address publicResolver
	) public {
		require(
			!isCollectionLaunched[collectionAddress],
			"Collection has been launched"
		);

		nftExchangeRate = _nftExchangeRate;
		ContinuousLinearToken clt = new ContinuousLinearToken(
			name,
			symbol,
			priceIncrement,
			initialPrice,
			5, 
			50000,
			ens
		);
		address tokenAddress = address(clt);
		_registerName(tokenAddress, reverseRegistrar, publicResolver, name);
		isCollectionLaunched[collectionAddress] = true;
		nftToTokenAddress[collectionAddress] = tokenAddress;
		emit Launched(collectionAddress, tokenAddress);
	}

	function buyWithNative(
		address collectionAddress,
		uint256 amountIn
	) public payable {
		ContinuousLinearToken clt = ContinuousLinearToken(
			getTokenFromCollection(collectionAddress)
		);
		clt.buy{ value: msg.value }(msg.sender, amountIn);
	}

	function buyWithNFT(address collectionAddress, uint256 tokenId) public {
		IERC721 nft = IERC721(collectionAddress);
		require(nft.ownerOf(tokenId) == msg.sender, "You don't own this NFT");
		nft.safeTransferFrom(msg.sender, address(this), tokenId);
		ContinuousLinearToken clt = ContinuousLinearToken(
			getTokenFromCollection(collectionAddress)
		);
		clt.mint(msg.sender, nftExchangeRate);
	}

	function getTokenFromCollection(
		address collectionAddress
	) public view returns (address) {
		return nftToTokenAddress[collectionAddress];
	}

	function _registerName(
		address addr,
		address reverseRegistrar,
		address publicResolver,
		string memory name
	) internal {
		IReverseRegistrar reverseRegistrarContract = IReverseRegistrar(reverseRegistrar);
		bytes memory concatenatedBytes = abi.encodePacked(name, ".team");
        string memory concatenatedName = string(concatenatedBytes);
		reverseRegistrarContract.setNameForAddr(addr, address(this), publicResolver, concatenatedName); // "Coinmunity.team"
	}
}
