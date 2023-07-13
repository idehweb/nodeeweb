import { LibraryBooksRounded, PostAddRounded } from '@mui/icons-material';

import postCreate from './postCreate';
import postEdit from './postEdit';
import postList from './postList';

const Post = {
  list: postList,
  edit: postEdit,
  create: postCreate,
  icon: LibraryBooksRounded,
  createIcon: PostAddRounded,
};
export default Post;
