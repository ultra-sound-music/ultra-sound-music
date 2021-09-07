const localAddresses = require('./networks/addresses/local.json');
const USMArtistTokenAbiLocal = require('./networks/abis/local/USMArtistToken.json').abi;
const USMBandTokenAbiLocal = require('./networks/abis/local/USMBandToken.json').abi;
const USMTrackTokenAbiLocal = require('./networks/abis/local/USMTrackToken.json').abi;

module.exports = {
  local:{
    artist: {
      abi: USMArtistTokenAbiLocal,
      address: localAddresses.artist
    },
    band: {
      abi: USMBandTokenAbiLocal,
      address: localAddresses.band
    },
    track: {
      abi: USMTrackTokenAbiLocal,
      address: localAddresses.track
    }
  },
  rinkeby:{
    artist:{},
    band:{},
    track:{}
  },
  mainnet:{
    artist:{},
    band:{},
    track:{}
  }
};
