import {
  SitemapStream,
  streamToPromise,
  SitemapItem,
  EnumChangefreq,
  IndexItem,
  SitemapAndIndexStream,
  SitemapIndexStream,
  SitemapItemStream,
  ErrorLevel,
} from 'sitemap';
import { CRUD, MiddleWare, Res, Seo } from '../../types/global';
import { createGzip } from 'zlib';
import { capitalize, merge } from 'lodash';
import store from '../../store';
import { PageDocument, PageModel } from '../../schema/page.schema';
import {
  call,
  combineUrl,
  normalizeColName,
  rawPath,
  toMs,
} from '../../utils/helpers';
import logger, { Logger } from '../handlers/log.handler';
import mongoose from 'mongoose';
import { PublishStatus } from '../../schema/_base.schema';
import { NotFound } from '../../types/error';
import TimeMap from '../../utils/TimeMap';
import { Transform } from 'stream';
import { getEntityEventName } from '../handlers/entity.handler';

type Conf = { logger: Logger };
const defaultConf: Conf = { logger };

export class SeoCore implements Seo {
  private sitemaps = new TimeMap<string, Partial<SitemapItem>[]>();
  private conf: Conf;

  constructor(conf: Partial<Conf>) {
    this.conf = merge({ ...defaultConf }, conf);
  }

  get pageModel(): PageModel {
    return store.db.model('page');
  }

  async fetchPage(
    filter: mongoose.FilterQuery<PageDocument> = {}
  ): Promise<SitemapItem[]> {
    const dynamicPathRegex = /^(.*)\/([^/:]+)\/:([^/?]+)\??(.*)$/;

    // get all
    let pages = await this.pageModel
      .find(
        {
          status: PublishStatus.Published,
          active: true,
          ...filter,
        },
        { path: 1, slug: 1, updatedAt: 1 }
      )
      .sort({ updatedAt: 1 });

    // populate dynamic path
    pages = (
      await Promise.all(
        pages.map(async (p) => {
          if (!p.path)
            return {
              ...p.toObject(),
              path: combineUrl({ host: store.config.host, url: p.slug }),
            };

          try {
            const [, pre = '', modelName, atrKey, post = ''] =
              dynamicPathRegex.exec(p.path) ?? [];
            if (!atrKey || ['offset', 'limit'].includes(atrKey))
              return {
                ...p.toObject(),
                path: combineUrl({ host: store.config.host, url: p.slug }),
              };

            // dynamic page
            const targetModel = store.db.model(normalizeColName(modelName));
            const targetValues = await targetModel.find(
              {
                $or: [
                  {
                    active: { $exists: false },
                  },
                  { active: true },
                ],
                [atrKey]: { $exists: true },
              },
              { [atrKey]: 1 }
            );
            const cleanPost = post.replace(/\/:[^/]+/g, '');
            return targetValues
              .filter((t) => t[atrKey])
              .map((t) => {
                const newP = {
                  ...p.toObject(),
                  path: `${pre}/${modelName}/${t[atrKey]}${cleanPost}`,
                } as any;
                return newP;
              });
          } catch (err) {
            return {
              ...p.toObject(),
              path: combineUrl({ host: store.config.host, url: p.slug }),
            };
          }
        })
      )
    ).flat();

    return pages.map((p) => {
      const item: SitemapItem = {
        url: p.path,
        changefreq: EnumChangefreq.DAILY,
        priority: 0.5,
        lastmod: new Date(p['updatedAt']).toISOString(),
        img: [],
        links: [],
        video: [],
      };
      return item;
    });
  }

  async updatePage(data: any, crud: CRUD) {
    // TODO optimize update page
    await this.fetchAndSavePage();
    this.conf.logger.log('[CoreSeo] update pages sitemap');
  }

  async fetchAndSavePage(filter: mongoose.FilterQuery<PageDocument> = {}) {
    const pages = await this.fetchPage(filter);
    // const pageSitemap = this.sitemaps.get('Page') ?? [];
    const pageSitemap = [];
    pageSitemap.push(...pages);
    this.sitemaps.set('Page', pageSitemap);
  }

  clear() {
    this.sitemaps.clear();
  }
  async initial() {
    const allChildFetchMethods = Object.getOwnPropertyNames(
      this['__proto__']
    ).filter((m) => m.startsWith('fetch') && !m.startsWith('fetchAndSave'));

    for (const key of allChildFetchMethods) {
      const entity = key.replace('fetch', '');
      const value = (await call(
        this[key].bind(this)
      )) as Partial<SitemapItem>[];
      this.sitemaps.set(entity, value);

      // on create,update,delete
      [CRUD.CREATE, CRUD.DELETE_ONE, CRUD.UPDATE_ONE].map((crud) =>
        store.event.on(
          getEntityEventName(entity, { post: true, type: crud }),
          async (data) => {
            try {
              if (this[`update${entity}`])
                await call(this[`update${entity}`].bind(this, data, crud));
            } catch (err) {
              this.conf.logger.error(
                `[CoreSeo] error on update${entity} ${crud}`,
                err
              );
            }
          }
        )
      );
    }
  }

  getSitemap: MiddleWare = async (req, res, next) => {
    const childRegex = /^([^-._]+)-sitemap$/;
    const indexRegex = /^sitemap(_index)?$/;

    const indexTest = indexRegex.test(req.params.sitemap);
    const [, childMatch] = childRegex.exec(req.params.sitemap) ?? [];

    let chunks: any[], stream: Transform;
    if (indexTest) {
      // get parent
      const basePath = rawPath(req).split('/').slice(0, -1).join('/');
      const sitemapIndexes = this.sitemaps.keys().map((k) => {
        const { modifyAt } = this.sitemaps.getWithTime(k);
        return {
          lastmod: modifyAt.toISOString(),
          url: `${basePath}/${k.toLowerCase()}-sitemap.xml`,
        } as IndexItem;
      });

      stream = new SitemapIndexStream({ level: ErrorLevel.WARN });
      chunks = sitemapIndexes;
    } else if (childMatch) {
      // get child
      const upper = capitalize(childMatch);
      const sm = this.sitemaps.get(upper);
      if (!sm) throw new NotFound(`sitemap not found, target: ${upper}`);

      stream = new SitemapStream({
        level: ErrorLevel.WARN,
        hostname: store.config.host,
      });
      chunks = sm;
    } else
      throw new NotFound(`sitemap not found, target: ${req.params.sitemap}`);

    return await this.sendSitemap(res, chunks, stream);
  };
  protected sendSitemap(res: Res, chunks: any[], sm: Transform) {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    return new Promise<void>((resolve, reject) => {
      try {
        if (!chunks.length) return res.send();

        const pipeline = sm.pipe(createGzip());

        for (const chunk of chunks) {
          sm.write(chunk);
        }
        sm.end();
        sm.on('error', (e) => reject(e));

        // stream the response to the client at the same time
        pipeline.pipe(res).on('error', (e) => {
          reject(e);
        });

        // on end
        pipeline.on('close', () => {
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  getPage: MiddleWare = async (req, res) => {};
}
