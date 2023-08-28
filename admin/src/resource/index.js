import Automation from './automation/index';
import Action from './action/index';
import Attributes from './attributes/index';
import ProductCategory from './productCategory/index';
import Customer from './customer/index';
import CustomerGroup from './customerGroup/index';
import Document from './document/index';
import Note from './note/index';
import Task from './task/index';
import Entry from './entry/index';
import Form from './form/index';
import MainDashboard from './dashboard/index';
import Media from './media/index';
import Menu from './menu/index';
import Discount from './discount/index';
import Order from './order/index';
import OrderCart from './orderCart/index';
import PageBuilder from './pageBuilder/index';
import Page from './page/index';
import Post from './post/index';
import Product from './product/index';
import Configuration from './configuration/Configuration';
import Plugins from './plugins/Plugins';
// import Plugin from './plugins/Plugin';
import Plugin from './plugin/index';
import Messages from './configuration/Messages';
import PrivateConfiguration from './configuration/PrivateConfiguration';

import Notification from './notification/index';
import Transaction from './transaction/index';
import User from './user/index';
import Settings from './setting/index';
import Dynamic from './dynamic/index';
import Gateway from './gateway/index';
import Template from './template/index';
import Logout from './logout';

const resources = {
  Attributes,
  Automation,
  Plugins,
  Plugin,
  Gateway,
  Dynamic,
  CustomerGroup,
  Document,
  Entry,
  Form,
  Note,
  Task,
  Action,
  Discount,
  Page,
  Template,
  ProductCategory,
  Configuration,
  Logout,
  PrivateConfiguration,
  Messages,
  Customer,
  MainDashboard,
  Media,
  Menu,
  Order,
  OrderCart,
  PageBuilder,
  Post,
  Product,
  Settings,
  Notification,
  Transaction,
  User,
};

export default resources;
