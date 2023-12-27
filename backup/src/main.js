import { join, resolve } from 'path';
import './loadEnv.js';
import { spawn } from 'child_process';
import { Telegraf } from 'telegraf';
import * as fs from 'fs';
import tryCount from './trycount.js';
import { dirSize, getFileName, isInit } from './utils.js';
import getSftpClient from './sftp.js';
import { SocksProxyAgent } from 'socks-proxy-agent';

const agent = isInit(process.env.SOCKS_URL)
  ? new SocksProxyAgent(process.env.SOCKS_URL)
  : undefined;

const bot = isInit(process.env.TELEGRAM_BOT_TOKEN)
  ? new Telegraf(process.env.TELEGRAM_BOT_TOKEN, {
      telegram: { agent },
    })
  : null;

let sftp_client, oldBackups;

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
  try {
    if (!sftp_client) sftp_client = await getSftpClient();
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
    console.error('sftp error : ', err);
    await sendTelegramNotif(`SFTP Error\n${err?.toString()}`);
  }
}

async function uploadToTelegram(src) {
  if (!bot) {
    console.warn('try to upload into telegram while telegram bot not initiate');
    return;
  }
  const file_name = getFileName(src);
  const chunk_files = (await fs.promises.readdir(process.env.LOCAL_PATH))
    .filter((file) => file.includes(`${file_name}.part`))
    .map((file) => `${process.env.LOCAL_PATH}/${file}`);

  try {
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
  } catch (err) {
    console.error('telegram error : ', err);
    await sendTelegramNotif(`telegram error\n${err?.toString()}`);
  }
}

async function sendTelegramNotif(msg) {
  if (!bot) {
    console.warn(
      'try to send notification into telegram while telegram bot not initiate'
    );
    return;
  }

  try {
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
  } catch (err) {
    console.error('telegram notif error:', `message: ${msg}\n`, err);
  }
}

async function getOldBackups() {
  if (oldBackups) return oldBackups;

  const size = await dirSize(process.env.LOCAL_PATH);
  if (size <= +process.env.MAX_BACKUP_STORAGE_MB) return [];

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

  oldBackups = must_remove_stats;
  return must_remove_stats;
}

async function removeOldLocal() {
  // remove
  try {
    const must_remove_stats = await getOldBackups();
    for (const stat of must_remove_stats) {
      console.log('remove local : ', stat.name);
      try {
        await fs.promises.rm(stat.local_path);
      } catch (err) {
        console.error(`remove local stat ${stat.name} error\n`, err);
      }
    }
  } catch (err) {
    console.error('remove local error\n', err);
    await sendTelegramNotif(`remove local error\n${err?.toString()}`);
  }
}
async function removeOldRemote() {
  // remove
  try {
    if (!sftp_client && process.env.SFTP_USERNAME)
      sftp_client = await getSftpClient();
    const must_remove_stats = await getOldBackups();
    for (const stat of must_remove_stats) {
      console.log('remove remote : ', stat.name);
      try {
        await sftp_client.delete(stat.sftp_path, true);
      } catch (err) {
        console.error(`remove remote stat ${stat.name} error\n`, err);
      }
    }
  } catch (err) {
    console.error('remove remote error\n', err);
    await sendTelegramNotif(`remove remote error\n${err?.toString()}`);
  }
}

export default async function main() {
  try {
    // create backup files
    const backup_file = await backup();
    console.log('create backup file');

    // upload to sftp server
    if (isInit(process.env.SFTP_USERNAME)) {
      await uploadToServer(backup_file);
      console.log('uploaded into sftp server');
    }

    // upload to telegram and notif
    if (isInit(process.env.TELEGRAM_BOT_TOKEN)) {
      await uploadToTelegram(backup_file);
      console.log('uploaded into telegram channel');

      // send notification
      await sendTelegramNotif(`Upload Complete\nfile name : ${backup_file}`);
    }

    // remove old
    await removeOldLocal();
    await removeOldRemote();

    // close sftp
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
