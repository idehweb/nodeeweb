import { LibraryBooksRounded, PostAddRounded } from '@mui/icons-material';

import automationCreate from './automationCreate';
import automationEdit from './automationEdit';
import automationList from './automationList';

const Automation = {
  list: automationList,
  edit: automationEdit,
  create: automationCreate,
  icon: LibraryBooksRounded,
  createIcon: PostAddRounded,
};
export default Automation;
