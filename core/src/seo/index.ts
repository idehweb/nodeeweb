import store from '../../store';
import { color } from '../../utils/color';
import logger from '../handlers/log.handler';
import { SeoCore } from './Seo';
import registerSeoController from './controller';

export default function initSeo() {
  const seo = new SeoCore({ logger });
  store.seo = seo;
  seo
    .initial()
    .then(() => {
      logger.log(color('Green', '[CoreSeo] initial successfully!'));
    })
    .catch((e) => {
      logger.error('[CoreSeo] error in seo initialize\n', e);
    });
  registerSeoController();
}
