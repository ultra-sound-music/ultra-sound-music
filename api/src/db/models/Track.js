const mongoose = require('mongoose');

const schema = mongoose.Schema({
  tokenId: Number,
  creator: Number,
  owner: String,
  tokenType: String,
  band: Number,
  metadataUri: String,
  name: String,
  description: String
});

module.exports = mongoose.model('Track', schema);
