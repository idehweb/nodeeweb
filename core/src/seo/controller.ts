import store from '../../store';
import { RegisterOptions } from '../../types/register';
import { allPathExceptApi } from '../core/view';
import { controllerRegister } from '../handlers/controller.handler';
import logger from '../handlers/log.handler';

export default function registerSeoController({ logger }: RegisterOptions) {
  if (!store.seo) return logger.log('not found any seo provider in store');

  controllerRegister(
    { method: 'get', service: store.seo.getSitemap, url: '/:sitemap.xml' },
    { logger, strategy: 'insertFirst' }
  );

  controllerRegister(
    { method: 'get', service: store.seo.getPage, url: allPathExceptApi },
    { logger, strategy: 'insertFirst' }
  );
}
