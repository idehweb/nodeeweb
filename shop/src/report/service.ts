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

type schema = {
  statistics: {
    [key: string]: unknown;
  };
  charts: {
    [key: string]: {
      title: string;
      categories: string | number | Date[];
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
      }
      return prev;
    }, {}) as any;
  }

  getGeneral: MiddleWare = async (req, res) => {
    const { period } = req.query as ReportBaseQueryParam;

    const counts = await this.getCounts(period);
    return res.json({ data: { statistics: { counts } } });
  };
  getOrder: MiddleWare = async (req, res) => {};
}

export default new Service();
