import deployCore from "@nodeeweb/core/deploy";
import { createLogger } from "@nodeeweb/core/src/handlers/log.handler";
import store from "@nodeeweb/core/store";
import registerAttribute from "./src/attributes";
import registerCategory from "./src/category";
import registerCustomer from "./src/customer";
import registerDiscount from "./src/discount";

async function deployShop() {
  await deployCore();
  store.systemLogger = createLogger("shop", "Shop", 5);

  // register entity
  registerAttribute();
  registerCategory();
  registerCustomer();
  registerDiscount();
}

deployShop();
