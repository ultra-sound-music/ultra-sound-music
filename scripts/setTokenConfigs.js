const fs = require('fs');
const { exec } = require('child_process');

const tokenConfigs = require('../contracts');
const jsString = JSON.stringify(tokenConfigs);

const packageName = process.argv[2];

exec(
  `cd ${packageName} && npm run set-token-configs -- '${jsString}'`,
  (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`Successfully wrote token configs to the ${packageName}`);
  }
);
