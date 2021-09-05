const addresses = require('./addresses.json');
const USMArtistTokenAbi =
  require('./artifacts/contracts/USMArtistToken.sol/USMArtistToken.json').abi;
const USMBandTokenAbi =
  require('./artifacts/contracts/USMBandToken.sol/USMBandToken.json').abi;
const USMTrackTokenAbi =
  require('./artifacts/contracts/USMTrackToken.sol/USMTrackToken.json').abi;

module.exports = {
  artist: {
    abi: USMArtistTokenAbi,
    address: addresses.artist
  },
  band: {
    abi: USMBandTokenAbi,
    address: addresses.band
  },
  track: {
    abi: USMTrackTokenAbi,
    address: addresses.track
  }
};
