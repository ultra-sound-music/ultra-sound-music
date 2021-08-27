
const hre = require("hardhat");
const {ARTIST_DEPLOYED_ADDRESS, BAND_DEPLOYED_ADDRESS, TRACK_DEPLOYED_ADDRESS} = require("./constants");

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
    const USMArtistToken = await hre.ethers.getContractFactory("USMArtistToken");
    const USMBandToken = await hre.ethers.getContractFactory("USMBandToken");
    const USMTrackToken = await hre.ethers.getContractFactory("USMTrackToken");


    const artistContract = await USMArtistToken.attach(ARTIST_DEPLOYED_ADDRESS);
    const bandContract = await USMBandToken.attach(BAND_DEPLOYED_ADDRESS);
    const trackContract = await USMTrackToken.attach(TRACK_DEPLOYED_ADDRESS);

    await Promise.all(addresses.map(async (address, i) => {     
      const aC = await artistContract.connect(address);
      return aC.createArtist(artistMetadata[i], {value: ethers.utils.parseEther(".15")})
    }))

    console.log("artists created")

    const bU1 = await bandContract.connect(user1)
    await bU1.startBand(1 , bandMetadata[0])
    const bU2 = await bandContract.connect(user2)
    await bU2.startBand(2 , bandMetadata[1])
    const bU3 = await bandContract.connect(user3)
    await bU3.startBand(3 , bandMetadata[2])
    const bU4 = await bandContract.connect(user4)
    await bU4.startBand(4 , bandMetadata[3])
    const bU5 = await bandContract.connect(user5)
    await bU5.startBand(5 , bandMetadata[4])

    console.log("bands started")

    await new Promise(resolve => setTimeout(resolve, 5000));

    // band < 4 members

    const bU6 = await bandContract.connect(user6)
    await bU6.joinBand(6, 1)
    const bU7 = await bandContract.connect(user7)
    await bU7.joinBand(7, 1)

    console.log("band 1 joined")

    


    // band with 4 members no tracks

    const bU8 = await bandContract.connect(user8)
    await bU8.joinBand(8, 2)
    const bU9 = await bandContract.connect(user9)
    await bU9.joinBand(9, 2)
    const bU10 = await bandContract.connect(user10)
    await bU10.joinBand(10, 2)

    console.log("band 2 joined and active")

    // band with 4 members 1 track

    const bU11 = await bandContract.connect(user11)
    await bU11.joinBand(11, 3)
    const bU12 = await bandContract.connect(user12)
    await bU12.joinBand(12, 3)
    const bU13 = await bandContract.connect(user13)
    const tU13 = await trackContract.connect(user13)
    await bU13.joinBand(13, 3)
    await tU13.createTrack(13, 3, trackMetadata[0])

    console.log("band 3 joined and active and one track created")

    //band with 4 members and 4 tracks 


    const bU14 = await bandContract.connect(user14)
    await bU14.joinBand(14, 4)
    const bU15 = await bandContract.connect(user15)
    await bU15.joinBand(15, 4)
    const bU16 = await bandContract.connect(user16)
    await bU16.joinBand(16, 4)


    const tU4 = await trackContract.connect(user4)
    const tU14 = await trackContract.connect(user14)
    const tU15 = await trackContract.connect(user15)
    const tU16 = await trackContract.connect(user16)

    await tU4.createTrack(4, 4, trackMetadata[1])
    await tU14.createTrack(14, 4, trackMetadata[2])
    await tU15.createTrack(15, 4, trackMetadata[3])
    await tU16.createTrack(16, 4, trackMetadata[4])

    console.log("band 4 joined and active and four tracks created")
  

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