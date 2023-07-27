import deployCore from '@nodeeweb/core/deploy';
import './utils/log';
import registerAdmin from './src/admin';
import registerAttribute from './src/attributes';
import registerCategory from './src/category';
import registerCustomer from './src/customer';
import registerDiscount from './src/discount';
import registerDocument from './src/document';
import registerEntry from './src/entry';
import registerForm from './src/form';
import registerGateway from './src/gateways';
import registerFile from './src/file';
import registerNotification from './src/notification';
import registerOrder from './src/order';
import registerModification from './src/modification';
import registerPage from './src/page';
import registerPost from './src/post';
import registerProduct from './src/product';
import registerProductCategory from './src/productCategory';
import registerSettings from './src/settings';
import logger from './utils/log';
import { store } from '@nodeeweb/core';
import { handlePlugins } from './src/common/handlePlugins';

async function deployShop() {
  await deployCore();
  store.systemLogger = logger;

  // register entity
  registerAdmin();
  registerAttribute();
  registerCategory();
  registerCustomer();
  registerDiscount();
  registerDocument();
  registerEntry();
  registerForm();
  registerGateway();
  registerFile();
  registerNotification();
  registerOrder();
  registerModification();
  registerPage();
  registerPost();
  registerProduct();
  registerProductCategory();
  registerSettings();

  // register plugins
  handlePlugins();
}

deployShop();
