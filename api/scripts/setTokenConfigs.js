const fs = require('fs');
const mkdirp = require('mkdirp');

const tokenConfigs = process.argv[2];

const path = './conf';
const filename = `${path}/tokenConfigs.js`;
const made = mkdirp.sync(path);

if (made) {
  console.log(`made directories, starting with ${made}`);
}

const jsString = `module.exports = ${tokenConfigs}`;
fs.writeFile(filename, jsString, { flag: 'w+' }, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(`<*>Successfully wrote token configs to ${filename}`);
});
