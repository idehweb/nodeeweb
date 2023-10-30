import coreInit from '@nodeeweb/core/src/seo';
import { SeoShop } from './Seo';
import logger from '../../utils/log';
export default function initSeo() {
  coreInit(new SeoShop({ logger }));
}
