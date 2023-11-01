import { MiddleWare } from '@nodeeweb/core';
import store from '../../store';
import { PostOptionQuery } from '../../dto/in/order/post';
import { PostGatewayPluginContent, ShopPluginType } from '../../types/plugin';
import { ShopPost } from '../../dto/config';
import {
  OrderDocument,
  OrderModel,
  OrderStatus,
} from '../../schema/order.schema';
import { evaluate } from 'mathjs';
import { replaceValue } from '@nodeeweb/core/utils/helpers';
import { ProductDocument } from '../../schema/product.schema';

class PostService {
  get orderModel(): OrderModel {
    return store.db.model('order');
  }

  public async getPostProviders(
    address: PostOptionQuery = {},
    opt: { fromAdmin?: boolean; fromPlugin?: boolean } = {
      fromAdmin: true,
      fromPlugin: true,
    }
  ) {
    const fromAdmin = opt.fromAdmin ? store.config.manual_post : [];
    const fromPlugin: ShopPost[] = [];
    const postPlugin = store.plugins.get(
      ShopPluginType.POST_GATEWAY
    ) as PostGatewayPluginContent;
    if (postPlugin && opt.fromPlugin) {
      const postConfig = await postPlugin.stack[0]({ address });
      if (postConfig) {
        const configs = Array.isArray(postConfig) ? postConfig : [postConfig];
        fromPlugin.push(
          ...configs.map((c) => ({ ...c, provider: postPlugin.name }))
        );
      }
    }
    return [...fromAdmin, ...fromPlugin]
      .filter((p) => p.active)
      .filter((p) => this.filterByAddress(p, address));
  }

  public async getPostProvider(postId: string, address?: PostOptionQuery) {
    const providers = await this.getPostProviders(address, {
      fromAdmin: true,
      fromPlugin: true,
    });
    return providers.find((p) => p.id === postId && p.active);
  }

  public filterByAddress(post: ShopPost, { city, state }: PostOptionQuery) {
    // city checker
    const _city = !city || !post.cities || !post.cities.includes(city);

    // state checker
    const _state = !state || !post.states || !post.states.includes(state);

    return _city && _state;
  }

  public filterByProducts(post: ShopPost, cart: OrderDocument['products']) {
    const totalPrice = cart.reduce(
      (acc, p) =>
        acc + p.combinations.reduce((acc, c) => acc + (c.salePrice ?? 0), 0),
      0
    );
    const totalWeight = cart.reduce(
      (acc, p) =>
        acc + p.combinations.reduce((acc, c) => acc + (c.weight ?? 0), 0),
      0
    );
    // min price
    const _min_price =
      !isNaN(totalPrice) &&
      (!post.products_min_price || totalPrice >= post.products_min_price);

    // max price
    const _max_price =
      !isNaN(totalPrice) &&
      (!post.products_max_price || totalPrice <= post.products_max_price);

    // min weight
    const _min_weight =
      !isNaN(totalWeight) &&
      (!post.products_min_weight || totalWeight >= post.products_min_weight);

    // max weight
    const _max_weight =
      !isNaN(totalWeight) &&
      (!post.products_max_weight || totalWeight <= post.products_max_weight);

    return _min_price && _max_price && _min_weight && _max_weight;
  }

  public calculatePrice(
    post: ShopPost,
    cart: OrderDocument['products'] | ProductDocument[],
    address: PostOptionQuery = {}
  ) {
    if (post.price === undefined && post.priceFormula === undefined)
      throw new Error('post price and price formula are undefined');

    if (post.price !== undefined) return post.price;

    let calcPrice = cart.reduce((acc, p) => {
      return (
        acc +
        p.combinations.reduce((acc, c) => {
          const fillValue = replaceValue({
            data: [p, c, address],
            text: post.priceFormula,
            boundary: '%',
          });
          const price = evaluate(fillValue);
          if (isNaN(+price))
            throw new Error(
              `post price formula has error\nexpr:${fillValue}, price:${price}`
            );
          return acc + +price;
        }, 0)
      );
    }, 0);

    if (post.base_price) calcPrice += post.base_price;

    calcPrice = Math.min(
      Math.max(calcPrice, post.min_price ?? 0),
      post.max_price ?? Number.MAX_SAFE_INTEGER
    );

    return Math.ceil(calcPrice);
  }

  get: MiddleWare = async (req, res) => {
    const postOpt: PostOptionQuery = req.query;

    const order = await this.orderModel.findOne({
      'customer._id': req.user._id,
      status: OrderStatus.Cart,
      active: true,
    });

    // get providers
    let providers = await this.getPostProviders(postOpt, {
      fromAdmin: true,
      fromPlugin: true,
    });

    // filter by cart
    if (order)
      providers = providers.filter((p) =>
        this.filterByProducts(p, order.products)
      );

    // calculate price
    providers = providers.map((p) => ({
      ...p,
      priceFormula: undefined,
      price: this.calculatePrice(p, order?.products ?? [], postOpt),
    }));

    return res.json({ data: providers });
  };
}

const postService = new PostService();

export default postService;
