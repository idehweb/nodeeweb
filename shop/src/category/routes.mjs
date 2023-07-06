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
    },
    {
        "path": "/:offset/:limit",
        "method": "get",
        "access": "admin_user,admin_shopManager,customer_all",
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