import controller from './controller.mjs'

export default [
    // {
    //     "path": "/",
    //     "method": "get",
    //     "access": "admin_user,admin_shopManager",
    //     "controller": controller.getAll,
    // },
    {
        "path": "/count",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/importFromWordpress",
        "method": "post",
        "controller": controller.importFromWordpress,
    }, {
        "path": "/rewritePosts",
        "method": "post",
        "controller": controller.rewritePosts,
    }, {
        "path": "/setPostsThumbnail",
        "method": "post",
        "controller": controller.setPostsThumbnail,
    },
    // {
    //     "path": "/:offset/:limit",
    //     "method": "get",
    //     "controller": controller.getAll,
    //
    //     // "access": "admin_user,admin_shopManager,customer_all",
    // },
    {
        "path": "/importFromWebzi/:offset/:limit",
        "method": "post",
        "controller": controller.importFromWebzi,
    }
]