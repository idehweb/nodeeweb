import { slugify, toNumber } from '../utils';

import { ProductIn } from './in.type';
import { PriceType, ProductOut, PublishStatus } from './out.type';

export default class Transform {
  static productInOut(
    product: ProductIn,
    action: 'update' | 'create'
  ): Partial<ProductOut> {
    let status: PublishStatus;
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

    type ExtraOut = Pick<
      ProductOut,
      keyof { options: 0; combinations: 0; price_type: 0 }
    >;

    const out: Omit<ProductOut, keyof ExtraOut> = {
      title: product.title,
      slug: product.slug ?? slugify(product.slug),
      photos: product.photos?.length
        ? product.photos?.map(({ _id }) => _id)
        : action === 'create'
        ? undefined
        : [],
      thumbnail:
        !product.photos?.length && action === 'update'
          ? undefined
          : product.thumbnail,
      labels: product.labels,
      attributes: product.attributes
        ? product.attributes.filter((atr) => atr.attribute)
        : undefined,
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
    let extraOut: ExtraOut;
    if (product.type === 'normal') {
      extraOut = {
        price_type: PriceType.Normal,
        options: [],
        combinations: [
          {
            price: toNumber(product.price),
            salePrice: toNumber(product.salePrice),
            in_stock: product.in_stock,
            quantity: toNumber(product.quantity as any),
            weight: toNumber(product.weight as any),
          },
        ],
      };
    } else if (product.type === 'variable') {
      extraOut = {
        price_type: PriceType.Variable,
        combinations: product.combinations?.map((comb) => ({
          in_stock: comb.in_stock ?? true,
          price: toNumber(comb.price + ''),
          quantity: toNumber(comb.quantity + ''),
          salePrice: toNumber(comb.salePrice + ''),
          sku: comb.sku,
          weight: toNumber(comb.weight + ''),
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
  static createProduct(product: ProductIn): ProductOut {
    return Transform.productInOut(product, 'create') as any;
  }
  static updateProduct(product: ProductIn): Partial<ProductOut> {
    return Transform.productInOut(product, 'update');
  }
  static getOneProduct(product: ProductOut): ProductIn {
    let out: Partial<ProductIn> = {
      title: product.title,
      story: false,
      files: [],
      in_stock: product.combinations.some((c) => c.in_stock),
      price: product.combinations[0].price as any,
      salePrice: product.combinations[0].salePrice as any,
      weight: product.combinations[0].weight,
      quantity: product.combinations[0].quantity,
      slug: product.slug,
      photos: product.photos as any,
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
    };

    if (product.price_type === PriceType.Normal) {
      out = { ...out, type: 'normal' };
    } else {
      out = {
        ...out,
        type: 'variable',
        combinations: product.combinations.map((c) => ({
          ...c,
          id: c['_id'],
        })) as any,
        options: product.options.map((opt) => ({
          ...opt,
          isDisabled: false,
          values: opt.values as any,
        })),
      };
    }

    return { ...product, ...out } as any;
  }
  static getAllProduct(products: ProductOut[]): ProductIn[] {
    return products.map(Transform.getOneProduct);
  }
}
