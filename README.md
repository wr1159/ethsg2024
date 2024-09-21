# co(IN)munity

## Short Description

A community-building token launchpad with bonding curve, serving as a public good among NFT communities

## Description

co(IN)munity is a public good as a service that allows communities to launch a token using a bonding curve by allowing users to deposit EITHER the native token or the NFT associated with the community. In exchange for the deposits, users will get a community token. This community token is integrated with 1Inch's token plugins standard which allows the community to extend this token for different plugins depending on their own usecase. A good example would be using the DelegationPlugin which will allow the community members to delegate votes to other trusted members in the community. co(IN)munity is also integrated with ENS such that the community coin will attempt be a reverse registrar to receive an ENS domain which we will extend in the future to allow it to grant community members each an ENS Subdomain based on their contribution.

By integrating with Reown, we are able to use the Web3Inbox Notify feature to send community members a one time use discord link to users to create a token gated community upon purchase of the community token. This feature can also be extended to send community members important project updates like government proposals or airdrop announcements. The website is also very much in the ethos of NounsDAO as it uses fonts and its colour palette.

## How it's made

For the frontend, we used Reown's Appkit alongside NounsDAO's fonts and its colour. This was built with NextJS as the main framework and alongside wagmi and Reown, users can connect ot the website and interact with the contracts. It is also integrated with Reown's Web3Inbox which allows users to be notified through push notifications and a notifiaction history.

For the contracts, we used Roostock's hardhat starter kit which is enjoyable to use. For the contracts, we had our coinmunity contract as the main driver of the other contracts.The coinmunity contract takes in parameters and allows community tokens to be launched and supporting the purchase of the community token with either the native token or the NFT. The community token named ContinuousLinearToken, is an ERC20 with a bonding curve system built in to increase the price as demand increases. This community token also inherits ERC20Plugin to allow 1Inch's plugins to be extended upon it and reverse claimer to claim the ENS.
