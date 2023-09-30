export default class Transform {
  static productInOut(product) {
    let status;
    if (product.status) {
      switch (product.status) {
        case PublishStatus.Processing:
          status = PublishStatus.Processing;
          break;
        default:
          status = PublishStatus.Published;
          break;
      }
    }

    const out = {
      title: product.title,
      slug: product.slug,
      photos: product.photos?.length
        ? product.photos?.map(({ _id }) => _id)
        : undefined,
      labels: product.labels,
      attributes: product.attributes,
      extra_attr: product.extra_attr,
      status,
      miniTitle: product.miniTitle,
      active: true,
      excerpt: product.excerpt,
      description: product.description,
      metatitle: product.metatitle,
      metadescription: product.metadescription,
      productCategory: product.productCategory,
    };
    let extraOut;
    if (product.type === 'normal') {
      extraOut = {
        price_type: 'normal',
        options: [],
        combinations: [
          {
            price: product.price,
            salePrice: product.salePrice,
            in_stock: product.in_stock,
            quantity: product.quantity,
            weight: product.weight,
          },
        ],
      };
    } else if (product.type === 'variable') {
      extraOut = {
        price_type: 'variable',
        combinations: product.combinations?.map((comb) => ({
          in_stock: comb.in_stock ?? true,
          price: comb.price + '',
          quantity: comb.quantity + '',
          salePrice: comb.salePrice + '',
          sku: comb.sku,
          weight: comb.weight + '',
          options: comb.options,
        })),
        options: product.options?.map((opt) => ({
          _id: opt._id,
          name: opt.name,
          values: opt.values.map((v) => ({ name: v.name })),
        })),
      };
    }

    return { ...out, ...extraOut };
  }
  static createProduct(product) {
    return Transform.productInOut(product);
  }
  static updateProduct(product) {
    return Transform.productInOut(product);
  }
  static getOneProduct(product) {
    let out = {
      title: product.title,
      story: false,
      files: [],
      in_stock: product.combinations.some((c) => c.in_stock),
      price: product.combinations[0].price,
      salePrice: product.combinations[0].salePrice,
      weight: product.combinations[0].weight,
      quantity: product.combinations[0].quantity,
      slug: product.slug,
      photos: product.photos?.map(({ url }) =>
        url.startsWith('/') ? url.slice(1) : url,
      ),
      labels: product.labels,
      attributes: product.attributes,
      extra_attr: product.extra_attr,
      status: product.status,
      miniTitle: product.miniTitle,
      excerpt: product.excerpt,
      description: product.description,
      metatitle: product.metatitle,
      metadescription: product.metadescription,
      productCategory: product.productCategory,
      access: 'public',
      requireWarranty: false,
      id: product._id,
      combinations: product.combinations.map((c) => ({
        ...c,
        id: c['_id'],
        _id: c._id,
      })),
    };

    if (product.price_type === 'normal') {
      out = { ...out, type: 'normal' };
    } else {
      out = {
        ...out,
        type: 'variable',

        options: product.options.map((opt) => ({
          ...opt,
          isDisabled: false,
          values: opt.values,
        })),
      };
    }
    return { ...product, ...out };
  }
  static getAllProduct(products) {
    return products.map(Transform.getOneProduct);
  }
}
