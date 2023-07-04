import "./src/core/loadEnv";
import store from "./store";
import buildApp from "./src/core/app";
import logger from "./src/handlers/log.handler";
import { dbConnect } from "./src/core/db";
import gracefullyShutdown from "./src/core/shutdown";
import { color } from "./utils/color";

async function main() {
  // start connect db
  await dbConnect();

  //  create express app
  const app = await buildApp();

  //   listen app
  const server = app.listen(store.env.PORT, () => {
    const address = `http://127.0.0.1:${store.env.PORT}`;
    const msg = `Server Listening at ${color("Green", address)}`;
    logger.log(msg);
  });

  // set gracefully shutdown , health path
  gracefullyShutdown(server);
}

main();
