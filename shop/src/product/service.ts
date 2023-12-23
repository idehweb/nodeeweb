import { MiddleWare, Req } from '@nodeeweb/core/types/global';
import store from '@nodeeweb/core/store';
import { show } from '../common/mustImplement';
import { SortValues, isObjectIdOrHexString } from 'mongoose';
import { CRUD_DEFAULT_REQ_KEY } from '@nodeeweb/core/src/constants/String';
import { CreateProductBody } from '../../dto/in/product';
import { BadRequestError, EntityCreator, NotFound } from '@nodeeweb/core';
import { FileModel } from '../../schema/file.schema';
import { safeJsonParse } from '@nodeeweb/core/utils/helpers';
import { ProductCategoryModel } from '../../schema/productCategory.schema';

export default class Service {
  static get fileModel(): FileModel {
    return store.db.model('file');
  }

  static get pcModel(): ProductCategoryModel {
    return store.db.model('productCategory');
  }

  static torob: MiddleWare = async (req, res) => {
    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }
    const searchf = {};
    searchf['title.fa'] = {
      $exists: true,
    };
    const Product = store.db.model('Product');
    const Settings = store.db.model('Settings');

    const setting = await Settings.findOne({}, 'tax taxAmount');
    const products = await Product.find(
      {},
      '_id title price type salePrice in_stock combinations firstCategory secondCategory thirdCategory slug'
    )
      .skip(offset)
      .sort({
        in_stock: -1,
        updatedAt: -1,
        createdAt: -1,
      })
      .limit(parseInt(req.params.limit))
      .lean();

    function arrayMin(t) {
      var arr = [];
      t.map((item) => (item != 0 ? arr.push(item) : false));
      if (arr && arr.length > 0)
        return arr.reduce(function (p, v) {
          return p < v ? p : v;
        });
      else return false;
    }

