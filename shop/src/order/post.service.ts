import { MiddleWare } from '@nodeeweb/core';
import store from '../../store';

class PostService {
  getAll: MiddleWare = async (req, res) => {
    return res.json({ data: store.config.manual_post });
  };
}

const postService = new PostService();

export default postService;
