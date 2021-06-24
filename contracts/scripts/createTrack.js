const hre = require("hardhat");

const {NFT_DEPLOYED_ADDRESS} = require("./constants");

const testURI= "https://storageapi.fleek.co/dongambas-team-bucket/1622333162829"

async function main() {


  try {
    const UltraSoundMusic = await hre.ethers.getContractFactory("UltraSoundMusic");
    const contract = await UltraSoundMusic.attach(NFT_DEPLOYED_ADDRESS);
  
  // Now you can call functions of the contract
    await contract.createTrack(5, 104, testURI);
    
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