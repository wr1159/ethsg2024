import { parseEther } from "ethers"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployer, owner } = await hre.getNamedAccounts()

	await hre.deployments.deploy("MockERC721", {
		from: deployer,
		args: ["MockERC721", "Noun", "ipfs://base-uri/", "ipfs://contract-uri", owner],
		log: true,
	})
	const erc721Deployment = await hre.deployments.get("MockERC721")

	await hre.deployments.deploy("Coinmunity", {
		from: deployer,
		args: [],
		log: true,
	})

	// mint nfts to user
	await hre.deployments.execute("MockERC721", { from: deployer, log: true }, "safeMint", deployer)
	await hre.deployments.execute("MockERC721", { from: deployer, log: true }, "safeMint", deployer)
	await hre.deployments.execute("MockERC721", { from: deployer, log: true }, "safeMint", deployer)

	const name = "Coinmunity"
	const symbol = "CMY"
	const initialPrice = parseEther("0.01")
	const priceIncrement = parseEther("0.01")
	const nftExchangeRate = parseEther("0.01")
	await hre.deployments.execute(
		"Coinmunity",
		{ from: deployer, log: true },
		"launch",
		name,
		symbol,
		erc721Deployment.address,
		initialPrice,
		priceIncrement,
		nftExchangeRate,
		"0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e",
		"0xa0a1abcdae1a2a4a2ef8e9113ff0e02dd81dc0c6",
		"0x8fade66b79cc9f707ab26799354482eb93a5b7dd"
	)
}
export default func
