import notificationList from "./notificationList";
import notificationCreate from "./notificationCreate";
import notificationEdit from "./notificationEdit";
import { Send,Textsms } from "@mui/icons-material";

const Notification = {
  list: notificationList,
  edit: notificationEdit,
  create: notificationCreate,
  icon: Textsms,
  createIcon: Send,
};
export default Notification;