import controller from './controller.mjs';

export default [
  {
    path: '/login',
    method: 'post',
    controller: controller.login,
  },
  {
    path: '/',
    method: 'post',
    access: 'admin_user',
    controller: controller.register,
  },
  {
    path: '/resetAdmin',
    method: 'post',
    access: 'admin_user',
    controller: controller.resetAdmin,
  },
  {
    path: '/config',
    method: 'put',
    access: 'admin_user',
    controller: controller.changeConfig,
  },
  {
    path: '/:id',
    method: 'put',
    access: 'admin_user',
    controller: controller.edit,
  },
];
