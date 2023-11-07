import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';
import { AuthStrategy } from '../../types/auth';
import { Req, Res } from '../../types/global';
import store from '../../store';
import { AuthStrategyBody } from '../../dto/in/auth/index.dto';
import { IUser, UserDocument, UserModel } from '../../types/user';
import {
  BadRequestError,
  DuplicateError,
  ForbiddenError,
  NotFound,
  UnauthorizedError,
} from '../../types/error';
import { extractToken, setToCookie, signToken } from '../handlers/auth.handler';
import { AuthEvents } from './authGateway.strategy';
import {
  addForwarded,
  axiosError2String,
  getEnv,
  getMyIp,
} from '../../utils/helpers';
import { Types } from 'mongoose';
import axios, { Axios } from 'axios';

type NodeewebInfo = IUser;
class NodeewebApi {
  api: Axios;

  constructor() {
    const baseURL = getEnv('nodeewebhub_api_base_url', {
      format: 'string',
    }) as string;
    if (!baseURL) throw new Error('nodeewebhub api url not set!');
    this.api = axios.create({
      baseURL,
    });
  }

  async infoWithToken(req: Req, token: string): Promise<NodeewebInfo> {
    const user = jwt.decode(token, { complete: true, json: true });
    if (!user) throw new UnauthorizedError('no valid token');

    const userType =
      user.payload['type'] ?? (user.payload['role'] ?? '').split(':')?.[0];
    const { data } = await this.api.post(
      '/auth/jwt',
      {
        userType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Forwarded-For': addForwarded(req, getMyIp()),
        },
      }
    );
    if (data.data._id) data.data._id = new Types.ObjectId(data.data._id);
    return data.data;
  }
}

export const NODEEWEB_STRATEGY = 'nodeeweb';
export class NodeewebStrategy extends AuthStrategy {
  getUserModel(req: Req): UserModel {
    return store.db.model(req.modelName);
  }
  async exportUser(
    req: Req,
    id: string | Types.ObjectId,
    throwOnNotFound = true
  ) {
    if (req.user !== undefined) return req.user;

    const model = this.getUserModel(req);
    const user: UserDocument = await model.findById(id);
    if (!user && throwOnNotFound) throw new NotFound('user not found');
    if (user && !user.active) throw new ForbiddenError('user inactive');
    req.user = user;

    return user;
  }

  async getAuthInfo(req: Req): Promise<NodeewebInfo> {
    if (req.authInfo) return req.authInfo as NodeewebInfo;

    const nodeewebApi = new NodeewebApi();
    const token = extractToken(req, 'authToken');
    if (!token)
      throw new UnauthorizedError('auth failed because token is empty');

    try {
      const info = await nodeewebApi.infoWithToken(req, token);
      req.authInfo = info;
      return info;
    } catch (err) {
      store.env.isPro ||
        store.systemLogger.error(
          '[NodeewebAuthStrategy]',
          axiosError2String(err, true).message
        );
      throw new UnauthorizedError(err.message, undefined, err.stack);
    }
  }

  async detect(req: Req, res: Res, next: NextFunction) {
    const { login, signup } = req.body as AuthStrategyBody;
    const info = await this.getAuthInfo(req);
    const userDoc = await this.exportUser(req, info._id, false);

    if (userDoc && login) return await this.login(req, res);
    if (!userDoc && signup) return await this.signup(req, res, next);

    return res.json({ data: { userExists: Boolean(userDoc) } });
  }

  async login(req: Req, res: Res) {
    const info = await this.getAuthInfo(req);
    const user = await this.exportUser(req, info._id, true);

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
    const user = await this.exportUser(req, info._id, false);

    if (user) throw new DuplicateError('user exists, please login');

    const userDoc = await this.getUserModel(req).create(info);
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
  strategyId = NODEEWEB_STRATEGY;
}
