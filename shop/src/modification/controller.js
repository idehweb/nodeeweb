import controller from "./controller.mjs";

export default [
  {
    path: "/",
    method: "get",
    access: "admin_user,admin_shopManager",
    controller: controller.all,
  },
  {
    path: "/:offset/:limit",
    method: "get",
    access: "admin_user,admin_shopManager",
    controller: controller.all,
  },
];
