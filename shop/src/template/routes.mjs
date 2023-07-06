import controller from "./controller.mjs";

export default [{
    "path": "/",
    "method": "post",
    "access": "admin_user",
    "controller": controller.create,

}, {
    "path": "/:id",
    "method": "put",
    "access": "admin_user",
    "controller": controller.edit,


}]