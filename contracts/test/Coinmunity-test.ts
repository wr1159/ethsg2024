import { expect } from "chai"
import { parseEther } from "ethers"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { parse } from "path"

describe("Coinmunity", () => {
	const setupFixture = deployments.createFixture(async () => {
		await deployments.fixture()
		const signers = await getNamedAccounts()

		const wethContract = await ethers.deployContract("WETH")
		await wethContract.deposit({ value: parseEther("100") })
		const wethContractAddress = await wethContract.getAddress()

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
			[wethContractAddress],
			await ethers.getSigner(signers.deployer)
		)
		const coinmunityContractAddress = await coinmunityContract.getAddress()
		await coinmunityContract.launch(name, symbol, collectionAddress, initialPrice, priceIncrement, nftExchangeRate)
		const lbcContractAddress = await coinmunityContract.getCurveFromCollection(erc721contractAddress)
		const synthTokenAddress = await coinmunityContract.getTokenFromCollection(erc721contractAddress)
		const synthTokenContract = await ethers.getContractAt("MockERC20", synthTokenAddress)

		expect(await synthTokenContract.balanceOf(lbcContractAddress)).to.greaterThan(0)

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
			const synthTokenAddress = await coinmunityContract.getTokenFromCollection(erc721contractAddress)
			const synthTokenContract = await ethers.getContractAt("MockERC20", synthTokenAddress)

			await wethContract.approve(lbcContractAddress, parseEther("1000000"))
			await coinmunityContract.buyWithNative(erc721contractAddress, parseEther("0.01"))
			expect(await wethContract.balanceOf(lbcContractAddress)).to.equal(parseEther("0.01"))

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
			const buyTx = await coinmunityContract.buyWithNFT(erc721contractAddress, 1)
			await buyTx.wait()
			expect(await erc721contract.balanceOf(user)).to.equal(0)
			expect(await erc721contract.balanceOf(coinmunityContractAddress)).to.equal(1)

			const userBalance = await synthTokenContract.balanceOf(user)
			console.log(userBalance)
			const lbcContractAddress = await coinmunityContract.getCurveFromCollection(erc721contractAddress)
			const lbcContrct = await ethers.getContractAt("LinearBondingCurve", lbcContractAddress)
			await lbcContrct.buyWithNFT()
			const amountOut = await lbcContrct.calculatePurchaseAmountOut(parseEther("0.01"))
			console.log(amountOut)
			const lbcBalance = await synthTokenContract.balanceOf(lbcContractAddress)
			console.log(lbcBalance)
			expect(userBalance).to.greaterThan(parseEther("0"))
		})
	})
})
