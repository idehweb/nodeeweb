import automationCreate from "./automationCreate";
import automationEdit from "./automationEdit";
import automationList from "./automationList";
import { LibraryBooksRounded,PostAddRounded} from "@mui/icons-material";
const Automation = {
  list: automationList,
  edit: automationEdit,
  create: automationCreate,
  icon: LibraryBooksRounded,
  createIcon: PostAddRounded,
};
export default Automation;