import controller from './controller.mjs'
export default [{
    "path": "/entry/:form",
    "method": "post",
    "access": "customer_all",
    "controller": controller.addEntry,

}]