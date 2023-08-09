import { MiddleWare } from '@nodeeweb/core/types/global';
import store from '@nodeeweb/core/store';
import axios from 'axios';
import {
  NotificationDocument,
  NotificationModel,
} from '../../schema/notification.schema';
import {
  CorePluginType,
  SMSPluginContent,
  SMSPluginType,
  SmsSendStatus,
} from '@nodeeweb/core/types/plugin';
import { CustomerDocument, CustomerModel } from '../../schema/customer.schema';
import { replaceValue } from '../../utils/helpers';

export default class Service {
  static get customerModel(): CustomerModel {
    return store.db.model('customer');
  }

  static get notificationModel(): NotificationModel {
    return store.db.model('notification');
  }

  static replaceValue(customer: CustomerDocument, text: string) {
    return replaceValue({ data: [store.settings, customer.toObject()], text });
  }

  static afterCreate: MiddleWare = async (req, res) => {
    const notif: NotificationDocument = req.crud;

    // send response to user
    res.status(202).json({ data: notif });

    const smsPlugin = store.plugins.get(CorePluginType.SMS) as SMSPluginContent;
    if (!smsPlugin) {
      return await this.notificationModel.updateOne(
        { _id: notif._id },
        {
          $set: {
            status: SmsSendStatus.Send_Failed,
            response: {
              at: new Date(),
              message: `send failed because system could'nt find any registered ${CorePluginType.SMS} plugin`,
            },
          },
        }
      );
    }

    // fetch targets
    const targets = await this.customerModel.find({
      $and: [
        Object.fromEntries(
          Object.entries({
            customerGroup: notif.customerGroup,
            phoneNumber: notif.phoneNumber,
            source: notif.source,
          }).filter(([k, v]) => v)
        ),
        { phoneNumber: { $exists: true }, active: true },
      ],
    });

    // send sms
    const response = await smsPlugin.stack[1]({
      type: SMSPluginType.Reg,
      content: targets.map((customer) => ({
        to: customer.phoneNumber,
        text: this.replaceValue(customer, notif.message),
      })),
    });

    // save notif
    await this.notificationModel.updateOne(
      { _id: notif._id },
      {
        $set: {
          from: response.from,
          response: {
            at: response.at,
            message: response.message,
          },
          status: response.status,
        },
      }
    );
  };
}
