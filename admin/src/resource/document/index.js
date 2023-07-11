import documentCreate from "./documentCreate";
import documentList from "./documentList";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FolderIcon from '@mui/icons-material/Folder';
const Document = {
  list: documentList,
  create: documentCreate,
  icon: FolderIcon,
  createIcon: CreateNewFolderIcon,
};
export default Document;