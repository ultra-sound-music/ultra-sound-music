
const hre = require("hardhat");
const {NFT_DEPLOYED_ADDRESS} = require("./constants");

const testURI= "https://storageapi.fleek.co/dongambas-team-bucket/1622333162829"

async function main() {




  try {
    const addresses = await ethers.getSigners();
    const UltraSoundMusic = await hre.ethers.getContractFactory("UltraSoundMusic");
    const contract = await UltraSoundMusic.attach(NFT_DEPLOYED_ADDRESS);
     
    await Promise.all(addresses.map(async address => {      
      const c = await contract.connect(address);
      return c.createArtist(testURI)
    }))    
    
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