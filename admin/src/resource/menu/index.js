import menuCreate from "./menuCreate";
import menuEdit from "./menuEdit";
import menuList from "./menuList";
import menuShow from "./menuShow";
import { LibraryAdd,CategoryRounded } from "@mui/icons-material";

const Menu = {
  list: menuList,
  edit: menuEdit,
  create: menuCreate,
  show: menuShow,
  icon: CategoryRounded,
  createIcon: LibraryAdd,
};
export default Menu;