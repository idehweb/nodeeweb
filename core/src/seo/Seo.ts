import {
  SitemapStream,
  streamToPromise,
  SitemapItem,
  EnumChangefreq,
} from 'sitemap';
import { MiddleWare, Seo } from '../../types/global';
import { createGzip } from 'zlib';
import { merge } from 'lodash';
import store from '../../store';
import { PageDocument, PageModel } from '../../schema/page.schema';
import { combineUrl, toMs } from '../../utils/helpers';
import logger, { Logger } from '../handlers/log.handler';
import mongoose from 'mongoose';
import { PublishStatus } from '../../schema/_base.schema';
import { NotFound } from '../../types/error';

type Conf = { logger: Logger };
const defaultConf: Conf = { logger };

export class SeoCore implements Seo {
  private sitemaps = new Map<string, any>();
  private last_sitemap_fetch: Date;
  private conf: Conf;

  constructor(conf: Partial<Conf>) {
    this.conf = merge({ ...defaultConf }, conf);
  }

  get pageModel(): PageModel {
    return store.db.model('page');
  }

  private async fetchPage(
    filter: mongoose.FilterQuery<PageDocument> = {}
  ): Promise<Partial<SitemapItem>[]> {
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
            if (!atrKey)
              return {
                ...p.toObject(),
                path: combineUrl({ host: store.config.host, url: p.slug }),
              };

            // dynamic page
            const targetModel = store.db.model(modelName);
            const targetValues = await targetModel.find(
              { active: true },
              { [atrKey]: 1 }
            );
            return targetValues
              .filter((t) => t[atrKey])
              .map((t) => {
                const newP = {
                  ...p.toObject(),
                  path: `${pre}/${modelName}/${t[atrKey]}${post}`,
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
      const item: Partial<SitemapItem> = {
        url: p.path,
        changefreq: EnumChangefreq.DAILY,
        priority: 0.5,
        lastmod: new Date(p['updatedAt']).toISOString(),
      };
      return item;
    });
  }

  private async fetch() {
    const pages = await this.pageModel.find();
    this.last_sitemap_fetch = new Date();
    return pages;
  }

  getSitemap: MiddleWare = async (req, res, next) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');

    const targetSitemapName = req.params.sitemap.replace('.xml', '');

    if (targetSitemapName === 'sitemap') {
      // get parent
    } else {
      // get child
      const sm = this.sitemaps.get(targetSitemapName);
      if (!sm)
        throw new NotFound(`sitemap not found, target: ${targetSitemapName}`);
      // present
    }

    try {
      const sm = new SitemapStream({
        hostname: store.config.host,
      });
      const pipeline = sm.pipe(createGzip());
      for (const value of values) {
        pipeline.write(value);
      }

      // This takes the result and stores it in memory - > 50mb
      streamToPromise(pipeline).then((sm) => (this.sitemap = sm));

      // stream the response to the client at the same time
      pipeline.pipe(res).on('error', (e) => {
        throw e;
      });
    } catch (e) {
      logger.error(e);
      res.status(500).end();
    }
  };
  getPage: MiddleWare = async (req, res) => {};
}
