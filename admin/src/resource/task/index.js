import taskCreate from "./taskCreate";
import taskList from "./taskList";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
// import FolderIcon from '@mui/icons-material/Folder';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
const Task = {
  list: taskList,
  create: taskCreate,
  icon: TaskAltIcon,
  createIcon: CreateNewFolderIcon,
};
export default Task;