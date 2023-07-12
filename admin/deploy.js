const FtpDeploy = require('ftp-deploy');

const ftpDeploy = new FtpDeploy();

require('dotenv').config({ path: '.env.local' });

const config = {
  sftp: process.env.FTP_SFTP,
  user: process.env.FTP_USER,
  // Password optional, prompted if none given
  password: process.env.FTP_PASS,
  host: process.env.FTP_HOST,
  port: process.env.FTP_PORT || 21,
  localRoot: __dirname + '/build',
  remoteRoot: process.env.FTP_REMOTE_ROOT,

  // this would upload everything
  include: ['*'],
  // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
  exclude: [],
  // delete ALL existing files at destination before uploading, if true
  deleteRemote: process.env.FTP_DELETE,
  // Passive mode is forced (EPSV command is not sent)
  forcePasv: true,
  debugMode: false,
};

ftpDeploy
  .deploy(config)
  .then((res) => console.log('finished:', res))
  .catch((err) => console.log(err));

ftpDeploy.on('uploading', (d) => {
  console.log(
    `${d.transferredFileCount} / ${d.totalFilesCount} => ${d.filename}`
  );
});

ftpDeploy.on('upload-error', function (data) {
  console.log('upload-error =>', data.err); // data will also include filename, relativePath, and other goodies
});
