import { MiddleWare } from '@nodeeweb/core/types/global';
import store from '@nodeeweb/core/store';
import {
  NotificationDocument,
  NotificationModel,
} from '../../schema/notification.schema';
import {
  CorePluginType,
  SMSPluginArgs,
  SMSPluginContent,
  SMSPluginType,
  SmsSendStatus,
} from '@nodeeweb/core/types/plugin';
import { CustomerDocument, CustomerModel } from '../../schema/customer.schema';
import { replaceValue } from '@nodeeweb/core/utils/helpers';
import { AuthEvents } from '@nodeeweb/core/src/auth/authGateway.strategy';
import { getPluginEventName } from '@nodeeweb/core/src/handlers/plugin.handler';
import { UserDocument, UserModel } from '@nodeeweb/core/types/user';
import { catchFn } from '@nodeeweb/core/utils/catchAsync';
import { sendSms } from './sms.service';
import { CreateNotification } from '../../dto/in/notification';
import { SmsSubType } from '@nodeeweb/core/types/config';

export default class Service {
  constructor() {
    this.init();
  }
  get customerModel(): CustomerModel {
    return store.db.model('customer');
  }
  get notificationModel(): NotificationModel {
    return store.db.model('notification');
  }
  replaceValue(customer: CustomerDocument, text: string) {
    return replaceValue({
      data: [store.config.toObject(), customer.toObject()],
      text,
    });
  }
  afterCreate: MiddleWare = async (req, res) => {
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
      type: SMSPluginType.Manual,
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
  private createNotif = async (body: CreateNotification) => {
    await this.notificationModel.create(body);
  };
  private afterRegister = async (user: UserDocument) => {
    console.log('after register call');
    const registerText = store.config.sms_message_on.register;
    if (registerText && user?.phoneNumber) {
      await catchFn(async () => {
        // send welcome sms
        await sendSms({
          to: user.phoneNumber,
          type: SMSPluginType.Automatic,
          subType: SmsSubType.Register,
          text: this.replaceValue(user as any, registerText),
        });
      })();
    }
  };
  private afterSendSMS = async (
    _: any,
    { to, type, subType, text }: SMSPluginArgs
  ) => {
    // only handle automatic sms
    if (type !== SMSPluginType.Automatic) return;

    // create record
    await this.createNotif({
      message: text,
      title: subType,
      phoneNumber: to,
    });
  };

  private init = () => {
    store.event.on(AuthEvents.AfterRegister, this.afterRegister);
    store.event.on(
      getPluginEventName({
        type: CorePluginType.SMS,
        after: true,
        content_stack: 0,
      }),
      this.afterSendSMS
    );
  };
}
