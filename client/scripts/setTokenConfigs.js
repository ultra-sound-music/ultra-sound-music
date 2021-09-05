const fs = require('fs');
const mkdirp = require('mkdirp');

const tokenConfigs = process.argv[2];

const path = './src/deps';
const made = mkdirp.sync(path);

if (made) {
  console.log(`made directories, starting with ${made}`);
}

const jsString = `export default ${tokenConfigs}`;
fs.writeFile(`${path}/tokenConfigs.js`, jsString, { flag: 'w+' }, (err) => {
  if (err) {
    console.error(err);
    return;
  }
});
