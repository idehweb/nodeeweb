import categoryCreate from "./categoryCreate";
import categoryEdit from "./categoryEdit";
import categoryList from "./categoryList";
import categoryShow from "./categoryShow";
import { LibraryAdd,CategoryRounded } from "@mui/icons-material";

const Category = {
  list: categoryList,
  edit: categoryEdit,
  create: categoryCreate,
  show: categoryShow,
  icon: CategoryRounded,
  createIcon: LibraryAdd,
};
export default Category;