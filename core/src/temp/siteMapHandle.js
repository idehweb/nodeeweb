import js2xmlparser from 'js2xmlparser';
import moment from 'moment';
import { allAsXmlRules } from '../app/configHandle.mjs';
import mongoose from 'mongoose';

let siteMapHandle = async (express, app, props = {}) => {
  const router = express.Router();

  await router.get('/post_sitemap.xml', async function (req, res, next) {
    try {
      //our records to index
      const records = await getRecordsFromDataSource('Post');
      console.log('records', records.length);
      const collection = [];
      // let today = await moment();
      // today = await today.format("YYYY-MM-DD");
      //add site root url
      // const rootUrl = {};
      // rootUrl.loc = process.env.SHOP_URL;
      // rootUrl.lastmod = today;
      // rootUrl.changefreq = "daily";
      // rootUrl.priority = "1.0";
      // rootUrl["image:image"] = {
      //     "image:loc": "s://javaniceday.com/default-image.jpg",
      //     "image:caption":
      //         "javaniceday.com. Software development blog. Java, Node JS, Salesforce among other technologies",
      // };
      // await collection.push(rootUrl);

      //add recipes urls
      for (let i = 0; i < records.length; i++) {
        const url = {};
        // url.id = records[i].id.toString();
        // console.log('records[i].id',records[i].id)
        url.loc = process.env.BASE_URL + records[i].url;
        url.lastmod = moment(records[i].lastMod).format('YYYY-MM-DD');
        url.changefreq = records[i].changefreq;
        // if (records[i]["image:image"])
        //     url["image:image"] = {
        //         "image:loc": process.env.SHOP_URL + records[i]["image:image"]
        //     };

        await collection.push(url);
      }
      const col = {
        '@': {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
          'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
        },
        url: collection,
      };
      const xml = await js2xmlparser.parse('urlset', col);
      await res.set('Content-Type', 'text/xml');
      await res.status(200);
      return res.send(xml);
    } catch (e) {
      next(e);
    }
  });
  await router.get('/page_sitemap.xml', async function (req, res, next) {
    try {
      const records = await getRecordsFromDataSource('Page');
      console.log('records', records.length);
      const collection = [];
      for (let i = 0; i < records.length; i++) {
        const url = {};
        // url.id = records[i].id.toString();
        const rootUrl = {};
        rootUrl.loc = process.env.SHOP_URL;
        // rootUrl.lastmod = today;
        rootUrl.changefreq = 'daily';
        rootUrl.priority = '1.0';
        // rootUrl["image:image"] = {
        //     "image:loc": "s://javaniceday.com/default-image.jpg",
        //     "image:caption":
        //         "javaniceday.com. Software development blog. Java, Node JS, Salesforce among other technologies",
        // };
        await collection.push(rootUrl);
        url.loc = process.env.BASE_URL + records[i].url;
        url.lastmod = moment(records[i].lastMod).format('YYYY-MM-DD');
        url.changefreq = records[i].changefreq;
        // if (records[i]["image:image"])
        //     url["image:image"] = {
        //         "image:loc": process.env.SHOP_URL + records[i]["image:image"]
        //     };

        await collection.push(url);
      }
      const col = {
        '@': {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
          'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
        },
        url: collection,
      };
      const xml = await js2xmlparser.parse('urlset', col);
      await res.set('Content-Type', 'text/xml');
      await res.status(200);
      return res.send(xml);
    } catch (e) {
      next(e);
    }
  });
  await router.get('/product_sitemap.xml', async function (req, res, next) {
    try {
      const records = await getRecordsFromDataSource('Product');
      console.log('records', records.length);
      const collection = [];
      for (let i = 0; i < records.length; i++) {
        const url = {};
        // url.id = records[i].id.toString();
        url.loc = process.env.BASE_URL + records[i].url;
        url.lastmod = moment(records[i].lastMod).format('YYYY-MM-DD');
        url.changefreq = records[i].changefreq;
        // if (records[i]["image:image"])
        //     url["image:image"] = {
        //         "image:loc": process.env.SHOP_URL + records[i]["image:image"]
        //     };

        await collection.push(url);
      }
      const col = {
        '@': {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
          'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
        },
        url: collection,
      };
      const xml = await js2xmlparser.parse('urlset', col);
      await res.set('Content-Type', 'text/xml');
      await res.status(200);
      return res.send(xml);
    } catch (e) {
      next(e);
    }
  });
  await router.get(
    '/product-category_sitemap.xml',
    async function (req, res, next) {
      try {
        const records = await getRecordsFromDataSource(
          'ProductCategory',
          'product-category'
        );
        console.log('records', records.length);
        const collection = [];
        for (let i = 0; i < records.length; i++) {
          const url = {};
          // url.id = records[i].id.toString();
          url.loc = process.env.BASE_URL + records[i].url;
          url.lastmod = moment(records[i].lastMod).format('YYYY-MM-DD');
          url.changefreq = records[i].changefreq;
          if (records[i]['image:image'])
            url['image:image'] = {
              'image:loc': process.env.SHOP_URL + records[i]['image:image'],
            };

          await collection.push(url);
        }
        const col = {
          '@': {
            xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
            'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
          },
          url: collection,
        };
        const xml = await js2xmlparser.parse('urlset', col);
        await res.set('Content-Type', 'text/xml');
        await res.status(200);
        return res.send(xml);
      } catch (e) {
        next(e);
      }
    }
  );
  await app.use('/', router);

  async function getRecordsFromDataSource(modelName, slug = null) {
    let g = [];
    let Model = mongoose.model(modelName);
    await allAsXmlRules(Model, slug).then(async (d) => {
      g = [...g, ...d];
    });
    return await g;
  }
};
export default siteMapHandle;
// export default router;
