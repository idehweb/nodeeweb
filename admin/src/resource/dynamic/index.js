import dynamicCreate from "./dynamicCreate";
import dynamicEdit from "./dynamicEdit";
import dynamicList from "./dynamicList";
import dynamicShow from "./dynamicShow";
import { Storefront,LocalMall } from "@mui/icons-material";

const Dynamic = {
  list:dynamicList,
  edit:dynamicEdit,
  create:dynamicCreate,
  show:dynamicShow,
  icon: Storefront,
  createIcon: LocalMall,
};
export default Dynamic;