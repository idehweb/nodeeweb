import orderCreate from "./orderCreate";
import orderEdit from "./orderEdit";
import orderList from "./orderList";
import { Receipt,AddShoppingCartOutlined } from "@mui/icons-material";


const Order = {
  list: orderList,
  edit: orderEdit,
  create: orderCreate,
  icon: Receipt,
  createIcon: AddShoppingCartOutlined,
};
export default Order;