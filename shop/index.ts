import deployCore from "@nodeeweb/core/deploy";
import { createLogger } from "@nodeeweb/core/src/handlers/log.handler";
import store from "@nodeeweb/core/store";
import registerAttribute from "./src/attributes";

async function deployShop() {
  await deployCore();
  store.systemLogger = createLogger("shop", "Shop", 5);

  // register entity
  registerAttribute();
}

deployShop();