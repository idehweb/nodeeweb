import controller from './controller.mjs'
export default [
    {
        "path": "/",
        "method": "get",
        "access": "admin_user,admin_shopManager",
        "controller": controller.all,

    },{
        "path": "/createByCustomer",
        "method": "post",
        "access": "admin_user,admin_shopManager,customer_user",
        "controller": controller.createByCustomer,


    },
    {
        "path": "/importFromWordpress",
        "method": "post",
        "access": "admin_user,admin_shopManager,customer_all",
        "controller": controller.importFromWordpress,
    }, {
        "path": "/rewriteOrders",
        "method": "post",
        "access": "admin_user,admin_shopManager,customer_all",
        "controller": controller.rewriteOrders,
    },
    {
        "path": "/count",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/cart",
        "method": "post",
        "access": "admin_user,admin_shopManager,customer_all",
        "controller": controller.createCart,
    },
    {
        "path": "/createPaymentLink",
        "method": "post",
        "access": "admin_user",
        "controller": controller.createPaymentLink,
    },
    {
        "path": "/cart/:id",
        "method": "post",
        "access": "admin_user,admin_shopManager,customer_all",
        "controller": controller.createCart,
    },
    {
        "path": "/myOrders/onlyMine/:id",
        "method": "get",
        "access": "admin_user,admin_shopManager,customer_user",
        "controller": controller.myOrder,
    },
    {
        "path": "/myOrders/mine/:offset/:limit",
        "method": "get",
        "access": "admin_user,admin_shopManager,customer_user",
        "controller": controller.allWOrders,
    },

    {
        "path": "/:offset/:limit",
        "method": "get",
        "access": "admin_user,admin_shopManager",
        "controller": controller.all,

    },
    {
        "path": "/:id",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.createAdmin,

    },
    {
        "path": "/:id",
        "method": "put",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/:id",
        "method": "delete",
        "access": "admin_user,admin_shopManager",
        "controller": controller.destroy,

    },
]