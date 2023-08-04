var FtpDeploy = require('ftp-deploy');
var axios = require('axios');
var ftpDeploy = new FtpDeploy();

require('dotenv').config({path: '.env.local'});

var config = {
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
};
ftpDeploy
  .deploy(config)
  .then((res) => {
    return axios
      .get(`${process.env.PUBLIC_URL}/customer/settings/reset`, {}, {})
      .then((res) => {
        console.log('finished ;)\n',res.data)
        // return res.data;
      })
      .catch((err) => {
        console.error('err in axios => ', err);
        // return err;
      });
  })
  .catch((err) => console.log(err));

ftpDeploy.on('uploading', (d) => {
  console.log(
    `${d.transferredFileCount} / ${d.totalFilesCount} => ${d.filename}`
  );
});

ftpDeploy.on('upload-error', function (data) {
  console.log('upload-error =>', data.err); // data will also include filename, relativePath, and other goodies
});
