import { isMongoId } from 'class-validator';
import EventEmitter from 'events';
import { NextFunction, Request, Response } from 'express';

const SERIAL = 'torob-plugin';

let config: {
  resolve: (key: string) => any;
};

const transformProductV1 = (product: any) => {
  const store = config.resolve('store');

  // site base url
  const host = store.config.host;

  const manifest: any = {
    product_id: String(product._id),
    product_name: product.title?.fa || Object.values(product.title ?? {})[0],
    product_image: product.thumbnail && `${host}${product.thumbnail}`,
  };

  const comb = product.combinations[0] ?? {};
  // stock
  manifest.product_availability = comb.in_stock ? 'instock' : 'outofstock';

  // price
  const price = comb.salePrice || comb.price;
  manifest.product_price = price;
  if (price !== comb.price) manifest.product_old_price = comb.price;

  return manifest;
};

const productController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { limit, offset } = req.body as any;
  limit = limit ? +limit : 24;
  offset = offset ? +offset : 0;

  const store = config.resolve('store');

  // model & product
  const productModel = store.db.model('product');
  const products = await productModel
    .find(
      { active: true, 'combinations.0.price': { $exists: true } },
      'title slug combinations'
    )
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(offset)
    .lean();

  // site base url
  const host = store.config.host;

  const parsedProducts = products.map((p) => {
    const pp: any = {
      product_id: String(p._id),
      name: p.title?.fa || Object.values(p.title ?? {})[0],
      page_url: `${host}/product/${p.slug ?? String(p._id)}`,
    };

    const comb = p.combinations[0] ?? {};
    // stock
    pp.availability = comb.in_stock ? 'instock' : 'outofstock';

    // price
    const price = comb.salePrice || comb.price;
    pp.price = price;
    if (price !== comb.price) pp.old_price = comb.price;

    return pp;
  });

  return res.json(parsedProducts);
};

export function insertMeta(root: any, obj: { [key in string]: string }) {
  const head = root.querySelector('head');

  Object.entries(obj)
    .filter(([, v]) => v !== null && v !== undefined)
    .forEach(([k, v]) => {
      head.insertAdjacentHTML(
        'beforeend',
        `<meta name="${k}" content="${v}" />`
      );
    });
}

const onGetProduct = async (root: any, req: Request) => {
  const productModel = config.resolve('store').db.model('product');
  const entityRegex = /^\/([^\/]+)\/([^\/]+)\/?$/;
  const [, , slug = null] = entityRegex.exec(req.path) ?? [];
  if (!slug) return;
  const product = await productModel.findOne({
    $or: [{ slug }, isMongoId(slug) ? { _id: slug } : null].filter((v) => v),
    active: true,
  });
  if (!product) return;

  const manifest = transformProductV1(product);
  insertMeta(root, manifest);
};

onGetProduct['serial'] = SERIAL;

function errorLog(from: string, err: any) {
  const logger = config.resolve('logger');
  const parser = config.resolve('axiosError2String');
  logger.error(`${from} error:`, parser(err));
}

function register(arg: any) {
  config = arg;

  // register controller
  const controllerRegister = config.resolve('controllerRegister');
  controllerRegister(
    {
      method: 'post',
      service: productController,
      url: '/torob/products',
    },
    { from: 'TorobPlugin', base_url: '/api/v1', strategy: 'insertFirst' }
  );

  // register event listener
  const event = config.resolve('store').event as EventEmitter;
  const en = 'post-product-seo';
  event
    .listeners(en)
    .filter((fn) => fn['serial'] === SERIAL)
    .forEach((fn) => event.removeListener(en, fn as any));
  event.on(en, onGetProduct);

  return [];
}

export { register };
