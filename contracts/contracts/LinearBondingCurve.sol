// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IBondingCurve } from "./IBondingCurve.sol";

import { BondingCurve } from "./BondingCurve.sol";
import { LinearCurve } from "./LinearCurve.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { UD60x18, ud, unwrap } from "@prb/math/src/UD60x18.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract LinearBondingCurve is BondingCurve, LinearCurve {
	uint256 public nftExchangeRate;

	/**
	 * @notice linear bondingCurve constructor
	 * @param _acceptedToken ERC20 token in for this bonding curve
	 * @param _token ERC20 token sale out for this bonding curve
	 * @param _duration duration to sell
	 * @param _cap maximum token sold for this bonding curve to ensure security
	 * @param _slope slope for this bonding curve
	 * @param _initialPrice initial price for this bonding curve
	 */
	constructor(
		IERC20 _acceptedToken,
		IERC20 _token,
		uint256 _duration,
		uint256 _cap,
		uint256 _slope,
		uint256 _initialPrice,
		uint256 _nftExchangeRate
	)
		BondingCurve(_acceptedToken, _token, _duration, _cap)
		LinearCurve(_slope, _initialPrice)
		Ownable(msg.sender)
	{}

	/**
	 * @notice return current instantaneous bonding curve price
	 * @param tokenSupply the current amount of acceptable token purchased
	 * @return amountOut price reported
	 * @dev just use only one helper function from LinearCurve
	 *
	 */
	function getCurrentPrice(
		UD60x18 tokenSupply
	) external view override returns (UD60x18) {
		return getLinearInstantaneousPrice(tokenSupply);
	}

	/**
	 * @notice return amount of token sale received after a bonding curve purchase
	 * @param tokenAmountIn the amount of underlying used to purchase
	 * @return balanceAmountOut the amount of sale token received
	 * @dev retained poolBalance (i.e. after including the next set of added token supply) minus current poolBalance
	 *
	 */
	function calculatePurchaseAmountOut(
		UD60x18 tokenAmountIn
	) public view override returns (UD60x18 balanceAmountOut) {
		return
			getPoolBalance(totalPurchased.add(tokenAmountIn)).sub(
				getPoolBalance(totalPurchased)
			);
	}

	function buyWithNFT(address collectionAddress, uint256 tokenId) public {
		IERC721 nft = IERC721(collectionAddress);
		require(nft.ownerOf(tokenId) == msg.sender, "You don't own this NFT");
		nft.safeTransferFrom(msg.sender, address(this), tokenId);

		UD60x18 balanceAmountOut = calculatePurchaseAmountOut(
			ud(nftExchangeRate)
		);
		SafeERC20.safeTransfer(token, msg.sender, unwrap(balanceAmountOut));
	}
}
