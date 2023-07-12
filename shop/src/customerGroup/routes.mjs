import controller from "./controller.mjs";

export default [ {
    "path": "/authCustomer",
    "method": "post",
    "access": "customer_all",
    "controller": controller.authCustomer,

},{
    "path": "/activateCustomer",
    "method": "post",
    "access": "customer_all",
    "controller": controller.activateCustomer,

},{
    "path": "/authCustomerWithPassword",
    "method": "post",
    "access": "customer_all",
    "controller": controller.authCustomerWithPassword,

},{
    "path": "/authCustomerForgotPass",
    "method": "post",
    "access": "customer_all",
    "controller": controller.authCustomerForgotPass,

},{
    "path": "/setPassword",
    "method": "post",
    "access": "customer_user",
    "controller": controller.setPassword,

},{
    "path": "/updateAddress",
    "method": "put",
    "access": "customer_user",
    "controller": controller.updateAddress,

}]

// Zxcd1245#$%^