import { SeoCore } from '@nodeeweb/core/src/seo/Seo';
import store from '../../store';
import { PostModel } from '../../schema/post.schema';
import { ProductModel } from '../../schema/product.schema';
import { PublishStatus } from '../../schema/_base.schema';
import { SitemapItem, EnumChangefreq } from 'sitemap';
import { combineUrl, fromMs } from '@nodeeweb/core/utils/helpers';

export class SeoShop extends SeoCore {
  get postModel(): PostModel {
    return store.db.model('post');
  }
  get productModel(): ProductModel {
    return store.db.model('product');
  }
  log(...args: any[]): void {
    this.conf.logger.log('[SeoShop]', ...args);
  }
  error(...args: any[]): void {
    this.conf.logger.error('[SeoShop]', ...args);
  }

  async fetchPost(): Promise<SitemapItem[]> {
    const posts = await this.postModel.find(
      { active: true, status: PublishStatus.Published },
      { slug: 1, updatedAt: 1 },
      { sort: { updatedAt: 1 } }
    );

    return posts.map((p) => ({
      url: combineUrl({ host: store.config.host, url: `/post/${p.slug}` }),
      changefreq: EnumChangefreq.DAILY,
      priority: 0.5,
      lastmod: new Date(p['updatedAt']).toISOString(),
      img: [],
      links: [],
      video: [],
    }));
  }
  async updatePost() {
    const start = Date.now();
    await this.fetchAndSavePost();
    this.log(`update post sitemap`, fromMs(Date.now() - start));
  }
  async fetchAndSavePost() {
    const posts = await this.fetchPost();
    this.sitemaps.set('Post', posts);
  }

  async fetchProduct() {
    const products = await this.productModel.find(
      { active: true, status: PublishStatus.Published },
      { slug: 1, updatedAt: 1 },
      { sort: { updatedAt: 1 } }
    );

    return products.map((p) => ({
      url: combineUrl({ host: store.config.host, url: `/product/${p.slug}` }),
      changefreq: EnumChangefreq.DAILY,
      priority: 0.5,
      lastmod: new Date(p.updatedAt || p.createdAt || Date.now()).toISOString(),
      img: [],
      links: [],
      video: [],
    }));
  }
  async updateProduct() {
    const start = Date.now();
    await this.fetchAndSaveProduct();
    this.log(`update product sitemap`, fromMs(Date.now() - start));
  }
  async fetchAndSaveProduct() {
    const products = await this.fetchProduct();
    this.sitemaps.set('Product', products);
  }
}
