---
sidebar_position: 5
---


# SEO

Welcome to the SEO documentation! In this guide, we will cover the basics of Search Engine Optimization (SEO) and how to optimize your website for better search engine rankings.

## Table of Contents

- [Introduction to SEO](#introduction-to-seo)
- [SEO Interface](#seo-interface)
- [Seo Core](#seocore)
- [API](#api)
- [Customize and Usage](#customize-and-usage)
- [Conclusion](#conclusion)

## Introduction to SEO

SEO is the practice of optimizing your website to improve its visibility and ranking on search engine results pages (SERPs). By optimizing your website, you can increase organic (non-paid) traffic and attract more potential customers.


## SEO Interface
```ts
interface Seo {
  getSitemap: MiddleWare;
  getPage: MiddleWare;
  initial: () => Promise<void> | void;
  clear: () => void;
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
}
```

## SeoCore
core implementation of [Seo interface](#seo-interface) which register on store by default.

> ### Terminology
> **fetch functions:** start with `fetch` but not `fetchAndSave`, ex: fetchProduct
>
> **update functions:** fetch functions which replace fetch key into update key, ex: updateProduct

this class provide `initial` function that does these actions:
- call every fetch functions, then save result into `sitemaps` attribute which capital key, ex: fetchProduct => Product 
- register update functions into crud `store.event`
- on `getSitemap` return all sitemaps that store on `sitemaps` attribute

## API
each seo instance register in these APIs, that can effect on it or handle request.
| Path | Function | Strategy |
| ---- | -------- | -------- |
| `/:start(?!api)(?!*.[^/]+$):path(*)` | `getPage` | insertFirst |
| `/:sitemap` | `getSitemap` | insertFirst |


## Customize and Usage
1) create a class that implement [Seo interface](#seo-interface)
```ts
export class SeoShop extends SeoCore {
  get productModel(): ProductModel {
    return store.db.model('product');
  }
  log(...args: any[]): void {
    this.conf.logger.log('[SeoShop]', ...args);
  }
  error(...args: any[]): void {
    this.conf.logger.error('[SeoShop]', ...args);
  }

  async fetchProduct() {
    return []
  }
  async updateProduct() {
    await this.fetchAndSaveProduct();
    this.log(`update product sitemap`);
  }
  async fetchAndSaveProduct() {
    const products = await this.fetchProduct();
    this.sitemaps.set('Product', products);
  }
}
```
2) register new Seo class into `store`
```ts
import coreInit from '@nodeeweb/core/src/seo';
import { SeoShop } from './Seo';
import logger from '../../utils/log';
export default function initSeo() {
  coreInit(new SeoShop({ logger }));
}
```

## Conclusion

By implementing effective SEO strategies, you can improve your website's visibility, attract more organic traffic, and ultimately increase your online presence. In this documentation, we will dive deeper into each aspect of SEO and provide you with practical tips and best practices to get started.

Happy optimizing!
