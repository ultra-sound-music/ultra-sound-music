
const hre = require("hardhat");
const constants = require("constants");

async function main() {


  try {
    const UltraSoundMusic = await hre.ethers.getContractFactory("UltraSoundMusic");
    const contract = await UltraSoundMusic.attach(constants.NFT_DEPLOYED_ADDRESS);
  
  // Now you can call functions of the contract
    await contract.joinBand(5, 104);
    
    
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