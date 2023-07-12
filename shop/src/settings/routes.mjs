import controller from './controller.mjs';

export default [
  {
    path: '/',
    method: 'get',
    access: 'customer_all',
    controller: controller.last,
  },
  {
    path: '/restart',
    method: 'post',
    access: 'admin_user',
    controller: controller.restart,
  },
  {
    path: '/functions/:offset/:limit',
    method: 'get',
    access: 'admin_user',
    controller: controller.functions,
  },
  {
    path: '/events/:offset/:limit',
    method: 'get',
    access: 'admin_user',
    controller: controller.events,
  },
  {
    path: '/plugins/rules/:plugin',
    method: 'get',
    access: 'admin_user',
    controller: controller.pluginRules,
  },
  {
    path: '/plugins/rules/:plugin',
    method: 'put',
    access: 'admin_user',
    controller: controller.updatePluginRules,
  },
  {
    path: '/customerStatus',
    method: 'get',
    access: 'admin_user',
    controller: controller.customerStatus,
  },
  {
    path: '/formStatus',
    method: 'get',
    access: 'admin_user',
    controller: controller.formStatus,
  },
  {
    path: '/configuration',
    method: 'put',
    access: 'admin_user',
    controller: controller.configuration,
  },
  {
    path: '/factore',
    method: 'get',
    access: 'admin_user',
    controller: controller.factore,
  },
  {
    path: '/plugins',
    method: 'get',
    access: 'admin_user',
    controller: controller.plugins,
  },
  {
    path: '/deActivePlugins',
    method: 'get',
    access: 'admin_user',
    controller: controller.deActivePlugins,
  },
  {
    path: '/market',
    method: 'get',
    access: 'admin_user',
    controller: controller.market,
  },
  {
    path: '/deactivatePlugin',
    method: 'put',
    access: 'admin_user',
    controller: controller.deactivatePlugin,
  },
  {
    path: '/activatePlugin',
    method: 'put',
    access: 'admin_user',
    controller: controller.activatePlugin,
  },
  {
    path: '/update',
    method: 'post',
    access: 'admin_user',
    controller: controller.update,
  },
  {
    path: '/fileUpload',
    method: 'post',
    access: 'admin_user',
    controller: controller.fileUpload,
  },
  {
    path: '/:id',
    method: 'put',
    access: 'admin_user',
  },
  {
    path: '/health',
    method: 'get',
    controller: controller.health,
  },
];
