import { expect } from "chai"
import { parseEther } from "ethers"
import { deployments, ethers, getNamedAccounts } from "hardhat"

describe("Coinmunity", () => {
	const setupFixture = deployments.createFixture(async () => {
		await deployments.fixture()
		const signers = await getNamedAccounts()

		const nftname = "MockERC721"
		const nftsymbol = "Noun"
		const baseURI = "ipfs://base-uri/"
		const contractURI = "ipfs://contract-uri"
		const owner = signers.deployer

		const erc721contract = await ethers.deployContract(
			"MockERC721",
			[nftname, nftsymbol, baseURI, contractURI, owner],
			await ethers.getSigner(signers.deployer)
		)
		const erc721contractAddress = await erc721contract.getAddress()
		await erc721contract.safeMint(signers.user)

		const name = "Coinmunity"
		const symbol = "CMY"
		const collectionAddress = erc721contractAddress
		const initialPrice = parseEther("0.01")
		const priceIncrement = parseEther("0.01")
		const nftExchangeRate = parseEther("0.01")

		const coinmunityContract = await ethers.deployContract("Coinmunity", await ethers.getSigner(signers.deployer))
		const coinmunityContractAddress = await coinmunityContract.getAddress()
		await coinmunityContract.launch(name, symbol, collectionAddress, initialPrice, priceIncrement, nftExchangeRate)

		return {
			erc721contract,
			erc721contractAddress,
			coinmunityContract,
			coinmunityContractAddress,
			deployer: signers.deployer,
			user: signers.user,
			accounts: await ethers.getSigners(),
		}
	})

	describe("Buy token with native", () => {
		it("Should mint token to buyer", async () => {
			const { erc721contractAddress, coinmunityContract, user } = await setupFixture()

			const synthTokenAddress = await coinmunityContract.getTokenFromCollection(erc721contractAddress)
			const synthTokenContract = await ethers.getContractAt("ContinuousLinearToken", synthTokenAddress)
			const price = await synthTokenContract.priceForAmount(parseEther("0.01"))
			await coinmunityContract.buyWithNative(erc721contractAddress, parseEther("0.01"), {
				value: price,
			})

			const userBalance = await synthTokenContract.balanceOf(user)
			expect(userBalance).to.greaterThan(parseEther("0"))
		})
	})

	describe("Buy token with nft", () => {
		it("Should mint token to buyer", async () => {
			const { erc721contract, erc721contractAddress, coinmunityContract, coinmunityContractAddress, user } =
				await setupFixture()

			const synthTokenAddress = await coinmunityContract.getTokenFromCollection(erc721contractAddress)
			const synthTokenContract = await ethers.getContractAt("MockERC20", synthTokenAddress)

			await erc721contract.approve(coinmunityContractAddress, 1)
			await coinmunityContract.buyWithNFT(erc721contractAddress, 1)

			const userBalance = await synthTokenContract.balanceOf(user)
			expect(userBalance).to.greaterThan(parseEther("0"))
		})
	})
})
