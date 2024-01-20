import deployCore from '@nodeeweb/core/deploy';
import '../utils/log';
import registerAdmin from './admin';
import registerAttribute from './attributes';
import registerCategory from './category';
import registerCustomer from './customer';
import registerDiscount from './discount';
import registerDocument from './document';
import registerEntry from './entry';
import registerForm from './form';
import registerGateway from './gateways';
import registerFile from './file';
import registerNotification from './notification';
import registerOrder from './order';
import registerActivity from './activity';
import registerPage from './page';
import registerPost from './post';
import registerProduct from './product';
import registerProductCategory from './productCategory';
import registerSettings from './config';
import logger from '../utils/log';
import { store } from '@nodeeweb/core';
import { handlePlugins } from './common/handlePlugins';
import registerCustomerGroup from './customerGroup';
import { registerShopConfig } from './config/config';
import registerTemplate from './template';
import initSeo from './seo';
import registerReport from './report';
import registerTransaction from './transaction';
import registerValidation from './validation';

export default async function bootstrap() {
  await deployCore();
  store.systemLogger = logger;

  // register config
  registerShopConfig();

  // validation
  registerValidation();

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
  registerTransaction();
  registerActivity();
  registerPage();
  registerPost();
  registerProduct();
  registerProductCategory();
  registerSettings();
  registerReport();
  await registerTemplate();
  // register plugins
  handlePlugins();
}
