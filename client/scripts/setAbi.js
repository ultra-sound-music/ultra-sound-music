const fs = require('fs');
const mkdirp = require('mkdirp');

const ABI = process.argv[2];

const path = './src/lib';
const made = mkdirp.sync(path);

if (made) {
  console.log(`made directories, starting with ${made}`)
}

fs.writeFile(`${path}/usmAbi.js`, ABI, {flag: 'w+'}, err => {
  if (err) {
    console.error(err)
    return
  }
})