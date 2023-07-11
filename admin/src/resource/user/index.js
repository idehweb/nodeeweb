import userEdit from "./userEdit";
import userCreate from "./userCreate";
import userList from "./userList";
import { Person, PersonAdd } from "@mui/icons-material";

const User = {
  list: userList,
  edit: userEdit,
  create: userCreate,
  icon: Person,
  createIcon: PersonAdd
};
export default User;