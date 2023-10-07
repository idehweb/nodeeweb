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
import math from 'mathjs';
import { replaceValue } from '@nodeeweb/core/utils/helpers';

class PostService {
  get orderModel(): OrderModel {
    return store.db.model('order');
  }

  public async getPostProviders(
    address: PostOptionQuery,
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
    return [...fromAdmin, ...fromPlugin].filter((p) =>
      this.filterByAddress(p, address)
    );
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

  public calculatePrice(post: ShopPost, cart: OrderDocument['products']) {
    if (post.price === undefined && post.priceFormula === undefined)
      throw new Error('post price and price formula are undefined');

    if (post.price !== undefined) return post.price;

    return cart.reduce((acc, p) => {
      const fillValue = replaceValue({
        data: [p],
        text: post.priceFormula,
        boundary: '$',
      });
      const price = math.evaluate(fillValue);
      if (isNaN(+price))
        throw new Error(
          `post price formula has error\nexpr:${fillValue}, price:${price}`
        );
      return acc + +price;
    }, 0);
  }

  get: MiddleWare = async (req, res) => {
    const postOpt: PostOptionQuery = req.query;
    const isAdmin = req.user.type === 'admin';

    const order = isAdmin
      ? null
      : await this.orderModel.findOne({
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
      price: this.calculatePrice(p, order?.products ?? []),
    }));

    return res.json({ data: providers });
  };
}

const postService = new PostService();

export default postService;
