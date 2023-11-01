import { NextFunction } from 'express';
import { google } from 'googleapis';
import { AuthStrategy } from '../../types/auth';
import { Req, Res } from '../../types/global';
import store from '../../store';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { AuthStrategyBody } from '../../dto/in/auth/index.dto';
import { IUser, UserDocument, UserModel } from '../../types/user';
import {
  BadRequestError,
  DuplicateError,
  ForbiddenError,
  NotFound,
  UnauthorizedError,
} from '../../types/error';
import { setToCookie, signToken } from '../handlers/auth.handler';
import { AuthEvents } from './authGateway.strategy';

const googleConfig = {
  get clientId(): string {
    return store.config.auth.google?.client_id;
  },
  get clientSecret(): string {
    return store.config.auth.google?.client_secret;
  },
};

const defaultScope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];
// google.options({ auth: oauth2Client });

type GoogleInfo = {
  email: string;
  firstName?: string;
  lastName?: string;
  extra: any;
};
export default class GoogleApi {
  api: OAuth2Client;
  tokens: Credentials;

  constructor() {
    if (!googleConfig.clientId || !googleConfig.clientSecret)
      throw new Error("configs are'nt initialize");
    this.api = new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret
    );
  }

  get redirect_url() {
    return this.api.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: defaultScope,
    });
  }

  async verify(code: string) {
    const data = await this.api.getToken(code);
    this.tokens = data.tokens;
    return data.tokens;
  }

  async infoWithCredential(credential: string): Promise<GoogleInfo> {
    const user = await this.api.verifyIdToken({
      idToken: credential,
    });

    const payload = user.getPayload();
    return {
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      extra: payload,
    };
  }
}

export const GOOGLE_STRATEGY = 'google';
export class GoogleStrategy extends AuthStrategy {
  getUserModel(req: Req): UserModel {
    return store.db.model(req.modelName);
  }
  async exportUser(req: Req, email: string, throwOnNotFound = true) {
    if (req.user !== undefined) return req.user;

    const model = this.getUserModel(req);
    const user: UserDocument = await model.findOne({ email });
    if (!user && throwOnNotFound) throw new NotFound('user not found');
    if (user && !user.active) throw new ForbiddenError('user inactive');
    req.user = user;

    return user;
  }

  async getAuthInfo(req: Req): Promise<GoogleInfo> {
    if (req.authInfo) return req.authInfo as GoogleInfo;

    const googleApi = new GoogleApi();
    const { user } = req.body as AuthStrategyBody;
    if (!user?.credential)
      throw new UnauthorizedError(
        'auth failed because user credential is empty'
      );

    try {
      const info = await googleApi.infoWithCredential(user.credential);
      req.authInfo = info;
      return info;
    } catch (err) {
      let msg: string = err.message;
      const cutIndex = msg.indexOf(': <!DOCTYPE html>');
      if (cutIndex !== -1) msg = msg.slice(0, cutIndex);
      throw new UnauthorizedError(msg, undefined, err.stack);
    }
  }

  async detect(req: Req, res: Res, next: NextFunction) {
    const { login, signup } = req.body as AuthStrategyBody;
    const info = await this.getAuthInfo(req);
    const userDoc = await this.exportUser(req, info.email, false);

    if (userDoc && login) return await this.login(req, res);
    if (!userDoc && signup) return await this.signup(req, res, next);

    return res.json({ data: { userExists: Boolean(userDoc) } });
  }

  async login(req: Req, res: Res) {
    const info = await this.getAuthInfo(req);
    const user = await this.exportUser(req, info.email, true);

    const outUser: IUser = { ...user.toObject(), password: undefined };

    // sign token
    const token = signToken(outUser);

    // cookie
    setToCookie(res, token);

    return res.status(200).json({
      data: {
        user: outUser,
        token,
      },
    });
  }

  async signup(req: Req, res: Res, next: NextFunction) {
    const info = await this.getAuthInfo(req);
    const user = await this.exportUser(req, info.email, false);

    if (user) throw new DuplicateError('user exists, please login');

    const userDoc = await this.getUserModel(req).create({
      firstName: info.firstName,
      lastName: info.lastName,
      email: info.email,
      data: { googleExtra: info.extra },
    });
    const token = signToken(userDoc);
    setToCookie(res, token, 'authToken');

    // emit
    store.event?.emit(AuthEvents.AfterRegister, user);

    return res.status(201).json({
      data: {
        user: { ...userDoc.toObject(), data: undefined },
        token,
      },
    });
  }
  strategyId = GOOGLE_STRATEGY;
}
