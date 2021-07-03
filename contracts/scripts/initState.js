
const hre = require("hardhat");
const {NFT_DEPLOYED_ADDRESS} = require("./constants");

const testURI= "https://storageapi.fleek.co/dongambas-team-bucket/1622333162829"

const artistMetadata = [
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399326",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399361",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399363",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399364",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399365",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399366",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399367",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399370",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399371",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399372",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399373",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399374",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399375",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399376",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625349117223",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399377",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399378",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399379",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399380",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625348399381"
]

const bandMetadata = [
  "https://storageapi.fleek.co/dongambas-team-bucket/1625349161380",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625349161405",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625349161406",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625349161408",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625349161409"
]

const trackMetadata = [
  "https://storageapi.fleek.co/dongambas-team-bucket/1625349236642",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625349236665",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625349236667",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625349236668",
  "https://storageapi.fleek.co/dongambas-team-bucket/1625349236669"
]



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
    ] = addresses; 
    const UltraSoundMusic = await hre.ethers.getContractFactory("UltraSoundMusic");
    const contract = await UltraSoundMusic.attach(NFT_DEPLOYED_ADDRESS);

    await Promise.all(addresses.map(async (address, i) => {     
      const c = await contract.connect(address);
      return c.createArtist(artistMetadata[i])
    }))

    console.log("artists created")

    const cU1 = await contract.connect(user1)
    await cU1.startBand(1, bandMetadata[0])
    const cU2 = await contract.connect(user2)
    await cU2.startBand(2, bandMetadata[1])
    const cU3 = await contract.connect(user3)
    await cU3.startBand(3, bandMetadata[2])
    const cU4 = await contract.connect(user4)
    await cU4.startBand(4, bandMetadata[3])
    const cU5 = await contract.connect(user5)
    await cU5.startBand(5, bandMetadata[4])

    console.log("bands started")

    await new Promise(resolve => setTimeout(resolve, 5000));

    // band < 4 members

    const cU6 = await contract.connect(user6)
    await cU6.joinBand(6, 101)
    const cU7 = await contract.connect(user7)
    await cU7.joinBand(7, 101)

    console.log("bands 101 joined")


    // band with 4 members no tracks

    const cU8 = await contract.connect(user8)
    await cU8.joinBand(8, 102)
    const cU9 = await contract.connect(user9)
    await cU9.joinBand(9, 102)
    const cU10 = await contract.connect(user10)
    await cU10.joinBand(10, 102)

    console.log("bands 102 joined and active")

    // band with 4 members 1 track

    const cU11 = await contract.connect(user11)
    await cU11.joinBand(11, 103)
    const cU12 = await contract.connect(user12)
    await cU12.joinBand(12, 103)
    const cU13 = await contract.connect(user13)
    await cU13.joinBand(13, 103)
    await cU13.createTrack(13, 103, trackMetadata[0])

    console.log("bands 103 joined and active and one track created")

    //band with 4 members and 4 tracks 


    const cU14 = await contract.connect(user14)
    await cU14.joinBand(14, 104)
    const cU15 = await contract.connect(user15)
    await cU15.joinBand(15, 104)
    const cU16 = await contract.connect(user16)
    await cU16.joinBand(16, 104)

    await cU4.createTrack(4, 104, trackMetadata[1])
    await cU14.createTrack(14, 104, trackMetadata[2])
    await cU15.createTrack(15, 104, trackMetadata[3])
    await cU16.createTrack(16, 104, trackMetadata[4])

    console.log("bands 104 joined and active and four tracks created")

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