import jwt from 'jsonwebtoken';
import passport, { Strategy } from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { ControllerAccess } from '../../types/controller';
import store from '../../store';
import { ForbiddenError, UnauthorizedError } from '../../types/error';
import AdminSchema from '../../schema/admin.schema';
import CustomerSchema from '../../schema/customer.schema';
import { MiddleWare } from '../../types/global';
import { Query } from 'mongoose';
import { CookieOptions, Response } from 'express';
import { OPTIONAL_LOGIN, PUBLIC_ACCESS } from '../constants/String';
import { AuthStrategy } from '../../types/auth';
import logger from './log.handler';
import { color } from '../../utils/color';
import _ from 'lodash';

const jwtStrategyMap = new Map<string, Strategy>();

export const AuthUserAccess: ControllerAccess[] = [
  {
    role: PUBLIC_ACCESS,
    modelName: 'customer',
  },
  {
    role: PUBLIC_ACCESS,
    modelName: 'admin',
  },
];

export const AdminAccess: ControllerAccess = {
  modelName: 'admin',
  role: PUBLIC_ACCESS,
};

export type UserPassStrategyOpt = {
  model: string;
  query?: (body: any) => Query<any, any>;
  createIfNotExist?: boolean | ((body: any) => any);
  name: string;
};
export type JwtStrategyOpt = {
  model: string | string[];
  notThrow?: boolean;
  name: string;
  cookieName?: string;
};

function jwtStrategyBuilder(opt: JwtStrategyOpt) {
  let strategy = jwtStrategyMap.get(opt.name);
  if (strategy) return strategy;

  strategy = new JwtStrategy(
    {
      jwtFromRequest: (req) =>
        ExtractJwt.fromAuthHeaderAsBearerToken()(req) ||
        (opt.cookieName && req.cookies[opt.cookieName]),
      secretOrKey: store.env.AUTH_SECRET,
      passReqToCallback: true,
    },
    async (req, { id, iat }, done) => {
      iat = iat * 1000;
      const models = Array.isArray(opt.model) ? opt.model : [opt.model];
      const query = (model: string) =>
        store.db.model(model).findOne({
          _id: id,
          passwordChangeAt: { $lte: new Date(iat) },
          active: true,
        });

      for (const model of models) {
        const user = await query(model);
        if (user) {
          req.modelName = model;
          return done(null, user);
        }
      }

      if (opt.notThrow) return done(null, {});
      return done(
        new UnauthorizedError('token is valid but access to user failed')
      );
    }
  );

  jwtStrategyMap.set(opt.name, strategy);
  return strategy;
}
function localStrategyBuilder(opt: UserPassStrategyOpt) {
  const strategyName = opt.name;
  let strategy = jwtStrategyMap.get(strategyName);
  if (strategy) return strategy;

  strategy = new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      let user = await store.db
        .model<typeof AdminSchema | typeof CustomerSchema>(opt.model)
        .findOne(opt.query ? opt.query(req.body) : { username, active: true });

      const msg = 'username or password is wrong';
      if (!user) {
        if (!opt.createIfNotExist) return done(new UnauthorizedError(msg));

        // create user
        const new_user =
          typeof opt.createIfNotExist === 'boolean'
            ? req.body
            : opt.createIfNotExist(req.body);
        user = await store.db
          .model<typeof AdminSchema | typeof CustomerSchema>(opt.model)
          .create(new_user);
        return done(null, user);
      }

      //   compare password
      if (!(await bcrypt.compare(password, user.password)))
        return done(new UnauthorizedError(msg));

      done(null, user);
    }
  );

  jwtStrategyMap.set(strategyName, strategy);
  return strategy;
}

export function authWithPass(opt: UserPassStrategyOpt) {
  return passport
    .use(opt.name, localStrategyBuilder(opt))
    .authenticate(opt.name);
}

export function authWithToken(opt: JwtStrategyOpt) {
  return passport
    .use(opt.name, jwtStrategyBuilder(opt))
    .authenticate(opt.name, { session: false });
}

export function authWithGoogle() {}

export function authorizeWithToken(
  modelNames: string[],
  opt: Partial<JwtStrategyOpt> = {}
): MiddleWare[] {
  return [
    authWithToken({
      name: `jwt-${modelNames.join('-')}-${JSON.stringify(opt)}`,
      ...opt,
      model: modelNames,
    }),
    (req, res, next) => {
      if (!req.user._id) delete req.user;
      return next();
    },
  ];
}
export function authenticate(...accesses: ControllerAccess[]): MiddleWare {
  return (req, res, next) => {
    const modelName = req.user?.['constructor']?.['modelName'];
    // not login and there is optional login role
    if (!modelName && accesses.map((a) => a.role).includes(OPTIONAL_LOGIN))
      return next();

    const allowedRoles = accesses
      .filter((access) => access.modelName === modelName)
      .map((access) => access.role);
    if (
      !(
        allowedRoles.includes(PUBLIC_ACCESS) ||
        allowedRoles.includes(OPTIONAL_LOGIN) ||
        allowedRoles.includes(req.user?.role)
      )
    )
      return next(new ForbiddenError('user can not access'));
    return next();
  };
}

export function signToken(id: string) {
  return jwt.sign({ id }, store.env.AUTH_SECRET, {
    expiresIn: '30d',
  });
}
export function verifyToken(token: string) {
  return jwt.verify(token, store.env.AUTH_SECRET);
}

export function setToCookie(res: Response, value: string, key = 'authToken') {
  const exp = new Date();
  exp.setDate(exp.getDate() + 30);
  res.cookie(key, value, {
    secure: !store.env.isLoc,
    httpOnly: !store.env.isLoc,
    sameSite: 'none',
    expires: exp,
  });
}

export function tokenSetToCookie(
  tokenName: string,
  cookieOpt: { name: string }
): MiddleWare {
  return (req, res, next) => {
    setToCookie(res, req[tokenName], cookieOpt.name);
    next();
  };
}

export type AuthCheckOpt = {
  modelName: string;
  checkerId: string;
};

export function registerAuthStrategy(strategy: AuthStrategy, from?: string) {
  store.strategies.set(strategy.strategyId, strategy);
  logger.log(
    color(
      'Red',
      `## ${from ? `${from} ` : ''}Register ${_.capitalize(
        strategy.strategyId
      )} AuthStrategy ##`
    )
  );
}

export function unregisterAuthStrategy(id: string, from?: string) {
  const existBefore = store.strategies.delete(id);
  if (!existBefore) return;
  logger.log(
    color(
      'Red',
      `## ${from ? `${from} ` : ''}Unregister ${_.capitalize(
        id
      )} AuthStrategy ##`
    )
  );
}
