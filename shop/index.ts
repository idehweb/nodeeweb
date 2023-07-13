import deployCore from '@nodeeweb/core/deploy';
import { createLogger } from '@nodeeweb/core/src/handlers/log.handler';
import store from '@nodeeweb/core/store';
import registerAttribute from './src/attributes';
import registerCategory from './src/category';
import registerCustomer from './src/customer';
import registerDiscount from './src/discount';
import registerDocument from './src/document';
import registerEntry from './src/entry';
import registerForm from './src/form';
import registerGateway from './src/gateways';
import registerMedia from './src/media';
import registerNotification from './src/notification';
import registerOrder from './src/order';
import registerModification from './src/modification';
import registerPage from './src/page';
import registerPost from './src/post';
import registerProduct from './src/product';
import registerProductCategory from './src/productCategory';

async function deployShop() {
  await deployCore();
  store.systemLogger = createLogger('shop', 'Shop', 5);

  // register entity
  registerAttribute();
  registerCategory();
  registerCustomer();
  registerDiscount();
  registerDocument();
  registerEntry();
  registerForm();
  registerGateway();
  registerMedia();
  registerNotification();
  registerOrder();
  registerModification();
  registerPage();
  registerPost();
  registerProduct();
  registerProductCategory();
}

deployShop();
