# Publishing

## Prerequisites

- Create an [Arweave wallet](https://faucet.arweave.net/) and get free airdrop. This will be used to pay for uploading content to Arweave.
- Create a [Solana Wallet](https://docs.solana.com/wallet-guide/file-system-wallet#generate-a-file-system-wallet-keypair). This wallet will be the [store owner](https://github.com/metaplex-foundation/metaplex/blob/master/ARCHITECTURE.md#store)
- (optional) Save the keypair to your local solana config (~/.config/solana/{filename.json})

## Setup Metaplex Accounts

#### Step 1: Initialize / create store

Each wallet can only have one store. Run this command and it will either created a store for the wallet or returning an existing store.

```
$ npx ts-node usm-cli init-store -k ~/.config/solana/{filename.json})
```

#### Step 2: Whitelist Creators

Set a [whitelisted creator](https://github.com/metaplex-foundation/metaplex/blob/master/ARCHITECTURE.md#whitelistedcreator) on the store

```
$ npx ts-node src/usm-cli set-whitelist-creator 34tUCCgN7fnqxFQDtxC99huw5XRTnXTsSPBeJu2iGaKy -k ~/.config/solana/test-keys.json
```

#### Step 3: Create Vault

Every time you run this command it will create a new vault for you. Think of the vault as the escrow account where all assets will go. This includes NFTs and Bids.

```
$ npx ts-node src/usm-cli create-vault -k ~/.config/solana/test-keys.json
```

#### Step 4: Upload Art

Step 7
Upload metadata to arweave, use your arweave wallet with arweave funds that you previously created
$ npx ts-node src/usm-cli create-metadata-uri -ar ~/.config/arweave/ar-key-prime.json -m metadata.json

Step 8
Mint NFT
npx ts-node src/usm-cli mint-nft https://arweave.net:443/FfZ9Ztw57ODImygezk62v6y4Y6HNwICf6J_gqVE7WkA -k ~/.config/solana/test-keys.json

Step 9
Put the NFT into the vault
npx ts-node src/usm-cli add-nft-to-vault 5Fa7AMaBtXxUeV3G676Xwq8vMzya1iC8yvELC7CctQwt 8tgMLqjWkGy2KEap2viUTk4rHciYEyLoSndhdrG7U8Md -k ~/.config/solana/test-keys.json

Step 10
Close the vault (why are we passing in SOL11111... ? - note it was was returned when initializing and used now when closing the vault)
npx ts-node src/usm-cli close-vault 8tgMLqjWkGy2KEap2viUTk4rHciYEyLoSndhdrG7U8M So11111111111111111111111111111111111111112 -k ~/.config/solana/test-keys.json

Step 11
Initialize the auction (there's likely a relationship with 1 store to many Auctions and many Vaults)
This returns the pubkey for the auction
$ npx ts-node src/usm-cli init-auction 8tgMLqjWkGy2KEap2viUTk4rHciYEyLoSndhdrG7U8Md -k ~/.config/solana/test-keys.json -m 1

Step 12 (What does the auction manager give us that the Auctino does not)
Create the auction manager
$ npx ts-node src/usm-cli init-auction-manager 8tgMLqjWkGy2KEap2viUTk4rHciYEyLoSndhdrG7U8Md -k ~/.config/solana/test-keys.json

Step 13
Validate the auction manager
npx ts-node src/usm-cli validate-auction-manager 8tgMLqjWkGy2KEap2viUTk4rHciYEyLoSndhdrG7U8Md 5Fa7AMaBtXxUeV3G676Xwq8vMzya1iC8yvELC7CctQwt FvUKuBGMfBi4jioRN7NtwQxFYeTKK5NbdCM1FPvSHZNh -k ~/.config/sol
ana/test-keys.json

...
...

Step X - Finalizing the auction

- In the case of an auction with no end date, how to manually close it
- How to redeem bids
- How to redeem NFT
- etc..

Any other open questions?
