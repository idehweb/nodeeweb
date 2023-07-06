import controller from './controller.mjs'
export default [
    {
        "path": "/",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/count",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    }, {
        "path": "/set/:order_id/:id",
        "method": "get",
        "access": "admin_user,admin_shopManager,customer_user",
        "controller": controller.setDiscount
    },
    {
        "path": "/:offset/:limit",
        "method": "get",
        "access": "admin_user,admin_shopManager",
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
    },
]