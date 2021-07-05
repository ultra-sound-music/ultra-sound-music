const mongoose = require("mongoose")

const schema = mongoose.Schema({
  tokenId: Number,
	creator: Number,
	owner: String,
  metadataUri: String,
  members: Array,
  active: Boolean,
  tokenType: String,
  name: String,
  description: String
})

module.exports = mongoose.model("Band", schema)