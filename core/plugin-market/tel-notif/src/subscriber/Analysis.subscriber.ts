import { call } from '../utils';
import Subscriber, { SubscriberOptions } from './subscriber.abstract';
import { CronJob } from 'cron';
export default class AnalysisSubscriber extends Subscriber {
  dailyCron: CronJob;
  private dailyAnalysis = async () => {
    try {
      const db = this.opts.resolve('store').db;
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000); // yesterday
      const now = new Date(); // now;
      const dailyQ = { createdAt: { $lte: now, $gte: yesterday } };

      const orderCount = await db
        .model('order')
        .find({
          ...dailyQ,
          active: true,
          status: { $in: ['need-to-pay', 'paid'] },
        })
        .countDocuments();

      const [agg] =
        (await db.model('transaction').aggregate([
          {
            $match: {
              ...dailyQ,
              status: 'paid',
              active: true,
            },
          },
          {
            $group: {
              _id: null,
              saleAmount: { $sum: '$amount' },
            },
          },
        ])) ?? [];
      const saleAmount = agg?.saleAmount ?? 0;
      const smsSentCount = await db
        .model('notification')
        .find({
          ...dailyQ,
          status: 'send_success',
        })
        .countDocuments();

      const newCustomerCount = await db
        .model('customer')
        .find({
          ...dailyQ,
          active: true,
        })
        .countDocuments();
      const newProductCount = await db
        .model('product')
        .find({
          ...dailyQ,
          active: true,
        })
        .countDocuments();
      const newProductEditCount = await db
        .model('product')
        .find({
          updatedAt: dailyQ.createdAt,
          active: true,
        })
        .countDocuments();
      const newPostCount = await db
        .model('post')
        .find({
          ...dailyQ,
          active: true,
        })
        .countDocuments();
      const newPostEditCount = await db
        .model('post')
        .find({
          updatedAt: dailyQ.createdAt,
          active: true,
        })
        .countDocuments();

      let msg = `**آنالیز روزانه**    ${new Intl.DateTimeFormat('fa-IR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(yesterday)}\n`;

      msg += `تعداد سفارشات: ${orderCount}\n`;
      msg += `مجموع فروش : ${new Intl.NumberFormat('fa-IR').format(
        saleAmount
      )}\n`;
      msg += `تعداد پیامک های ارسال شده موفق: ${smsSentCount}\n`;
      msg += `تعداد مشتریان جدید: ${newCustomerCount}\n`;
      msg += `تعداد محصولات اصافه شده: ${newProductCount}\n`;
      msg += `تعداد محصولات ویرایش شده: ${newProductEditCount}\n`;
      msg += `تعداد مقاله های اصافه شده: ${newPostCount}\n`;
      msg += `تعداد مقاله های ویرایش شده: ${newPostEditCount}\n`;

      await call(this.opts.provider.send.bind(this.opts.provider), msg);
    } catch (err) {
      console.error('analysis daily error', err);
    }
  };
  subscribe(): void {
    this.dailyCron = new CronJob(
      '0 0 * * *',
      this.dailyAnalysis,
      null,
      true,
      'Asia/Tehran'
      // ,
      // null,
      // true
    );
    this.dailyCron.start();
  }
  unSubscribe(): void {
    if (!this.dailyCron) return;
    this.dailyCron.stop();
  }
}
