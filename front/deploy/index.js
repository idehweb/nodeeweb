const fs = require('fs');
const SFTP = require('ssh2-sftp-client');
const { config } = require('dotenv');
const exec = require('./exec');

config({ path: 'deploy/.deploy.env' });

const sftp = new SFTP();

async function connect() {
  try {
    let privateKey;
    const privateKeyPath = process.env.SSH_PRIVATE_KEY_PATH;
    if (privateKeyPath)
      privateKey = await fs.promises.readFile(privateKeyPath, 'utf8');
    await sftp.connect({
      host: process.env.SSH_HOST,
      username: process.env.SSH_USERNAME,
      password: process.env.SSH_PASSWORD || undefined,
      privateKey,
      port: process.env.SSH_PORT ?? 22,
    });
    console.log('[connect]', 'sftp connect');
  } catch (err) {
    console.error('[connect]', err);
    throw err;
  }
}

async function build() {
  try {
    await exec('yarn build', {
      onLog(msg, isError) {
        console[isError ? 'error' : 'log']('[build]', msg);
      },
    });
  } catch (err) {
    console.error('[build]', err);
    throw err;
  }
}

async function del() {
  let remotePath = process.env.REMOTE_PATH;
  if (remotePath.endsWith('/')) remotePath = remotePath.slice(0, -1);
  if (remotePath === '/') throw new Error('invalid remote path', remotePath);
  const rm = await sftp.rmdir(remotePath, true);
  console.log('[delete]', rm);
  await sftp.mkdir(remotePath, true);
}

async function scp() {
  try {
    const localPath = process.env.LOCAL_PATH || 'build/',
      remotePath = process.env.REMOTE_PATH;
    const result = await sftp.uploadDir(localPath, remotePath, {
      useFastput: true,
    });
    console.log('[scp]', result);
  } catch (err) {
    console.error('[scp]', err);
    throw err;
  }
}

async function main() {
  console.time('deploy');

  try {
    await build();
    await connect();
    await del();
    await scp();
    await sftp.end();
  } catch (error) {
    throw error;
  } finally {
    console.timeEnd('deploy');
  }
}

main();