    const modifedProducts = [];
    products.forEach((c) => {
      let price_array = [];
      let sale_array = [];
      let price_stock = [];
      let last_price: any = 0;
      let last_sale_price: any = 0;

      if (c.combinations && c.type == 'variable') {
        c.combinations.forEach((comb, cxt) => {
          if (comb.price && comb.price != null && parseInt(comb.price) != 0) {
            price_array.push(parseInt(comb.price));
          } else {
            price_array.push(0);
          }
          if (
            comb.salePrice &&
            comb.salePrice != null &&
            parseInt(comb.salePrice) != 0
          ) {
            sale_array.push(parseInt(comb.salePrice));
          } else {
            sale_array.push(0);
          }
          if (comb.in_stock && !comb.quantity) {
            comb.in_stock = false;
          }
          price_stock.push(comb.in_stock);
        });
      }
      if (c.type == 'normal') {
        price_array = [];
        sale_array = [];
        price_stock = [];
        if (c.price && c.price != null) price_array.push(c.price);
      }
      last_price = arrayMin(price_array);
      last_sale_price = arrayMin(sale_array);

      if (
        last_price !== false &&
        last_sale_price !== false &&
        last_price < last_sale_price
      ) {
        let cd = price_array.indexOf(last_price);
        if (sale_array[cd] && sale_array[cd] != 0)
          last_sale_price = sale_array[cd];
        else last_sale_price = false;
      } else if (
        last_price !== false &&
        last_sale_price !== false &&
        last_price > last_sale_price
      ) {
        let cd = sale_array.indexOf(last_sale_price);
        if (price_array[cd] && price_array[cd] != 0)
          last_price = price_array[cd];
        let tem = last_price;

        last_price = last_sale_price;
        last_sale_price = tem;
      }

      if (c.type == 'normal') {
        price_array = [];
        sale_array = [];
        price_stock = [];
        if (c.in_stock) {
          price_stock.push(true);
        }
        if (c.price && c.price != null) price_array.push(c.price);
      }

      let cat_inLink = '';
      if (c.firstCategory && c.firstCategory.slug)
        cat_inLink = c.firstCategory.slug;
      if (c.secondCategory && c.secondCategory.slug)
        cat_inLink = c.secondCategory.slug;
      if (c.thirdCategory && c.thirdCategory.slug)
        cat_inLink = c.thirdCategory.slug;

      if (setting && setting.tax && setting.taxAmount) {
        if (last_price) {
          const n = (parseInt(setting.taxAmount) * last_price) / 100;
          last_price = last_price + parseInt(n + '');
        }

        if (last_sale_price) {
          const x = (parseInt(setting.taxAmount) * last_sale_price) / 100;
          last_sale_price = last_sale_price + parseInt(x + '');
        }
      }
      modifedProducts.push({
        product_id: c._id,
        name: c.title && c.title.fa ? c.title.fa : '',

        page_url: process.env.BASE_URL + '/product/' + c._id + '/' + c.slug,
        price: last_price,
        old_price: last_sale_price,
        availability: price_stock.indexOf(true) >= 0 ? 'instock' : 'outofstock',
      });
    });
    return res.json(modifedProducts);
  };
  static getAllFilterParser = async (req: Req) => {
    const filter = safeJsonParse(req.query.filter);
    // product category
    if (filter['productCategory.slug']) {
      // find pc id
      const pc = await Service.pcModel.findOne({
        slug: filter['productCategory.slug'],
      });

      if (pc) {
        delete filter['productCategory.slug'];
        filter.productCategory = pc._id;
      }
    }

    delete req.query.filter;
    delete req.query._filter;

    const filterFromBase = await new EntityCreator('').parseFilterQuery(
      {},
      req
    );

    return { ...filterFromBase, ...filter, active: true };
  };
  static getOneFilterParser = (req: Req) => {
    const obj = {
      status: { $ne: 'trash' },
    };
    if (isObjectIdOrHexString(req.params.id)) obj['_id'] = req.params.id;
    else obj['slug'] = req.params.id;
    return obj;
  };
  static getOneAfter: MiddleWare = async (req, res) => {
    const Product = store.db.model('product');
    const product = req[CRUD_DEFAULT_REQ_KEY]?._doc;

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'error!',
      });
    }

    let views = product.views;
    if (!views) {
      views = [];
    }

    views.push({
      userIp: req.ip,
      createdAt: new Date(),
    });
    await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          views: views,
        },
      },
      {
        fields: { _id: 1 },
      }
    );
    if (product.views) {
      product.views = product.views.length;
    } else {
      product.views = 0;
    }
    if (product.like) {
      product.like = product.like.length;
    } else {
      product.like = 0;
    }
    delete product.getContactData;
    delete product.transaction;
    delete product.relatedProducts;
    delete product.firstCategory;

    res.json({ data: product });
  };
  static createBodyParser = async (req: Req) => {
    const body: CreateProductBody = req.body;

    // combinations details
    body.combinations.forEach((com) => {
      if (com.salePrice === undefined) com.salePrice = com.price;
      if (com.quantity === 0) com.in_stock = false;
    });

    // file
    if (body.photos?.length) {
      const files = await this.fileModel.find({ _id: { $in: body.photos } });
      if (files.length !== body.photos.length) {
        const notFoundIds = body.photos.filter(
          (p) => !files.find((f) => f._id.equals(p))
        );
        throw new NotFound(
          `file with IDs ${notFoundIds
            .map((id) => id.toString())
            .join(', ')} not found`
        );
      }

      body.photos = files as any;
      let thumbnail = files[0].url;
      if (body.thumbnail) {
        if (!files.map((f) => f.url).includes(body.thumbnail))
          throw new NotFound('thumbnail not exist in files url');
        thumbnail = body.thumbnail;
      }

      body['thumbnail'] = thumbnail;
    }

    return body;
  };

  static updateBodyParser = async (req: Req) => {
    let body = req.body;
    if (req.body.slug) {
      req.body.slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    }
    if (req.body.type == 'variable') {
      req.body.in_stock = false;
      if (req.body.combinations) {
        req.body.combinations.forEach((comb) => {
          if (comb.in_stock && comb.quantity != 0) {
            req.body.in_stock = true;
          }
        });
      }
    }
    if (req.body.type == 'normal' && req.body.combinations?.length !== 1) {
      throw new BadRequestError('normal type need one combination');
    }
    if (req.body.like) {
      delete req.body.like;
    }

    // parse to number
    ['price', 'salePrice', 'quantity', 'weight'].forEach((k) => {
      if (req.body[k] === '' || req.body[k] === undefined) delete req.body[k];
      else req.body[k] = +req.body[k];
    });

    // file
    if (body.photos) {
      const files = await this.fileModel.find({ _id: { $in: body.photos } });
      if (files.length !== body.photos.length) {
        const notFoundIds = body.photos.filter(
          (p) => !files.find((f) => f._id.equals(p))
        );
        throw new NotFound(
          `file with IDs ${notFoundIds
            .map((id: string) => id.toString())
            .join(', ')} not found`
        );
      }

      body.photos = files as any;

      if (!body.photos.length) {
        delete body.thumbnail;
        body = { $set: body, $unset: { thumbnail: '' } };
      } else if (!body.thumbnail) body['thumbnail'] = files[0].url;
    }
    return body;
  };

  static rewriteProducts: MiddleWare = async (req, res) => {
    return res.status(500).send('not implement yet!');
  };
  static rewriteProductsImages: MiddleWare = async (req, res) => {
    return res.status(500).send('not implement yet!');
  };
}
