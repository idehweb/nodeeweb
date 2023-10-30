import store from '../../store';
import { Seo } from '../../types/global';
import { color } from '../../utils/color';
import { call, fromMs } from '../../utils/helpers';
import logger from '../handlers/log.handler';
import { SeoCore } from './Seo';
import registerSeoController from './controller';

export default function initSeo(seo?: Seo) {
  const start = Date.now();
  seo = seo ?? new SeoCore({ logger });
  if (store.seo) {
    store.seo.clear();
  }
  store.seo = seo;
  registerSeoController({
    logger: { log: seo.log.bind(seo), error: seo.error.bind(seo) } as any,
  });
  call(seo.initial.bind(seo))
    .then(() => {
      seo.log('initial successfully!', fromMs(Date.now() - start));
    })
    .catch((e) => {
      seo.error('error in seo initialize\n', e);
    });
}
