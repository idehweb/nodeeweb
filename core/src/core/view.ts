import { join } from 'path';
import store from '../../store';
import { getPublicDir } from '../../utils/path';
import logger from '../handlers/log.handler';
import { color } from '../../utils/color';

export function renderViewControllers() {
  const allPathExceptApi = '/:start(?!api):path(*)';
  store.app.use(allPathExceptApi, (req, res, next) => {
    res.sendFile(join(getPublicDir('front', true)[0], 'index.html'));
  });
  logger.log(color('Blue', `## CoreView ALL ${allPathExceptApi} ##`));
}
