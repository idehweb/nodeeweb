const fs = require('fs');
const { join } = require('path');
const { exit } = require('process');

const [, , path, key, value] = process.argv;

const envBk = join(path, '..', '.env.local.bk');

const envs = fs.readFileSync(path, { encoding: 'utf8' });

const new_env = envs
  .split('\n')
  .map((kv) => kv.replace(new RegExp(`${key}=.+`), `${key}="${value}"`))
  .join('\n');

fs.cpSync(path, envBk);
fs.writeFileSync(path, new_env, 'utf8');

console.log(`replace ${key} with ${value} done`);
exit(0);
