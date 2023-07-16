import sftp from "ssh2-sftp-client";

export default async function getSftpClient() {
  if (!process.env.SFTP_USERNAME) return;
  const client = new sftp("upload-backup");
  console.log("create SFTP connection");
  await client.connect({
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD,
    host: process.env.SFTP_IP,
    port: process.env.SFTP_PORT,
  });
  client.on("upload", (info) => {
    console.log(`Listener: Uploaded ${info.source}`);
  });
  return client;
}
