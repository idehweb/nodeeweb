import attributesCreate from "./attributesCreate";
import attributesEdit from "./attributesEdit";
import attributesList from "./attributesList";
import { ControlPointDuplicate,CategoryRounded } from "@mui/icons-material";
import FitbitIcon from '@mui/icons-material/Fitbit';
const Attributes = {
  list: attributesList,
  edit: attributesEdit,
  create: attributesCreate,
  icon: FitbitIcon,
  createIcon: ControlPointDuplicate,
};
export default Attributes;