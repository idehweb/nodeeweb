import { NextFunction, Request, Response } from 'express';

let config: {
  resolve: (key: string) => any;
};

const productController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { limit, offset } = req.params as any;
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
      method: 'get',
      service: productController,
      url: '/product/torob/:offset([0-9]+)?/:limit([0-9]+)?',
    },
    { from: 'TorobPlugin', base_url: '/api/v1', strategy: 'insertFirst' }
  );

  return [];
}

export { register };
