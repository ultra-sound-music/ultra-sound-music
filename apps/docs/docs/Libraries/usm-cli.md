# USM CLI

## Overview

the USM CLI can be used to configure a metaplex auction using their metaplex store, vault, auction, auction manager and metadata program.

## Installation

```
git clone https://github.com/ultra-sound-music/usm-ts
cd cli
npm i
```

## General Usage

Below is a list of commands available on the CLI

```
Usage: usm-cli [options] [command]

Options:
  -V, --version                                                   output the version number
  -h, --help                                                      display help for command

Commands:
  init-store [options]
  set-whitelist-creator [options] <store>
  create-vault [options]
  upload-image [options]
  create-metadata-uri [options]
  mint-nft [options] <uri>
  add-nft-to-vault [options] <nft> <vault>
  close-vault [options] <vault> <price_mint>
  init-auction [options] <vault>
  init-auction-manager [options] <vault>
  validate-auction-manager [options] <vault> <nft> <token_store>
  start-auction [options] <vault>
  end-auction [options] <vault>
  claim-bid [options] <vault>
  help [command]                                                  display help for command
```

to run a command locally you can use `npx ts-node src/usm-cli <command>`

the commands in the list above are listed in order that they are needed to configure an auction. start with `init-store` and end with `start-auction`. to see specific args and options for a command use `npx ts-node src/usm-cli <command> -h`

### Example: create metadata uri

```
Usage: usm-cli create-metadata-uri [options]

Options:
  -ar, --arwallet <path>  ar wallet path (default: "--arwallet not provided")
  -m, --metadata <path>   metadata json location (default: "--metadata-path
                          not provided")
  -h, --help              display help for command

```

### Example: mint nft

```
Usage: usm-cli mint-nft [options] <uri>

Arguments:
  uri                   metadata uri

Options:
  -e, --env <string>    Solana cluster env name (default: "devnet")
  --participation       use if this is a participation nft
  -k, --keypair <path>  Solana wallet location (default: "--keypair not
                        provided")
  -h, --help            display help for command

```

### Uploading assets + minting NFT

1. upload image

To upload an image to arweave you can use the following command from the cli `usm-cli upload-image` with below options and arguements

```
Usage: usm-cli upload-image [options]

Options:
  -ar, --arwallet <path>  ar wallet path (default: "--arwallet not provided")
  -i, --image <path>      path to image (default: "--image-path not provided")
  -h, --help              display help for command
```

you'll need an arweave wallet stored locally with enough winstons in it to perform the upload + the image asset saved in your file system. use the `-ar` flag to point to your wallet and the `-i` flage to point to your image. This will output a url like this `https://arweave.net:443/yWIXWKAVTzy59jEEC1pQXckZd8ryUL5q5z1wBICOrjM` that can be used in the next step, metadata creation.

2. upload metadata

after you have uploaded your image asset you're ready to create your nft metadata. Below is an example of a valid metadata json file. More information on the solana metadata standard can be found [here](https://docs.metaplex.com/token-metadata/specification). Note that the image property should point to the url that was output in the above step

```
{
  "name": "Pato",
  "symbol": "PATO",
  "description": "El pato sin manos",
  "seller_fee_basis_points": 500,
  "external_url": "",
  "image": "https://www.arweave.net/RTiX1MRVCIAnSGhgZ9-GVvn6seHYu6_kg8SR9tOnwfk?ext=jpeg",
  "properties": {
    "files": [
      {
        "uri": "https://www.arweave.net/RTiX1MRVCIAnSGhgZ9-GVvn6seHYu6_kg8SR9tOnwfk?ext=jpeg",
        "type": "image/jpeg"
      }
    ],
    "category": "image",
    "creators": [
      {
        "address": "3QJZJujTgrfeGQhLPX3YMseZ7ovhQbo6eWu3SLbMQzqS",
        "share": 100
      }
    ]
  }
}
```

Save your metadata json file locally and use the `usm-cli create-metadata-uri` command to upload the metadata json file to arweave. this command is similar to the `usm-cli upload-image` command.

```
Usage: usm-cli create-metadata-uri [options]

Options:
  -ar, --arwallet <path>  ar wallet path (default: "--arwallet not provided")
  -m, --metadata <path>   metadata json location (default: "--metadata-path
                          not provided")
  -h, --help              display help for command
```

3. Mint your NFT.

After you have successfully uploaded your metadata you're ready to mint your NFT on the solana blockchain. To do this use the `usm-cli mint-nft` command pointing to your metadata uri and your solana wallet, see command options below.

```
Usage: usm-cli mint-nft [options] <uri>

Arguments:
  uri                   metadata uri

Options:
  -e, --env <string>    Solana cluster env name (default: "devnet")
  --participation       use if this is a participation nft
  -k, --keypair <path>  Solana wallet location (default: "--keypair not
                        provided")
  -h, --help            display help for command
```
