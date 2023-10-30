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
import registerSettings from './src/config';
import logger from './utils/log';
import { store } from '@nodeeweb/core';
import { handlePlugins } from './src/common/handlePlugins';
import registerCustomerGroup from './src/customerGroup';
import { registerShopConfig } from './src/config/config';
import registerTemplate from './src/template';
import initSeo from './src/seo';

async function deployShop() {
  await deployCore();
  store.systemLogger = logger;

  // register config
  registerShopConfig();

  // seo
  initSeo();

  // register entity
  registerAdmin();
  registerAttribute();
  registerCategory();
  registerCustomer();
  registerCustomerGroup();
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
  await registerTemplate();

  // register plugins
  handlePlugins();
}

deployShop();
