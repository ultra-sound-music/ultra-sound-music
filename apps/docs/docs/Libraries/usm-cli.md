# USM CLI

## overview

the USM CLI can be used to configure a metaplex auction using their metaplex store, vault, auction, auction manager and metadata program.

## installation 

```
git clone https://github.com/ultra-sound-music/usm-ts
cd cli
npm i
```

## usage

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





