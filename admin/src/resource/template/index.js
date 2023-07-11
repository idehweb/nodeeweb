import templateCreate from "./templateCreate";
import templateEdit from "./templateEdit";
import templateList from "./templateList";
import { LibraryBooksRounded,PostAddRounded} from "@mui/icons-material";
import BrushIcon from '@mui/icons-material/Brush';
const Template = {
  list: templateList,
  edit: templateEdit,
  create: templateCreate,
  icon: BrushIcon,
  createIcon: PostAddRounded,
};
export default Template;