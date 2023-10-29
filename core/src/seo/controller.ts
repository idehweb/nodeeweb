import store from '../../store';
import { controllerRegister } from '../handlers/controller.handler';
import logger from '../handlers/log.handler';

function log(...args: any) {
  logger.log('[CoreSeo]', ...args);
}
function error(...args: any) {
  logger.error('[CoreSeo]', ...args);
}

export default function registerSeoController() {
  const seo = store.seo;
  if (!seo) return log('not found any seo provider in store');

  controllerRegister(
    { method: 'get', service: seo.getSitemap, url: '/:sitemap.xml' },
    { from: 'CoreSeo', logger }
  );
}
