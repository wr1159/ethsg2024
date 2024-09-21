// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract SynthToken is ERC20, ERC20Burnable, Ownable {
	constructor(
		uint256 initialSupply,
		string memory name,
		string memory symbol,
		address initialOwner
	) ERC20(name, symbol) Ownable(initialOwner) {
		_mint(msg.sender, initialSupply);
	}
}
