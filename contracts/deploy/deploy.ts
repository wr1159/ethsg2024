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
		nftExchangeRate
	)
}
export default func
