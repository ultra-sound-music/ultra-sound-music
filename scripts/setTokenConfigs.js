const { exec } = require('child_process');

const tokenConfigs = require('../contracts');
const HARD_CODED_ENV_FOR_NOW = 'local';
const jsString = JSON.stringify(tokenConfigs[HARD_CODED_ENV_FOR_NOW]);

const packageName = process.argv[2];

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
