import { setTimeout } from 'timers/promises';

export default async function tryCount(cb, { max_count, wait = 5000, name }) {
  let count = 0,
    err_msg;
  while (count < max_count) {
    try {
      return await cb();
    } catch (err) {
      count++;
      console.log(
        'TryCount Error \n',
        `name : ${name}\n`,
        err,
        '\ncount',
        count
      );
      err_msg = String(err) + '\n' + err.message;
      await setTimeout(wait);
    }
  }
  throw new Error(`${name}\nmessage : ${err_msg}`);
}
