require('dotenv').config();
const { exec } = require('child_process');
const packageName = process.argv[2];

if (!process.env.NETWORK) {
  throw 'Missing "process.env.NETWORK"';
}

const getTokenConfigs = require('../contracts');

const tokenConfigs = getTokenConfigs(process.env.NETWORK);
const jsString = JSON.stringify(tokenConfigs);

exec(
  `cd ${packageName} && npm run set-token-configs -- '${jsString}'`,
  (err, stdout) => {
    if (err) {
      console.error(err);
      return;
    }

    if (stdout) {
      console.log(stdout.split('<*>')[1]);
    }
  }
);
