// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { UD60x18, pow, ud, unwrap } from "@prb/math/src/UD60x18.sol";
import { ILinearCurve } from "./ILinearCurve.sol";

/// @title LinearCurve
/// @notice See the documentation in {ILinearCurve}
abstract contract LinearCurve is ILinearCurve {
	/*//////////////////////////////////////////////////////////////////////////
                                  PUBLIC STORAGE
    //////////////////////////////////////////////////////////////////////////*/

	/// @inheritdoc ILinearCurve
	UD60x18 public immutable override slope;

	/// @inheritdoc ILinearCurve
	UD60x18 public immutable override initialPrice;

	/*//////////////////////////////////////////////////////////////////////////
                                    CONSTRUCTOR
    //////////////////////////////////////////////////////////////////////////*/

	/// @dev Initializes the curve slope and the initial price.
	constructor(uint256 _slope, uint256 _initialPrice) {
		slope = ud(_slope);
		initialPrice = ud(_initialPrice);
	}

	/*//////////////////////////////////////////////////////////////////////////
                                   PUBLIC METHODS
    //////////////////////////////////////////////////////////////////////////*/

	/// @inheritdoc ILinearCurve
	function getPrice(
		uint256 currentSupply,
		uint256 newSupply
	) public view returns (uint256 price) {
		UD60x18 q1 = _calculateIntegralAtPoint(newSupply);
		UD60x18 q0 = _calculateIntegralAtPoint(currentSupply);

		price = unwrap(q1 - q0);
	}

	/// @inheritdoc ILinearCurve
	function getCurrentPrice(
		uint256 currentSupply
	) public view returns (uint256 price) {
		return unwrap(initialPrice.add(slope.mul(ud(currentSupply))));
	}

	/*//////////////////////////////////////////////////////////////////////////
                                   INTERNAL METHODS
    //////////////////////////////////////////////////////////////////////////*/

	/// @notice Calculates the integral at a specific point based on the linear curve formula
	/// @dev The integral (I) is calculated as follows:
	/// I(f(x) dx) = I(a + b*x) dx = I(a dx) + b*I(x dx) = a*x + (b*x^2)/2
	function _calculateIntegralAtPoint(
		uint256 x
	) internal view returns (UD60x18) {
		return
			initialPrice.mul(ud(x)).add(
				slope.mul(pow(ud(x), ud(2e18))).div(ud(2e18))
			);
	}
}
