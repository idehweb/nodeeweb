import { CronJob } from "cron";
import main from "./src/main.js";

function server() {
  new CronJob({
    timeZone: "Asia/Tehran",
    async onTick() {
      try {
        await main();
      } catch (err) {}
    },
    cronTime: process.env.CRON_EXPR ?? "0 0 * * *",
    start: true,
  }).start();
}

server();
