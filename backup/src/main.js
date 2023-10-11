import { join, resolve } from 'path';
import './loadEnv.js';
import { spawn } from 'child_process';
import { Telegraf } from 'telegraf';
import * as fs from 'fs';
import tryCount from './trycount.js';
import { dirSize, getFileName } from './utils.js';
import getSftpClient from './sftp.js';
import { SocksProxyAgent } from 'socks-proxy-agent';

const agent =
  process.env.SOCKS_URL &&
  process.env.SOCKS_URL !== 'false' &&
  process.env.SOCKS_URL !== 'null'
    ? new SocksProxyAgent(process.env.SOCKS_URL)
    : undefined;

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, {
  telegram: { agent },
});
let sftp_client;

async function backup() {
  const res_path = join(
    process.env.LOCAL_PATH,
    `${process.env.SERVER_NAME}-${new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
      .format(new Date())
      .replace(/\//g, '-')}.tar.gz`
  );

  try {
    await fs.promises.mkdir(process.env.LOCAL_PATH, { recursive: true });
  } catch (err) {}

  if (process.env.NODE_ENV !== 'production') {
    return await new Promise((resolve, reject) => {
      fs.writeFileSync(res_path, 'my file', 'utf8');
      fs.writeFileSync(`${res_path}-part00`, 'my file', 'utf8');
      fs.writeFileSync(`${res_path}-part01`, 'my file', 'utf8');
      resolve(res_path);
    });
  }

  return await tryCount(
    () =>
      new Promise((resolve, reject) => {
        const stream = spawn(
          `./script/backup.sh ${process.env.MONGO_URL} ${res_path}`,
          {
            stdio: [process.stdin, process.stdout, process.stderr],
            shell: true,
          }
        );

        // const t = setTimeout(() => {
        //   reject('execute backup.sh timeout');
        // }, 30 * 60 * 1000);
        let err_msg = '';
        stream.on('error', (err) => {
          err_msg += String(err);
        });
        stream.on('close', (code) => {
          // clearTimeout(t);
          if (code !== null && code !== 0)
            return reject(
              `backup.sh none-zero code\nmessage : ${err_msg}\ncode:${code}`
            );
          resolve(res_path);
        });
      }),
    { max_count: 10, wait: 5000, name: 'Backup.sh' }
  );
}

async function uploadToServer(src) {
  if (!sftp_client) sftp_client = await getSftpClient();

  try {
    const file_name = getFileName(src);
    await tryCount(
      async () => {
        const result = await sftp_client.fastPut(
          src,
          `${process.env.SFTP_PATH}/${file_name}`
        );
        console.log(result);
      },
      { max_count: 10, name: 'SFTP' }
    );
  } catch (err) {
    console.log('sftp error : ', err);
    throw err;
  }
}

async function uploadToTelegram(src) {
  const file_name = getFileName(src);
  const chunk_files = (await fs.promises.readdir(process.env.LOCAL_PATH))
    .filter((file) => file.includes(`${file_name}.part`))
    .map((file) => `${process.env.LOCAL_PATH}/${file}`);

  for (const chunk of chunk_files) {
    await tryCount(
      async () => {
        await bot.telegram.sendDocument(process.env.TELEGRAM_CHANNEL_ID, {
          source: new fs.createReadStream(chunk),
          filename: getFileName(chunk),
        });
        await fs.promises.rm(chunk);
      },
      { max_count: 20, name: 'Telegram Upload' }
    );
  }
}

async function sendTelegramNotif(msg) {
  if (!process.env.TELEGRAM_BOT_TOKEN) return;
  await tryCount(
    async () => {
      await bot.telegram.sendMessage(
        process.env.TELEGRAM_CHANNEL_ID,
        `<b>${process.env.SERVER_NAME}</b>\n${msg}`,
        {
          parse_mode: 'HTML',
        }
      );
    },
    { max_count: 10, name: 'Telegram Notification' }
  );
}

async function removeOld() {
  if (!sftp_client && process.env.SFTP_USERNAME)
    try {
      sftp_client = await getSftpClient();
    } catch (err) {}

  const size = await dirSize(process.env.LOCAL_PATH);
  if (size <= +process.env.MAX_BACKUP_STORAGE_MB) return;

  //  detect old files
  let reduce_size = size - +process.env.MAX_BACKUP_STORAGE_MB;
  const stats = await Promise.all(
    (
      await fs.promises.readdir(process.env.LOCAL_PATH)
    ).map(async (file_name) => {
      const stat = await fs.promises.stat(
        join(process.env.LOCAL_PATH, file_name)
      );
      return {
        name: file_name,
        local_path: join(process.env.LOCAL_PATH, file_name),
        sftp_path: `${process.env.SFTP_PATH}/${file_name}`,
        isFile: stat.isFile(),
        birthtimeMs: stat.birthtimeMs,
        size: stat.size / 1024 ** 2,
      };
    })
  );
  const must_remove_stats = [];
  for (const stat of stats
    .filter((stat) => stat.isFile)
    .sort((as, bs) => as.birthtimeMs - bs.birthtimeMs)) {
    if (reduce_size <= 0.5) break;
    must_remove_stats.push(stat);
    reduce_size -= stat.size;
  }

  // remove
  for (const stat of must_remove_stats) {
    console.log('remove : ', stat.name);
    try {
      await fs.promises.rm(stat.local_path);
      if (sftp_client) await sftp_client.delete(stat.sftp_path, true);
    } catch (err) {
      console.log('remove error\n', err);
    }
  }
}

export default async function main() {
  try {
    // create backup files
    const backup_file = await backup();
    console.log('create backup file');

    // upload to sftp server
    if (process.env.SFTP_USERNAME) {
      try {
        await uploadToServer(backup_file);
        console.log('uploaded into sftp server');
      } catch (err) {
        console.log('sftp error', err);
        await sendTelegramNotif(`SFTP Error\n${err?.toString()}`);
      }
    }

    // upload to telegram
    if (process.env.TELEGRAM_BOT_TOKEN) {
      try {
        await uploadToTelegram(backup_file);
        console.log('uploaded into telegram channel');
      } catch (err) {
        console.log('telegram upload', err);
        await sendTelegramNotif(`Telegram Upload Error\n${err?.toString()}`);
      }
    }

    // send notification
    await sendTelegramNotif(`Upload Complete\nfile name : ${backup_file}`);

    // remove old
    try {
      await removeOld();
    } catch (err) {
      console.log('remove old error', err);
      await sendTelegramNotif(`Remove old Error\n${err?.toString()}`);
    }

    try {
      if (sftp_client) await sftp_client.end();
    } catch (err) {}
  } catch (err) {
    console.log('System error\n', err);
    await sendTelegramNotif(`Upload Error\n${err?.toString()}`);
    try {
      if (sftp_client) await sftp_client.end();
    } catch (err) {}
  }
}

// main();
