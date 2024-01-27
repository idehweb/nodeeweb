import randomNumber from 'random-number-csprng';
import store from '../../store';
import { NotImplement, SendSMSError } from '../../types/error';
import { Req, Res } from '../../types/global';
import {
  CorePluginType,
  SMSPluginContent,
  SMSPluginType,
  SmsSendStatus,
} from '../../types/plugin';
import { SmsSubType } from '../../types/config';
import { replaceValue } from '../../utils/helpers';
import _ from 'lodash';

export async function sendCode(req: Req, res: Res) {
  // generate and send code

  const phone = req.user?.phone ?? req.body.user?.phone;

  // send code
  const smsPlugin = store.plugins.get(CorePluginType.SMS) as SMSPluginContent;
  if (!smsPlugin) throw new NotImplement('sms plugin not found');

  // save to db
  const otpModel = store.db.model('otp');
  //check if sms send before :
  const prevCode = await otpModel.findOne({
    phone,
    type: req.modelName,
    updatedAt: { $gt: new Date(Date.now() - 120 * 1000) },
  });
  if (prevCode) {
    const leftTimeMs = prevCode.updatedAt.getTime() + 120 * 1000 - Date.now();
    return res.json(
      _.merge({}, req.res_body ?? {}, {
        type: SmsSendStatus.Send_Before,
        message: `sms send at ${prevCode.updatedAt}`,
        data: {
          leftTime: {
            milliseconds: leftTimeMs,
            seconds: Math.ceil(leftTimeMs / 1000),
          },
        },
      })
    );
  }

  const code = (
    await Promise.all(new Array(5).fill(0).map(() => randomNumber(0, 9)))
  ).join('');

  // create
  await otpModel.findOneAndUpdate(
    { phone, type: req.modelName },
    { code },
    { new: true, upsert: true }
  );

  // send code
  let codeResult: string | boolean;
  try {
    const response = await smsPlugin.stack[0]({
      to: phone,
      type: SMSPluginType.Automatic,
      subType: SmsSubType.OTP,
      text: replaceValue({
        data: [store.config.toObject(), { code }],
        text: store.config.sms_message_on.otp,
      }),
    });
    if (response.status === SmsSendStatus.Send_Success) codeResult = true;
  } catch (err) {
    codeResult = err.message;
  }

  if (codeResult !== true) {
    // revert changes
    await otpModel.findOneAndDelete({ phone, type: req.modelName });
    throw new SendSMSError(codeResult);
  }

  return res.json(
    _.merge({}, req.res_body ?? {}, {
      type: SmsSendStatus.Send_Success,
      message: `sms send at ${new Date().toISOString()}`,
      data: {
        leftTime: {
          milliseconds: 120_000,
          seconds: 120,
        },
      },
    })
  );
}
