const mongoose = require('mongoose');

const schema = mongoose.Schema({
  tokenId: Number,
  owner: String,
  metadataUri: String,
  tokenType: String,
  artistDNA: String,
  name: String,
  description: String
});

module.exports = mongoose.model('Artist', schema);
