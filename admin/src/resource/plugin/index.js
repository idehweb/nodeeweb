import {
  Person,
  PersonAdd,
  AddBusinessIcon,
  DownloadDoneIcon,
} from '@mui/icons-material';

import userEdit from './userEdit';
import userCreate from './installed';
import userList from './userList';

const Plugin = {
  list: userList,
  edit: userEdit,
  create: userCreate,
  market:AddBusinessIcon ,
  installed: DownloadDoneIcon,
};
export default Plugin;
