const fs = require('fs');
const {exec} = require('child_process');

const tokenConfigs  = require('../contracts');
const jsString = JSON.stringify(tokenConfigs);

const package = process.argv[2];

exec(`cd ${package} && npm run set-token-configs -- '${jsString}'`, (err) => {
  if (err) {
    console.error(err)
    return
  }
  
  console.log(`Successfully wrote token configs to the ${package}`);
});
