import campaignList from "./campaignList";
import campaignCreate from "./campaignCreate";
import campaignEdit from "./campaignEdit";
import { Send,Textsms } from "@mui/icons-material";

const Campaign = {
  list: campaignList,
  edit: campaignEdit,
  create: campaignCreate,
  icon: Textsms,
  createIcon: Send,
};
export default Campaign;