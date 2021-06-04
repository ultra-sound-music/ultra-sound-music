const fs = require('fs');
const {exec} = require('child_process');

const contractAbi  = require('../contracts');
const jsString = `export default ${JSON.stringify(contractAbi)}`;

exec(`npm run set-abi -- '${jsString}'`, {cwd: './client'}, (err, stdout) => {
  if (err) {
    console.error(err)
    return
  }
});
