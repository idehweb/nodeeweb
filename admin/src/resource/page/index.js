import pageCreate from "./pageCreate";
import pageEdit from "./pageEdit";
import pageList from "./pageList";
import { LibraryBooksRounded,PostAddRounded} from "@mui/icons-material";
const Page = {
  list: pageList,
  edit: pageEdit,
  create: pageCreate,
  icon: LibraryBooksRounded,
  createIcon: PostAddRounded,
};
export default Page;