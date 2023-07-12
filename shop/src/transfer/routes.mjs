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
    },
    {
        "path": "/:offset/:limit",
        "method": "get",
        // "access": "admin_user,admin_shopManager,customer_all",
    },
    {
        "path": "/:id",
        "method": "get",
        "access": "customer_all",
        // "controller":()=>{
        //     console.log('hi')
        // }
    },
    {
        "path": "/",
        "method": "post",
        "access": "admin_user,admin_shopManager",
    },
    // {
    //     "path": "/importFromWordpress",
    //     "method": "post",
    //     "access": "admin_user,admin_shopManager",
    //     "controller": controller.importFromWordpress,
    // },
    {
        "path": "/rewriteProducts",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.rewriteProducts,
    },
    {
        "path": "/rewriteProductsImages",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.rewriteProductsImages,
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