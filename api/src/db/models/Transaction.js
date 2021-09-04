const mongoose = require("mongoose")

let Transaction;
const TransactionSchema = new mongoose.Schema({
  tokenKey: String,
  owner: String,
  type: String,
  status: String
}, {
  timestamps: true
});

TransactionSchema.statics.status = {
  SUBMITTED: 'submitted',
  EXPIRED: 'expired',
  COMPLETE: 'complete'
};

TransactionSchema.statics.types = {
  CREATE_ARTIST: 'create-artist',
  START_BAND: 'start-band',
  JOIN_BAND: 'join-band',
  CREATE_TRACK: 'create-track',  
};

TransactionSchema.statics.expireStaleTransactions = async function(type, owner, uri) {
  const tokenKey = Transaction.generateTokenKey(uri);
  const query  = {
    tokenKey,
    owner,
    type,
    status: Transaction.status.SUBMITTED
  };
  await Transaction.updateMany(query, { status: Transaction.status.EXPIRED })  
}

TransactionSchema.statics.recordSubmittedTransaction = async function(type, owner, uri) {
  Transaction.expireStaleTransactions(type, owner, uri);
  
  const tokenKey = Transaction.generateTokenKey(uri);
  const submittedTransaction = new Transaction({
    tokenKey,
    owner,
    type,
    status: Transaction.status.SUBMITTED
  });

  await submittedTransaction.save();
}

TransactionSchema.statics.recordCompletedTransaction = async function(type, owner, uri) {
  const tokenKey = Transaction.generateTokenKey(uri);
  const query = { 
    tokenKey,
    owner,
    type,
    status: Transaction.status.SUBMITTED
  };

  await Transaction.updateOne(query, {
    status: Transaction.status.COMPLETE
  });
}

TransactionSchema.statics.generateTokenKey = function (uri) {  
  if (!uri || typeof uri !== 'string') {
    return '';
  }

  // Get everything after the final '/'
  return uri.slice(uri.lastIndexOf('/') + 1);
};

Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
