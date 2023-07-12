import Controller from './controller.mjs';

export default [
  {
    path: '/',
    method: 'get',
    // access: 'admin_user,admin_shopManager',
    controller: Controller.getAll,
  },
  {
    path: '/',
    method: 'post',
    // access: 'admin_user,admin_shopManager',
    controller: Controller.createOne,
  },
  {
    path: '/:id',
    method: 'put',
    // access: 'admin_user,admin_shopManager',
    controller: Controller.updateOne,
  },
  {
    path: '/:id',
    method: 'delete',
    // access: 'admin_user,admin_shopManager',
    controller: Controller.deleteOne,
  },
];
