/* global ethers */

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const fs = require('fs');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  // We get the contract to deploy

  const USMArtistToken = await ethers.getContractFactory('USMArtistToken');
  const usmArtistToken = await USMArtistToken.deploy(
    'USM Artist Token',
    'USM-A'
  );

  await usmArtistToken.deployed();

  console.log('USM Artist Token deployed to:', usmArtistToken.address);

  const USMBandToken = await ethers.getContractFactory('USMBandToken');
  const usmBandToken = await USMBandToken.deploy(
    'USM Band Token',
    'USM-B',
    usmArtistToken.address
  );

  await usmBandToken.deployed();

  console.log('USM Band Token deployed to:', usmBandToken.address);

  const USMTrackToken = await ethers.getContractFactory('USMTrackToken');
  const usmTrackToken = await USMTrackToken.deploy(
    'USM Track Token',
    'USM-T',
    usmArtistToken.address,
    usmBandToken.address
  );

  await usmTrackToken.deployed();

  console.log('USM Track Token deployed to:', usmTrackToken.address);

  const addresses = JSON.stringify({
    artist: usmArtistToken.address,
    band: usmBandToken.address,
    track: usmTrackToken.address
  });

  const addressfile = './addresses.json';
  await fs.writeFileSync(addressfile, addresses, { flag: 'w+' });

  console.log('Addresses written to the artifacts folder:', addressfile);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
