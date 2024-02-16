import * as fs from 'fs';
import { isMongoId } from 'class-validator';
import {
  SitemapStream,
  SitemapItem,
  EnumChangefreq,
  IndexItem,
  SitemapIndexStream,
  ErrorLevel,
} from 'sitemap';
import { CRUD, MiddleWare, Req, Res, Seo } from '../../types/global';
import { createGzip } from 'zlib';
import { capitalize, merge } from 'lodash';
import store from '../../store';
import { PageDocument, PageModel } from '../../schema/page.schema';
import {
  call,
  combineUrl,
  fromMs,
  getAllPropertyNames,
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
import isbot from 'isbot';
import { getPublicDir } from '../../utils/path';
import { join } from 'path';
import parse, { HTMLElement } from 'node-html-parser';
import { getSeoEventName } from './utils';

type Conf = { logger: Logger };
const defaultConf: Conf = { logger };

export class SeoCore implements Seo {
  protected sitemaps = new TimeMap<string, SitemapItem[]>();
  protected listeners = new Map<string, (...args: any[]) => void>();
  protected conf: Conf;
  protected isCleared: boolean;

  constructor(conf: Partial<Conf>) {
    this.conf = merge({ ...defaultConf }, conf);
    this.isCleared = false;
  }

  log(...args: any[]) {
    this.conf.logger.log('[SeoCore]', ...args);
  }
  error(...args: any[]) {
    this.conf.logger.error('[SeoCore]', ...args);
  }
  warn(...args: any[]) {
    this.conf.logger.warn('[SeoCore]', ...args);
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
    const start = Date.now();
    await this.fetchAndSavePage();
    this.log('update pages sitemap', fromMs(Date.now() - start));
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
    [...this.listeners.entries()].forEach(([k, f]) =>
      store.event.removeListener(k, f)
    );
    this.isCleared = true;
  }
  async initial() {
    const allChildFetchMethods = getAllPropertyNames(this).filter(
      (m) => m.startsWith('fetch') && !m.startsWith('fetchAndSave')
    );

    for (const key of allChildFetchMethods) {
      if (this.isCleared) return;
      const entity = key.replace('fetch', '');
      const value = (await call(this[key].bind(this))) as SitemapItem[];
      if (this.isCleared) return;
      this.sitemaps.set(entity, value);

      // on create,update,delete
      [CRUD.CREATE, CRUD.DELETE_ONE, CRUD.UPDATE_ONE].map((crud) => {
        const eventName = getEntityEventName(entity, {
          post: true,
          type: crud,
        });
        const eventFunc = async (data) => {
          try {
            if (this[`update${entity}`])
              await call(this[`update${entity}`].bind(this, data, crud));
          } catch (err) {
            this.error(`error on update${entity} ${crud}`, err);
          }
        };

        store.event.on(eventName, eventFunc);
        this.listeners.set(eventName, eventFunc);
      });
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

  private effectPostConfig(root: HTMLElement) {
    const head = root.querySelector('head');
    const body = root.querySelector('body');

    // head config
    if (store.config.head_first)
      head.insertAdjacentHTML('afterbegin', store.config.head_first);
    if (store.config.head_last)
      head.insertAdjacentHTML('beforeend', store.config.head_last);

    // body config
    if (store.config.body_first)
      body.insertAdjacentHTML('afterbegin', store.config.body_first);
    if (store.config.body_last)
      body.insertAdjacentHTML('beforeend', store.config.body_last);
  }

  private effectPreConfig(root: HTMLElement) {
    const { meta_title = store.config.app_name, meta_description } =
      store.config;
    if (meta_title) this.effectMeta(root, { key: 'title', value: meta_title });
    if (meta_description)
      this.effectMeta(root, { key: 'description', value: meta_description });
  }

  private effectMeta(
    root: HTMLElement,
    { key, value }: { key: 'title' | 'description' | 'keywords'; value: string }
  ) {
    const head = root.querySelector('head');

    if (key === 'title') {
      // title
      const el = root.querySelector(`head title`);
      if (el)
        // change inner
        el.innerHTML = value;
      // create new tag
      else head.insertAdjacentHTML('beforeend', `<title>${value}</title>`);
    } else {
      // description
      const el = root.querySelector(`head meta[name='${key}']`);
      if (el)
        // change atr
        el.setAttribute('content', value);
      // create new tag
      else
        head.insertAdjacentHTML(
          'beforeend',
          `<meta name="${key}" content="${value}" />`
        );
    }
  }
  private async effectEvents(root: HTMLElement, req: Req) {
    const pageEntityTest = /^\/[^\/]+$/;
    const customEntity = /^\/([^\/]+)\/([^\/]+)$/;
    let entity = 'page';
    if (pageEntityTest.test(req.path)) entity = 'page';
    else [entity = 'page'] = customEntity.exec(req.path) ?? [];

    const customEventName = getSeoEventName({ post: true, entity });
    const allEventName = getSeoEventName({ post: true });

    await store.event.emitWithWait(customEventName, root, req);
    await store.event.emitWithWait(allEventName, root, req);
  }

  private async getPageDoc(path: string) {
    let slug: string;

    if (path === '/') slug = 'home';
    else [, slug] = /^\/([^/]+)$/.exec(path) ?? [];

    if (slug) {
      const page = await this.pageModel.findOne(
        {
          slug,
          active: true,
          status: PublishStatus.Published,
        },
        { metadescription: 1, metatitle: 1, title: 1, keywords: 1 }
      );

      if (page) return page as PageDocument;
    }
    return null;
  }
  private effectPage(root: HTMLElement, page: PageDocument) {
    const title = Object.values({
      ...page.title,
      ...page.metatitle,
    }).filter((d) => d)[0] as string;
    if (title) this.effectMeta(root, { key: 'title', value: title });

    const des = Object.values(page.metadescription ?? {}).filter((d) => d)[0];
    if (des) this.effectMeta(root, { key: 'description', value: des });

    // keywords
    const keywords = page.keywords?.join(',');
    if (keywords) this.effectMeta(root, { key: 'keywords', value: keywords });
  }

  getPage: MiddleWare = async (req, res, next) => {
    // if (!isbot(req.get('user-agent'))) {
    //   return next();
    // }
    if (req.path === '/home') throw new NotFound('page not found');

    const htmlStr = await fs.promises.readFile(
      join(getPublicDir('front', true)[0], 'index.html'),
      'utf8'
    );
    const html = parse(htmlStr, { comment: false });

    const pageDoc = await this.getPageDoc(req.path);

    if (!pageDoc) return next();

    this.effectPreConfig(html);
    this.effectPage(html, pageDoc);
    await this.effectEvents(html, req);
    this.effectPostConfig(html);

    res.setHeader('content-type', 'text/html');
    return res.status(200).send(html.toString());
  };
}
