import { expect } from "chai"
import { parseEther } from "ethers"
import { deployments, ethers, getNamedAccounts } from "hardhat"

const WETH_ADDRESS = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"

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

		const coinmunityContract = await ethers.deployContract(
			"Coinmunity",
			[WETH_ADDRESS],
			await ethers.getSigner(signers.deployer)
		)
		const coinmunityContractAddress = await coinmunityContract.getAddress()
		await coinmunityContract.launch(name, symbol, collectionAddress, initialPrice, priceIncrement, nftExchangeRate)

		const wethContract = await ethers.getContractAt("IWETH", WETH_ADDRESS)
		await wethContract.deposit({ value: parseEther("100") })
		const wethContractAddress = await wethContract.getAddress()

		return {
			erc721contract,
			erc721contractAddress,
			coinmunityContract,
			coinmunityContractAddress,
			wethContractAddress,
			deployer: signers.deployer,
			user: signers.user,
			accounts: await ethers.getSigners(),
		}
	})

	describe("Buy token with native", () => {
		it("Should mint token to buyer", async () => {
			const { erc721contractAddress, coinmunityContract, coinmunityContractAddress, wethContractAddress, user } =
				await setupFixture()

			const lbcContractAddress = await coinmunityContract.getCurveFromCollection(erc721contractAddress)
			const wethContract = await ethers.getContractAt("ERC20", wethContractAddress)
			await wethContract.approve(lbcContractAddress, parseEther("1000000"))
			const userBalance = await wethContract.balanceOf(user)
			await coinmunityContract.buyWithNative(erc721contractAddress, parseEther("0.01"))

			const synthTokenAddress = await coinmunityContract.getTokenFromCollection(erc721contractAddress)
			const synthTokenContract = await ethers.getContractAt("MockERC20", synthTokenAddress)
			const balance = await synthTokenContract.balanceOf(user)
			expect(balance).to.equal(1)

			expect(await ethers.provider.getBalance(coinmunityContract)).to.equal(parseEther("0.01"))
		})
	})

	describe("Buy token with nft", () => {
		it("Should mint token to buyer", async () => {
			const { erc721contract, erc721contractAddress, coinmunityContract, coinmunityContractAddress, user } =
				await setupFixture()

			const lbcContractAddress = await coinmunityContract.getCurveFromCollection(erc721contractAddress)
			await erc721contract.approve(lbcContractAddress, 1)
			await coinmunityContract.buyWithNFT(erc721contractAddress, 1)

			const synthTokenAddress = await coinmunityContract.getTokenFromCollection(erc721contractAddress)
			const synthTokenContract = await ethers.getContractAt("MockERC20", synthTokenAddress)
			const balance = await synthTokenContract.balanceOf(user)
			expect(balance).to.equal(1)

			expect(await erc721contract.balanceOf(user)).to.equal(0)
			expect(await ethers.provider.getBalance(coinmunityContract)).to.equal(parseEther("0.01"))
		})
	})
})
