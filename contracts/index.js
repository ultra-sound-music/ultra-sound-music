const fs = require('fs');

function loadJSON(file) {
  const str = fs.readFileSync(`${__dirname}/${file}`, 'utf8');
  return JSON.parse(str);
}

function getTokenConfigs(network) {
  const addresses = loadJSON(`networks/addresses/${network}.json`);
  return ['artist', 'band', 'track'].reduce((configs, tokenName) => {
    const capitalized = tokenName.charAt(0).toUpperCase() + tokenName.slice(1);
    const fileName = `USM${capitalized}Token.json`;
    configs[tokenName] = {
      abi: loadJSON(`networks/abis/${network}/${fileName}`).abi,
      address: addresses[tokenName]
    };
    return configs;
  }, {});
}

module.exports = getTokenConfigs;
