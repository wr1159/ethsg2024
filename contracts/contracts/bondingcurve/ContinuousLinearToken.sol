// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { LinearCurve } from "./LinearCurve.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20Plugins } from "@1inch/token-plugins/contracts/ERC20Plugins.sol";
import { ReverseClaimer } from "../ens/reverseRegistrar/ReverseClaimer.sol";
import { ENS } from "../ens/registry/ENS.sol";

/// @title ContinuousLinearToken
contract ContinuousLinearToken is
	ERC20Plugins,
	LinearCurve,
	Ownable,
	ReverseClaimer
{
	error InsufficientPaymentAmount();
	error SaleFailed();

	constructor(
		string memory _name,
		string memory _symbol,
		uint256 _slope,
		uint256 _initialPrice,
		uint256 _maxPlugins,
		uint256 _pluginCallGasLimit,
		ENS _ens
	)
		ERC20(_name, _symbol)
		LinearCurve(_slope, _initialPrice)
		Ownable(msg.sender)
		ERC20Plugins(_maxPlugins, _pluginCallGasLimit)
		ReverseClaimer(_ens, msg.sender) // coinmuity is the owner
	{}

	function buy(address to, uint256 amount) public payable {
		// Calculates the price that must be paid for `amount` of tokens
		uint256 totalSupply = totalSupply();
		uint256 price = getPrice(totalSupply, totalSupply + amount);

		// Checks: the amount of native token is high enough to pay for the requested amount of tokens
		if (msg.value < price) {
			revert InsufficientPaymentAmount();
		}

		// Interactions: mint the purchased amount of tokens
		mint(to, amount);
	}

	function sell(uint256 amount) public {
		// Store the current total supply
		uint256 totalSupply = totalSupply();

		// Checks, Effects, Interactions: burn the sold amount of tokens
		_burn({ account: msg.sender, value: amount });

		// Calculate the amount of native token (ETH) to receive
		uint256 price = getPrice(totalSupply - amount, totalSupply);

		// Interactions: pay the seller
		(bool success, ) = payable(msg.sender).call{ value: price }("");
		if (!success) revert SaleFailed();
	}

	function mint(address account, uint256 amount) public onlyOwner {
		_mint(account, amount);
	}

	function priceForAmount(uint256 amount) public view returns (uint256) {
		uint256 totalSupply = totalSupply();
		return getPrice(totalSupply, totalSupply + amount);
	}
}
