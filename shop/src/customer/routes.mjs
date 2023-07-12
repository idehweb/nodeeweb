import controller from './controller.mjs';

export default [
  {
    path: '/',
    method: 'get',
    access: 'admin_user,admin_shopManager',
    controller: controller.allCustomers,
  },
  {
    path: '/auth/google',
    method: 'post',
    access: 'customer_all',
    controller: controller.authWithGoogle,
  },
  {
    path: '/authCustomer',
    method: 'post',
    access: 'customer_all',
    controller: controller.authCustomer,
  },
  {
    path: '/activateCustomer',
    method: 'post',
    access: 'customer_all',
    controller: controller.activateCustomer,
  },
  {
    path: '/authCustomerWithPassword',
    method: 'post',
    access: 'customer_all',
    controller: controller.authCustomerWithPassword,
  },
  {
    path: '/authCustomerForgotPass',
    method: 'post',
    access: 'customer_all',
    controller: controller.authCustomerForgotPass,
  },
  {
    path: '/setPassword',
    method: 'post',
    access: 'customer_user',
    controller: controller.setPassword,
  },
  {
    path: '/updateAddress',
    method: 'put',
    access: 'customer_user',
    controller: controller.updateAddress,
  },
  {
    path: '/rewriteCustomers',
    method: 'get',
    access: 'customer_all',
    controller: controller.rewriteCustomers,
  },
  {
    path: '/removeDuplicatesCustomers',
    method: 'get',
    access: 'customer_all',
    controller: controller.removeDuplicatesCustomers,
  },
  {
    path: '/getme',
    method: 'get',
    access: 'customer_user',
    controller: controller.getme,
  },
  {
    path: '/status/:_id',
    method: 'put',
    access: 'admin_user',
    controller: controller.status,
  },
  {
    path: '/:offset/:limit',
    method: 'get',
    access: 'admin_user,admin_shopManager',
    controller: controller.allCustomers,
  },
];
