import { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import {
  MenuItemLink,
  useResourceDefinitions,
  useSidebarState,
  useTranslate,
} from 'react-admin';
import { Dashboard, MoreHoriz } from '@mui/icons-material';

import { useSelector } from 'react-redux';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import SettingsInputHdmiIcon from '@mui/icons-material/SettingsInputHdmi';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

import resources from '@/resource/index';

import SubMenu from './SubMenu';

const {
  Automation,
  Action,
  Attributes,
  CustomerGroup,
  Discount,
  Page,
  Gateway,
  Template,
  ProductCategory,
  Customer,
  MainDashboard,
  Media,
  Order,
  Document,
  Note,
  Task,
  OrderCart,
  Post,
  Product,
  Settings,
  Notification,
  Transaction,
  User,
  Plugin,
} = resources;
const Menu = ({ onMenuClick, dense = false }) => {
  const themeData = useSelector((st) => st.themeData);

  console.log('MenusThemeData', themeData);

  const [state, setState] = useState({
    menuProduct: false,
    menuSection: false,
    shopSection: false,
    attributeSection: false,
    productCategorySection: false,
    discountSection: false,

    menuForm: false,
    menuOrder: false,
    menuCustomer: false,
    menuUser: false,
    menuPlugin: false,

    menuNotification: false,
    menuPost: false,
    menuMore: false,
  });
  const isXSmall = useMediaQuery((theme) => theme.breakpoints.down('xs'));
  const [open] = useSidebarState();
  const resources = useResourceDefinitions();
  const translate = useTranslate();
  const handleToggle = (menu) => {
    setState((state) => ({ ...state, [menu]: !state[menu] }));
  };
  let exclude = [
    'automation',
    'task',
    'note',
    'category',
    'document',
    'action',
    'attributes',
    'customergroup',
    'entry',
    'form',
    'gateway',
    'discount',
    'template',
    'settings',
    'order',
    'admin',
    'menu',
    'page',
    'notification',
    'media',
    'post',
    'customer',
    'product',
    'productcategory',
    'transaction',
    'plugin',
  ];

  return (
    <div className={'the-dev-menu'}>
      <MenuItemLink
        to={'/'}
        primaryText={translate(`pos.menu.dashboard`)}
        leftIcon={<Dashboard />}
        exact={'true'}
        dense={dense}
        className={'vas'}
      />

      <SubMenu
        handleToggle={() => handleToggle('menuMedia')}
        isOpen={state.menuMedia}
        name="media"
        label={translate(`pos.menu.medias`)}
        icon={<Media.icon />}
        dense={dense}>
        <MenuItemLink
          to={{
            pathname: '/file/create',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.addMedia`)}
          leftIcon={<Media.createIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/file',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.allMedias`)}
          leftIcon={<Media.icon />}
          dense={dense}
        />
        {/* <MenuItemLink
          to={{
            pathname: '/document/create',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.addDocument`)}
          leftIcon={<Document.createIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/document',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.allDocuments`)}
          leftIcon={<Document.icon />}
          dense={dense}
        /> */}
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle('menuForm')}
        isOpen={state.menuForm}
        name="form"
        label={translate(`pos.menu.forms`)}
        icon={<DynamicFormIcon />}
        dense={dense}>
        <MenuItemLink
          to={{
            pathname: '/form/create',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.addForm`)}
          leftIcon={<DynamicFormIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/form',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.allForms`)}
          leftIcon={<CheckBoxIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/entry',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.allEntries`)}
          leftIcon={<DocumentScannerIcon />}
          dense={dense}
        />
        {/* <MenuItemLink
          to={{
            pathname: '/entry/create',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.addEntry`)}
          leftIcon={<NoteAddIcon />}
          dense={dense}
        /> */}
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle('shopSection')}
        isOpen={state.shopSection}
        name="sections"
        label={translate('pos.menu.shop')}
        icon={<ShoppingBasketIcon />}
        dense={dense}>
        <SubMenu
          handleToggle={() => handleToggle('menuProduct')}
          isOpen={state.menuProduct}
          name="product"
          label={translate(`pos.menu.products`)}
          icon={<Product.icon />}
          dense={dense}>
          <MenuItemLink
            to={{
              pathname: '/product/create',
              state: { _scrollToTop: true },
            }}
            primaryText={translate(`pos.menu.addProduct`)}
            // leftIcon={<Product.createIcon/>}
            dense={dense}
          />
          <MenuItemLink
            to={{
              pathname: '/product',
              state: { _scrollToTop: true },
            }}
            primaryText={translate(`pos.menu.allProducts`)}
            // leftIcon={<Product.icon/>}
            dense={dense}
          />
        </SubMenu>

        <SubMenu
          handleToggle={() => handleToggle('attributeSection')}
          isOpen={state.attributeSection}
          name="sections"
          label={translate('pos.menu.attributes')}
          icon={<Attributes.icon />}
          dense={dense}>
          <MenuItemLink
            to={{
              pathname: '/attributes/create',
              state: { _scrollToTop: true },
            }}
            primaryText={translate(`pos.menu.addAttribute`)}
            // leftIcon={<Attributes.createIcon/>}
            dense={dense}
          />
          <MenuItemLink
            to={{
              pathname: '/attributes',
              state: { _scrollToTop: true },
            }}
            primaryText={translate(`pos.menu.allAttributes`)}
            // leftIcon={<Attributes.icon/>}
            dense={dense}
          />
        </SubMenu>
        <SubMenu
          handleToggle={() => handleToggle('productCategorySection')}
          isOpen={state.productCategorySection}
          name="sections"
          label={translate('pos.menu.category')}
          icon={<ProductCategory.icon />}
          dense={dense}>
          <MenuItemLink
            to={{
              pathname: '/productCategory/create',
              state: { _scrollToTop: true },
            }}
            primaryText={translate(`pos.menu.addCategory`)}
            // leftIcon={<ProductCategory.createIcon/>}
            dense={dense}
          />
          <MenuItemLink
            to={{
              pathname: '/productCategory',
              state: { _scrollToTop: true },
            }}
            primaryText={translate(`pos.menu.allCategories`)}
            // leftIcon={<ProductCategory.icon/>}
            dense={dense}
          />
        </SubMenu>
        <SubMenu
          handleToggle={() => handleToggle('discountSection')}
          isOpen={state.discountSection}
          name="sections"
          label={translate('pos.menu.discount')}
          icon={<Discount.icon />}
          dense={dense}>
          <MenuItemLink
            to={{
              pathname: '/discount/create',
              state: { _scrollToTop: true },
            }}
            primaryText={translate(`pos.menu.addDiscount`)}
            // leftIcon={<ProductCategory.createIcon/>}
            dense={dense}
          />
          <MenuItemLink
            to={{
              pathname: '/discount',
              state: { _scrollToTop: true },
            }}
            primaryText={translate(`pos.menu.allDiscounts`)}
            // leftIcon={<ProductCategory.icon/>}
            dense={dense}
          />
        </SubMenu>
        <SubMenu
          handleToggle={() => handleToggle('menuOrder')}
          isOpen={state.menuOrder}
          name="order"
          label={translate(`pos.menu.orders`)}
          icon={<Order.icon />}
          dense={dense}>
          <MenuItemLink
            to={{
              pathname: '/order',
              state: { _scrollToTop: true },
            }}
            primaryText={translate(`pos.menu.allOrders`)}
            // leftIcon={<Order.icon/>}
            dense={dense}
          />
          <MenuItemLink
            to={{
              pathname: '/ordercart',
              state: { _scrollToTop: true },
            }}
            primaryText={translate(`pos.menu.cart`)}
            // leftIcon={<OrderCart.icon/>}
            dense={dense}
          />
          <MenuItemLink
            to={{
              pathname: '/order/create',
              state: { _scrollToTop: true },
            }}
            primaryText={translate(`pos.menu.addOrder`)}
            // leftIcon={<OrderCart.icon/>}
            dense={dense}
          />
        </SubMenu>
        <SubMenu
          handleToggle={() => handleToggle('menuTransaction')}
          isOpen={state.menuTransaction}
          name="transaction"
          label={translate(`pos.menu.transactions`)}
          icon={<Transaction.icon />}
          dense={dense}>
          <MenuItemLink
            to={{
              pathname: '/transaction/create',
              state: { _scrollToTop: true },
            }}
            primaryText={translate(`pos.menu.addTransaction`)}
            // leftIcon={<OrderCart.icon/>}
            dense={dense}
          />
          <MenuItemLink
            to={{
              pathname: '/transaction',
              state: { _scrollToTop: true },
            }}
            primaryText={translate(`pos.menu.allTransactions`)}
            // leftIcon={<Transaction.icon/>}
            dense={dense}
          />
        </SubMenu>
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle('menuCustomer')}
        isOpen={state.menuCustomer}
        name="customer"
        label={translate(`pos.menu.customers`)}
        icon={<Customer.icon />}
        dense={dense}>
        <MenuItemLink
          to={{
            pathname: '/customer/create',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.addCustomer`)}
          leftIcon={<Customer.createIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/customer',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.allCustomers`)}
          leftIcon={<Customer.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/customerGroup',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.allCustomerGroup`)}
          leftIcon={<EmojiEmotionsIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/customerGroup/create',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.addCustomerGroup`)}
          leftIcon={<AddReactionIcon />}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle('menuUser')}
        isOpen={state.menuUser}
        name="users"
        label={translate(`pos.menu.users`)}
        icon={<User.icon />}
        dense={dense}>
        <MenuItemLink
          to={{
            pathname: '/admin/create',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.addUser`)}
          leftIcon={<User.createIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/admin',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.allUsers`)}
          leftIcon={<User.icon />}
          dense={dense}
        />
      </SubMenu>

      <SubMenu
        handleToggle={() => handleToggle('menuPlugin')}
        isOpen={state.menuPlugin}
        name="plugin"
        label={translate(`pos.menu.plugin`)}
        icon={<SettingsInputHdmiIcon />}
        dense={dense}>
        <MenuItemLink
          to={{
            pathname: '/plugin/market',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.marketPlugin`)}
          leftIcon={<Plugin.market />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/plugin/local',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.localPlugin`)}
          leftIcon={<Plugin.installed />}
          dense={dense}
        />
      </SubMenu>

      <SubMenu
        handleToggle={() => handleToggle('menuNotification')}
        isOpen={state.menuNotification}
        name="notification"
        label={translate(`pos.menu.notification`)}
        icon={<Notification.icon />}
        dense={dense}>
        <MenuItemLink
          to={{
            pathname: '/notification/create',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.sendNotification`)}
          leftIcon={<Notification.createIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/notification',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.allNotification`)}
          leftIcon={<Notification.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/messages',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.messagesSettings`)}
          leftIcon={<Notification.icon />}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle('menuPost')}
        isOpen={state.menuPost}
        name="sms"
        label={translate(`pos.menu.post`)}
        icon={<Post.icon />}
        dense={dense}>
        <MenuItemLink
          to={{
            pathname: '/post/create',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.createPost`)}
          leftIcon={<Post.createIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/post',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.allPost`)}
          leftIcon={<Post.icon />}
          dense={dense}
        />

        <MenuItemLink
          to={{
            pathname: '/page/create',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.createPage`)}
          leftIcon={<Page.createIcon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/page',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.allPage`)}
          leftIcon={<Page.icon />}
          dense={dense}
        />
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle('menuMore')}
        isOpen={state.menuMore}
        name="more"
        label={translate(`pos.menu.more`)}
        icon={<MoreHoriz />}
        dense={dense}>
        {/* <MenuItemLink
          to={{
            pathname: '/plugins',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.plugins`)}
          leftIcon={<SettingsInputHdmiIcon />}
          dense={dense}
        /> */}
        <MenuItemLink
          to={{
            pathname: '/template',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.templates`)}
          leftIcon={<Template.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/action',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.siteActions`)}
          leftIcon={<Action.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/gateway',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.allGateways`)}
          leftIcon={<Gateway.icon />}
          dense={dense}
        />
        {/*<MenuItemLink*/}
        {/*to={{*/}
        {/*pathname: "/gateway/create",*/}
        {/*state: { _scrollToTop: true }*/}
        {/*}}*/}
        {/*primaryText={translate(`pos.menu.addGateway`)}*/}
        {/*leftIcon={<Gateway.createIcon/>}*/}
        {/*dense={dense}*/}
        {/*/>*/}
        <MenuItemLink
          to={{
            pathname: '/settings',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.siteSettings`)}
          leftIcon={<Settings.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/task',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.tasks`)}
          leftIcon={<Task.icon />}
          dense={dense}
        />
        <MenuItemLink
          to={{
            pathname: '/note',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.notes`)}
          leftIcon={<Note.icon />}
          dense={dense}
        />{' '}
        <MenuItemLink
          to={{
            pathname: '/automation',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`pos.menu.automation`)}
          leftIcon={<Automation.icon />}
          dense={dense}
        />
        {themeData &&
          themeData.models &&
          themeData.models.map((model, m) => {
            if (exclude.indexOf(model.toLowerCase()) == -1) {
              let modelName = model.toLowerCase();
              return (
                <MenuItemLink
                  to={{
                    pathname: '/' + modelName,
                    state: { _scrollToTop: true },
                  }}
                  primaryText={translate(`${modelName}`)}
                  leftIcon={<Dashboard />}
                  exact={'true'}
                  dense={dense}
                  className={'vas'}
                />
              );
            }
          })}
      </SubMenu>
    </div>
  );
};

export default Menu;
