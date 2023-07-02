import "./src/common/loadEnv";
import store from "./store";
import { dbConnect } from "./src/common/dbHandler";
import buildApp from "./app";
import { log } from "./utils/log";
import gracefullyShutdown from "./src/common/gracefullyShutdown";

async function main() {
  // start connect db
  await dbConnect();

  //  create express app
  const app = await buildApp();

  //   listen app
  const server = app.listen(store.env.PORT, () => {
    log(`Server Listening at http://127.0.0.1:${store.env.PORT}`);
  });

  // set gracefully shutdown , health path
  gracefullyShutdown(server);
}
main();
