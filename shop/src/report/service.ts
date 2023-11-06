import { MiddleWare } from '@nodeeweb/core';
import { ReportBaseQueryParam } from '../../dto/in/report';
import store from '../../store';
import { PostModel } from '../../schema/post.schema';
import { PageModel } from '../../schema/page.schema';
import { ProductModel } from '../../schema/product.schema';
import { CustomerModel } from '../../schema/customer.schema';
import { PublishStatus } from '../../schema/_base.schema';
import { PipelineStage } from 'mongoose';
import _ from 'lodash';
import { slugify, toMs } from '@nodeeweb/core/utils/helpers';
import moment from 'moment-jalaali';
import { OrderModel, OrderStatus } from '../../schema/order.schema';
import logger from '../../utils/log';

type schema = {
  statistics: {
    [key: string]: unknown;
  };
  charts: {
    [key: string]: {
      title: string;
      categories: (string | number | Date)[];
      series: { name: string; data: number[] }[];
    };
  };
};

class Service {
  get postModel(): PostModel {
    return store.db.model('post');
  }
  get pageModel(): PageModel {
    return store.db.model('page');
  }
  get productModel(): ProductModel {
    return store.db.model('product');
  }
  get customerModel(): CustomerModel {
    return store.db.model('customer');
  }
  get orderModel(): OrderModel {
    return store.db.model('order');
  }

  getPeriodFilter(period: number, key = 'createdAt') {
    if (!period) return {};
    return { [key]: { $gte: new Date(Date.now() - period) } };
  }

  private countPl({ filter }) {
    const pl: PipelineStage[] = [];

    pl.push({ $match: filter });
    pl.push({
      $group: {
        _id: { active: '$active', status: '$status' },
        count: { $sum: 1 },
      },
    });

    return pl;
  }

  private async getCounts(period?: number): Promise<{
    page: number;
    post: number;
    product: number;
    customer: number;
  }> {
    return (
      await Promise.all(
        [
          this.pageModel,
          this.postModel,
          this.productModel,
          this.customerModel,
          this.orderModel,
        ].map((m) =>
          m.aggregate(this.countPl({ filter: this.getPeriodFilter(period) }))
        )
      )
    ).reduce((prev, curr, i) => {
      const value = curr
        .map((c) => {
          const nc = { ...c, ...c._id };
          delete nc._id;
          return nc;
        })
        .reduce((prev, curr) => {
          let k = '';
          if (curr.active) k += 'active';
          else k += 'inactive';

          if (typeof curr.status === 'string') k += '_' + curr.status;
          prev[k] = curr.count;
          return prev;
        }, {});

      // add total
      value.total = _.sum(Object.values(value));

      switch (i) {
        case 0:
          prev['page'] = value;
          break;
        case 1:
          prev['post'] = value;
          break;
        case 2:
          prev['product'] = value;
          break;
        case 3:
          prev['customer'] = value;
          break;
        case 4:
          prev['order'] = value;
          break;
      }
      return prev;
    }, {}) as any;
  }

  getGeneral: MiddleWare = async (req, res) => {
    const { period } = req.query as ReportBaseQueryParam;

    const counts = await this.getCounts(period);
    return res.json({ data: { statistics: { counts } } });
  };
  getOrder: MiddleWare = async (req, res) => {
    let { period } = req.query as ReportBaseQueryParam;
    if (!period) period = toMs('1y');
    let boundaries: Date[];
    const pl: PipelineStage[] = [];

    // period
    pl.push({
      $match: this.getPeriodFilter(period, 'updatedAt'),
    });

    // bucket
    const _calcBoundaries = () => {
      if (boundaries) return boundaries;
      boundaries = [];
      const [boundaryUnit, start] =
        period > toMs('1y')
          ? ['jYear', moment().startOf('jYear')]
          : period > toMs('1M')
          ? ['jMonth', moment().startOf('jMonth')]
          : period > toMs('1d')
          ? ['day', moment().startOf('day')]
          : ['hour', moment().startOf('h')];
      let index = start;
      const end = Date.now() - period - 1_000;

      while (index.toDate().getTime() >= end) {
        boundaries.push(new Date(index.toDate()));
        index.subtract(1, boundaryUnit as any);
      }
      boundaries = boundaries.reverse();
      return boundaries;
    };
    const _bucket = () => {
      const pl: PipelineStage.FacetPipelineStage[] = [];
      const boundaries = _calcBoundaries();

      // bucket
      pl.push({
        $bucket: {
          groupBy: '$updatedAt',
          boundaries,
          default: new Date(0),
        },
      });

      // sort
      pl.push({
        $sort: {
          _id: 1,
        },
      });

      return pl;
    };

    // facet
    const facetPls = Object.values(OrderStatus)
      .map((s) => {
        return { [s]: [{ $match: { status: s } }, ..._bucket()] };
      })
      .reduce((prev, curr) => ({ ...prev, ...curr }), {});

    pl.push({ $facet: facetPls });

    // flat
    const _flat = () => {
      return Object.values(OrderStatus)
        .map((s) => {
          return {
            [s]: {
              $arrayToObject: {
                $map: {
                  input: `$${s}`,
                  in: {
                    k: { $toString: '$$this._id' },
                    v: '$$this.count',
                  },
                },
              },
            },
          };
        })
        .reduce((prev, curr) => ({ ...prev, ...curr }), {});
    };

    pl.push({ $project: _flat() });

    store.env.isPro || logger.log('[report-order] pipeline:', pl);
    const [stats] = await this.orderModel.aggregate(pl, { allowDiskUse: true });

    // transform
    const categories = _calcBoundaries().map((b) => b.toISOString());
    return res.json({
      data: {
        statistics: this.totalStat(stats),
        charts: this.transformCharts('order', stats, categories),
      } as schema,
    });
  };

  private totalStat(data) {
    return Object.keys(data)
      .map((k) => ({ [`total_${slugify(k)}`]: _.sum(Object.values(data[k])) }))
      .reduce((prev, curr) => ({ ...prev, ...curr }), {});
  }

  private transformCharts(
    name: string,
    data: any,
    categories: string[]
  ): schema['charts'] {
    const series = Object.keys(data).map((k) => ({
      name: k,
      data: categories.map((c) => {
        if (data[k][c]) return data[k][c];
        return 0;
      }),
    }));

    return { [name]: { title: name, categories, series } };
  }
}

export default new Service();
