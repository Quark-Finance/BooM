You can see our live demo here: https://boo-market-deploy.vercel.app/ (and also in the World App)

BooMarket is a solution to solve the fragmentation problem we see today. Currently, it's very difficult for users to simply buy the tokens they want (memecoins, for exempla). 
This happens because not only the tokens may not be available on the chain the user is or maybe there's no liquidity to buy it in a reasonable price. However, users shouldn't need to care about that, they just should be able to buy what they want where they are.

Our solution to that is what we call "Ghost" liquidity, or shared liquidity. Leveraging the LayerZero OFT concept (where one token can be on multiple chains), users in one chain can use the liquidty doesn't exist in their current chain to buy a token that is on other chain.

How it works: let's say a user on Worldchain (or Unichain) has USDC and want to buy PEPE. The user doesn't know (and doesn't care) about where PEPE is deployed or where the liquidity is deeper, they only want to buy PEPE.

Since both USDC and PEPE are OFTs, we can laverage **lzCompose** to send USDC from the source chain (world or unichain) to a destination chain where there is enough liquidity (let's say OP). After the transfer is done, lzCompose calls a function to make a swap on the USDC sent and we use Uni v4 to perform it. After swap we simply send the output token back to the original chain.

For the PoV of the user, they're just buying PEPE, as it should be.

As our Proof of Concept, we created the OmniSwapHub and OmniSwapSpoke contracts, in order to handle these communications.

We have deployed 2 OFTs in two chains in order to make communications:

- USDC
  -  Arbitrum Sepolia: [0x6fD36fd6D6f1D8a5E43B33b1881fd4EF167b6588](https://sepolia-explorer.arbitrum.io/address/0x6fD36fd6D6f1D8a5E43B33b1881fd4EF167b6588)
  -  OPtimism Sepolia: [0x15906379703940bc51a5881Ad1a5fc481Ebc8bB1](https://optimism-sepolia.blockscout.com/address/0x15906379703940bc51a5881Ad1a5fc481Ebc8bB1)
  -  Unichain Sepolia: [0x64e8C6db52bC99c39d7c2DEB0F9CD52848a5772b](https://unichain-sepolia.blockscout.com/address/0x64e8C6db52bC99c39d7c2DEB0F9CD52848a5772b)
- PEPE
  -  Arbitrum Sepolia: [0xa56F2Eb760131C39f2ddF4c6D4d245E3d5a1d796](https://sepolia-explorer.arbitrum.io/address/0xa56F2Eb760131C39f2ddF4c6D4d245E3d5a1d796)
  -  OPtimism Sepolia: [0xbA397eFEF3914aB025F7f5706fADE61f240A9EbC](https://optimism-sepolia.blockscout.com/address/0xbA397eFEF3914aB025F7f5706fADE61f240A9EbC)
  -  Unichain Sepolia: [0xa14C098C96201B303c6FC4F7aA78F4e422e05D54](https://unichain-sepolia.blockscout.com/address/0xa14C098C96201B303c6FC4F7aA78F4e422e05D54)

We also have deployed the OmniSwap contracts at Arbitrum (0x7b59080B27A659AEC847121De8eb402024F4bE48) and OPtimism (0x9586FA0a7B039531411ceAD42616c7751Ceec296).

Now, we assume an user in Arbitrum holds USDC and wants to buy PEPE (which has liquidity in the USDC/PEPE pool on OP). We send USDC using LayerZero and we trigger lzCompose to make the swap
- Arb tx with lzCompose: https://testnet.layerzeroscan.com/tx/0x84d3c2813b483c2333aa6db2dd6ab43671f7c8d5d07421d8a49b1d51cfe135db
- After the swap PEPE is sent to Arbitrum: https://testnet.layerzeroscan.com/tx/0xbe34e039f442557edd02fed00c7f78ae818b74bd87170f0ab10bf8c3827d6c13

This way, the user simply did a swap, allowing them to access PEPE where they are.

In order to perform swaps we deployed Uniswap V4 on OP Sepolia (where the liquidity is):

Uniswap V4 Deployed OP:
  Deployed PoolManager at [0x536527976E98E253B424a3655E695D144E343341](https://optimism-sepolia.blockscout.com/address/0x536527976E98E253B424a3655E695D144E343341)
  
  Deployed PoolSwapTest at [0x69801C169647Ad125707Dd40096D4EDC20Bb521a](https://optimism-sepolia.blockscout.com/address/0x69801C169647Ad125707Dd40096D4EDC20Bb521a)
  
  Deployed PoolModifyLiquidityTest at [0x440D0bEe5706987be528Fec5C4cA5947E38161d2](https://optimism-sepolia.blockscout.com/address/0x440D0bEe5706987be528Fec5C4cA5947E38161d2)
  
  Deployed PoolDonateTest at [0xE7f9b827214D1fC817a5005Ca678e9AaABEfEE58](https://optimism-sepolia.blockscout.com/address/0xE7f9b827214D1fC817a5005Ca678e9AaABEfEE58)
  
  Deployed PoolTakeTest at [0xaBF8C1c67324C75C82B2cD2a274BF55Ab9A33355](https://optimism-sepolia.blockscout.com/address/0xaBF8C1c67324C75C82B2cD2a274BF55Ab9A33355)
  
  Deployed PoolClaimsTest at [0xCe8d00d2001aaaA1D46216ffF73Bd814f5030246](https://optimism-sepolia.blockscout.com/address/0xCe8d00d2001aaaA1D46216ffF73Bd814f5030246)

  Hook: [0xBbd735DB53cE42a7423B0861864dAD6253588040](https://optimism-sepolia.blockscout.com/address/0xBbd735DB53cE42a7423B0861864dAD6253588040)

You can see a USDC to PEPE swap at: [0x4cbf456d29708bb0710bd1c8dc52bc8e8b497b8d62386ce8ec8ef9c5cec8fb31
](https://optimism-sepolia.blockscout.com/tx/0x4cbf456d29708bb0710bd1c8dc52bc8e8b497b8d62386ce8ec8ef9c5cec8fb31)






