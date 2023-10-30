import { join } from 'path';
import store from '../../store';
import { getPublicDir } from '../../utils/path';
import logger from '../handlers/log.handler';
import { color } from '../../utils/color';
import { MiddleWare } from '../../types/global';
import { PageModel } from '../../schema/page.schema';
import { registerRoute } from '../handlers/view.handler';

export const allPathExceptApi = '/:start(?!api)(?!*.[^/]+$):path(*)';
export function getViewHandler(): [string, MiddleWare] {
  return [
    allPathExceptApi,
    (_, res) => {
      res.sendFile(join(getPublicDir('front', true)[0], 'index.html'));
    },
  ];
}

export async function initRoutes() {
  const pageModel: PageModel = store.db.model('page');
  const pages = await pageModel.find(
    { active: true, status: { $ne: 'trash' } },
    { slug: 1, path: 1 }
  );

  for (const page of pages) {
    registerRoute(
      { name: page.slug, route: { path: page.path || page.slug } },
      { from: 'CoreView', logger, onStartup: true }
    );
  }
}
