import TOCInline from '@theme/TOCInline';

# Create Auction

## Prerequisites

- Create an [Arweave wallet](https://faucet.arweave.net/) and get free airdrop. This will be used to pay for uploading content to Arweave.
- Create a [Solana Wallet](https://docs.solana.com/wallet-guide/file-system-wallet#generate-a-file-system-wallet-keypair). This wallet will be the [store owner](https://github.com/metaplex-foundation/metaplex/blob/master/ARCHITECTURE.md#store)
- (optional) Save the keypair to your local solana config (~/.config/solana/{filename.json})

## Section 1: Create NFT

### 1: Upload Art

Upload artwork to Arweave using your Arweave wallet. (remember to also do this if there is a participation NFT)

```
$ npx ts-node usm-cli upload-image -ar ~/path/to/arweave-wallet.json -i ~/path/to/image
```

### 2: Upload Metadata

Upload metadata to Arweave using your Arweave wallet.

```
$ npx ts-node usm-cli create-metadata-uri -ar ~/path/to/arweave-wallet.json -i ~/path/to/metadata.json
```

### 3: Mint NFT

In order to be able to mint, your current wallet address must be one of the addresses in the creator's array in the NFT's metadata

```
$ npx ts-node usm-cli mint-nft {metadata-uri} -k ~/path/to/solana-wallet.json
```

## Phase 2: Sign NFT Metadata

Before you can successfully launch an auction, every creator in the "creators array" in the NFT metadata needs to be "verified".

## Section 3: Create The Auction

### 1: Store

Each wallet can only have one store. Run this command and it will either created a store for the wallet or returning an existing store.

```
$ npx ts-node usm-cli init-store -k ~/.config/solana/{filename.json})
```

### 2: Creators

Ensure all creators are [whitelisted](https://github.com/metaplex-foundation/metaplex/blob/master/ARCHITECTURE.md#whitelistedcreator) in the store. It won't be possible to create publish the auction until all creators that are listed in the creators array are whitelisted.

```
$ npx ts-node usm-cli set-whitelist-creator {store-id} -k ~/.config/solana/test-keys.json
```

### 3: Vault

Every time you run this command it will create a new vault for you. Think of the vault as the escrow account where all assets will go. This includes NFTs and Bids.

```
$ npx ts-node usm-cli create-vault -k ~/path/to/solana-wallet.json
```

### 7: Transfer NFT to Vault

This will return a "token store account" which we'll need later to validate the auction.

```
$ npx ts-node usm-cli add-nft-to-vault {nft-address} {vault-address} -k ~/path/to/solana-wallet.json
```

### 8: Close Vault

Close the vault (why are we passing in SOL11111... ? - note it was was returned when initializing and used now when closing the vault)

```
$ npx ts-node usm-cli close-vault {vault-address} So11111111111111111111111111111111111111112 -k ~/path/to/solana-wallet.json
```

### 9: Auction

Initialize the [auction](https://github.com/metaplex-foundation/metaplex/blob/master/ARCHITECTURE.md#auction). Basically, we're auctioning off whatever's in the vault. This returns the pubkey for the auction

```
$ npx ts-node usm-cli init-auction {vault-address} -k ~/path/to/solana-wallet.json -m 1
```

### 12: Auction Manager

Create the [auction manager](https://github.com/metaplex-foundation/metaplex/blob/master/ARCHITECTURE.md#auctionmanager)

```
$ npx ts-node usm-cli init-auction-manager {vault-address} -k ~/path/to/solana-wallet.json
```

### 13: Validate

[Validate](https://github.com/metaplex-foundation/metaplex/blob/master/ARCHITECTURE.md#validation) the auction manager

```
$ npx ts-node usm-cli validate-auction-manager {vault} {nft} {token-store} -k ~/path/to/solana-wallet.json
```

...
...

X - Finalizing the auction

- In the case of an auction with no end date, how to manually close it
- How to redeem bids
- How to redeem NFT
- etc..

Any other open questions?
