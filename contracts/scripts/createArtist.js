
const hre = require("hardhat");
const {NFT_DEPLOYED_ADDRESS} = require("./constants");

const testURI= "https://storageapi.fleek.co/dongambas-team-bucket/1622333162829"

async function main() {




  try {
    const addresses = await ethers.getSigners();
    const [
      user1,
      user2,
      user3,
      user4,
      user5,
      user6,
      user7,
      user8,
      user9,
      user10,
      user11,
      user12,
      user13,
      user14,
      user15,
      user16,
      user17,
      user18,
      user19,
      user20,
    ] = addresses; 
    const UltraSoundMusic = await hre.ethers.getContractFactory("UltraSoundMusic");
    const contract = await UltraSoundMusic.attach(NFT_DEPLOYED_ADDRESS);
     
    await Promise.all(addresses.map(async address => {      
      const c = await contract.connect(address);
      return c.createArtist(testURI)
    }))

    /*
    const band1 = contract.createBand();
    const band2 = contract.createBand();
    const band3 = contract.createBand();
    const band4 = contract.createBand();*/
    
    


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