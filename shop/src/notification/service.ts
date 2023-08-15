import { MiddleWare } from '@nodeeweb/core/types/global';
import store from '../../store';
import {
  INotification,
  NotificationDocument,
  NotificationModel,
} from '../../schema/notification.schema';
import {
  CorePluginType,
  SMSPluginArgs,
  SMSPluginContent,
  SMSPluginResponse,
  SMSPluginResponseRaw,
  SMSPluginType,
  SmsSendStatus,
} from '@nodeeweb/core/types/plugin';
import { CustomerDocument, CustomerModel } from '../../schema/customer.schema';
import { getModelName, replaceValue } from '@nodeeweb/core/utils/helpers';
import { AuthEvents } from '@nodeeweb/core/src/auth/authGateway.strategy';
import { getPluginEventName } from '@nodeeweb/core/src/handlers/plugin.handler';
import { UserDocument } from '@nodeeweb/core/types/user';
import { catchFn } from '@nodeeweb/core/utils/catchAsync';
import { sendSms } from './sms.service';
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
            phone: notif.phone,
            source: notif.source,
          }).filter(([k, v]) => v)
        ),
        { phone: { $exists: true }, active: true },
      ],
    });

    // send sms
    const response = await smsPlugin.stack[1]({
      type: SMSPluginType.Manual,
      content: targets.map((customer) => ({
        to: customer.phone,
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
  private createNotif = async (body: INotification) => {
    await this.notificationModel.create(body);
  };
  private afterRegister = async (user: UserDocument) => {
    const registerText = store.config.sms_message_on.register;

    if (!registerText || !user?.phone || getModelName(user) !== 'customer')
      return;

    if (registerText && user?.phone) {
      await catchFn(async () => {
        // send welcome sms
        await sendSms({
          to: user.phone,
          type: SMSPluginType.Automatic,
          subType: SmsSubType.Register,
          text: this.replaceValue(user as any, registerText),
        });
      })();
    }
  };
  private afterSendSMS = async (
    res: SMSPluginResponseRaw,
    name: string,
    { to, type, subType, text }: SMSPluginArgs
  ) => {
    if (res.status !== SmsSendStatus.Send_Success) return;

    // only handle automatic sms
    if (type !== SMSPluginType.Automatic) return;

    // create record
    await this.createNotif({
      message: text,
      title: subType,
      phone: to,
      status: res.status,
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
