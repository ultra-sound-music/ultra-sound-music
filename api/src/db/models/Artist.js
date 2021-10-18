const mongoose = require('mongoose');

const schema = mongoose.Schema({
  tokenId: Number,
  owner: String,
  metadataUri: String,
  tokenType: String,
  artistDNA: String,
  name: String,
  description: String,
  s3Sound: String,
  soundIpfs: String,
  image: String,
  artistTraits: {
    texture: Number,
    warmth: Number,
    dissonance: Number,
    aggression: Number,
    space: Number
  }
});

module.exports = mongoose.model('Artist', schema);
