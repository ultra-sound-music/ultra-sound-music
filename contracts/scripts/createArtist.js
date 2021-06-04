
const hre = require("hardhat");
const constants = require("constants");

const testURI= "https://storageapi.fleek.co/dongambas-team-bucket/1622333162829"

async function main() {


  try {
    const UltraSoundMusic = await hre.ethers.getContractFactory("UltraSoundMusic");
    const contract = await UltraSoundMusic.attach(constants.NFT_DEPLOYED_ADDRESS);
  
  // Now you can call functions of the contract
    await contract.createArtist(testURI);
    const artistId = await contract.artistCount()
    await contract.startBand(artistId, testURI)

    
  } catch (error) {
    console.log(error)
  }

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});