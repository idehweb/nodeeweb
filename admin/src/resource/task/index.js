import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

import TaskAltIcon from '@mui/icons-material/TaskAlt';

import taskCreate from './taskCreate';
import taskList from './taskList';
// import FolderIcon from '@mui/icons-material/Folder';

const Task = {
  list: taskList,
  create: taskCreate,
  icon: TaskAltIcon,
  createIcon: CreateNewFolderIcon,
};
export default Task;
