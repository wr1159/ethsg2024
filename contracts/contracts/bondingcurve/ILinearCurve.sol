// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { UD60x18 } from "@prb/math/src/UD60x18.sol";

/// @title ILinearCurve
/// @notice Contract representing a linear bounding curve, following the next formula:
///
/// f(x) = a + b*x, where:
/// a: the initial price
/// b: the slope of the curve
interface ILinearCurve {
	/*//////////////////////////////////////////////////////////////////////////
                                  CONSTANT METHODS
    //////////////////////////////////////////////////////////////////////////*/

	/// @notice Represents the rate at which the token price changes as the token supply increases or decreases.
	function slope() external view returns (UD60x18);

	/// @notice The initial price of the token
	function initialPrice() external view returns (UD60x18);

	/// @notice Calculates the new price of the token based on the current and the new supply.
	///
	/// Notes:
	/// - Since the bonding curve is a linear curve, the new price will be the integral taken from q0 to q1
	/// where q1 represents the new supply and represents the current supply.
	///
	/// @param currentSupply The current amount of tokens in circulation.
	/// @param newSupply The new amount of tokens that will be in circulation.
	/// @return price The price that must be paid to mint newSupply - currentSupply amount of tokens.
	function getPrice(
		uint256 currentSupply,
		uint256 newSupply
	) external view returns (uint256);

	/// @notice Calculates the current price of the token based on the total current supply.
	/// @param currentSupply The total current supply of the token
	/// @return price The current price of the token
	function getCurrentPrice(
		uint256 currentSupply
	) external view returns (uint256 price);
}
