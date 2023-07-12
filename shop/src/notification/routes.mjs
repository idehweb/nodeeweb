import controller from './controller.mjs'
export default [
    {
        "path": "/",
        "method": "post",
        "controller": controller.create,
    },{
        "path": "/:_id",
        "method": "put",
        "controller": controller.create,
    },
]