const { spawn } = require('child_process');

module.exports = function exec(cmd, { onLog } = {}) {
  if (onLog) onLog(cmd, false);
  return new Promise((resolve, reject) => {
    let res_ok = '',
      res_err = '';
    const sp = spawn(cmd, { shell: true, cwd: '.' });
    sp.stdout.on('data', (msg) => {
      res_ok += msg;
      if (onLog) onLog(String(msg), false);
    });
    sp.stderr.on('data', (msg) => {
      res_err += msg;
      if (onLog) onLog(String(msg), true);
    });
    sp.on('error', (err) => {
      const msg = err?.toString ? err.toString() : String(err);
      res_err += msg;
      if (onLog) onLog(msg, true);
    });
    sp.on('close', (code) => {
      if (code !== 0) {
        reject(res_err);
      } else {
        resolve(res_ok);
      }
    });
  });
};
