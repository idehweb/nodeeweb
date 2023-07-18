import js2xmlparser from 'js2xmlparser';
import moment from 'moment';
import { Response } from 'express';
import { Req } from '../../../types/global';
import { classCatchBuilder } from '../../../utils/catchAsync';

export class SiteMapService {
  static async post(req: any, res: Response) {
    const records = await getRecordsFromDataSource('Post');
    console.log('records', records.length);
    const collection = [];

    //add recipes urls
    for (let i = 0; i < records.length; i++) {
      const url: any = {};
      url.loc = process.env.BASE_URL + records[i].url;
      url.lastmod = moment(records[i].lastMod).format('YYYY-MM-DD');
      url.changefreq = records[i].changefreq;

      collection.push(url);
    }
    const col = {
      '@': {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
      },
      url: collection,
    };
    const xml = js2xmlparser.parse('urlset', col);
    res.set('Content-Type', 'text/xml');
    res.status(200);
    return res.send(xml);
  }
  static async page(req: Req, res: Response) {}
  static async product(req: Req, res: Response) {}
  static async productCategory(req: Req, res: Response) {}
  static async _getRecordsFromDataSource(modelName, slug = null) {
    let g = [];
    let Model = mongoose.model(modelName);
    await allAsXmlRules(Model, slug).then(async (d) => {
      g = [...g, ...d];
    });
    return await g;
  }
  static onError(methodName: string, error: any, req: Req, res: Response) {}
}

classCatchBuilder(SiteMapService);

export default SiteMapService;
