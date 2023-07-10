import jwt from "jsonwebtoken";
import passport, { Strategy } from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { ControllerAccess } from "../../types/controller";
import store from "../../store";
import { ForbiddenError, UnauthorizedError } from "../core/error";
import AdminSchema from "../../schema/admin.schema";
import CustomerSchema from "../../schema/customer.schema";
import { MiddleWare } from "../../types/global";
import { Query } from "mongoose";
import { CookieOptions } from "express";
import { PUBLIC_ACCESS } from "../constants/String";
const strategyMap = new Map<string, Strategy>();

export const AuthUserAccess: ControllerAccess[] = [
  {
    role: PUBLIC_ACCESS,
    modelName: "customer",
  },
  {
    role: PUBLIC_ACCESS,
    modelName: "admin",
  },
];

export type UserPassStrategyOpt = {
  model: string;
  query?: (body: any) => Query<any, any>;
  createIfNotExist?: boolean | ((body: any) => any);
  name: string;
};
export type JwtStrategyOpt = {
  model: string;
  notThrow?: boolean;
  name: string;
  cookieName?: string;
};

function jwtStrategyBuilder(opt: JwtStrategyOpt) {
  let strategy = strategyMap.get(opt.name);
  if (strategy) return strategy;

  strategy = new JwtStrategy(
    {
      jwtFromRequest: (req) =>
        ExtractJwt.fromAuthHeaderAsBearerToken()(req) ||
        (opt.cookieName && req.cookies[opt.cookieName]),
      secretOrKey: store.env.AUTH_SECRET,
      passReqToCallback: true,
    },
    async ({ id }, done) => {
      const user = await store.db
        .model(opt.model)
        .findOne({ _id: id, active: true });

      if (!user && !opt.notThrow)
        return done(
          new UnauthorizedError("token is valid but access to user failed")
        );
      done(null, user);
    }
  );

  strategyMap.set(opt.name, strategy);
  return strategy;
}
function localStrategyBuilder(opt: UserPassStrategyOpt) {
  const strategyName = opt.name;
  let strategy = strategyMap.get(strategyName);
  if (strategy) return strategy;

  strategy = new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false,
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      let user = await store.db
        .model<typeof AdminSchema | typeof CustomerSchema>(opt.model)
        .findOne(opt.query ? opt.query(req.body) : { username, active: true });

      const msg = "username or password is wrong";
      if (!user) {
        if (!opt.createIfNotExist) return done(new UnauthorizedError(msg));

        // create user
        const new_user =
          typeof opt.createIfNotExist === "boolean"
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

  strategyMap.set(strategyName, strategy);
  return strategy;
}

export function authWithPass(opt: UserPassStrategyOpt) {
  return passport
    .use(opt.name, localStrategyBuilder(opt))
    .authenticate(opt.name);
}

export function authWithToken(opt: JwtStrategyOpt) {
  return passport.use(opt.name, jwtStrategyBuilder(opt)).authenticate(opt.name);
}

export function authWithGoogle() {}

export function authorizeWithToken(modelNames: string[]): MiddleWare[] {
  // add passport middleware
  const mw = modelNames
    //   change to passport middleware
    .map((name, i) =>
      authWithToken({
        model: name,
        notThrow: i === modelNames.length - 1,
        name: `jwt-${name}-${i === modelNames.length - 1}`,
      })
    )
    //   add checker
    .map((fn) => {
      const checkedMiddleware: MiddleWare = (req, res, next) => {
        if (req.user) return next();
        return fn(req, res, next);
      };
      return checkedMiddleware;
    });

  return mw;
}
export function authenticate(...accesses: ControllerAccess[]): MiddleWare {
  return (req, res, next) => {
    const modelName = req.user["constructor"].name;
    const allowedRoles = accesses
      .filter((access) => access.modelName === modelName)
      .map((access) => access.role);
    if (
      !allowedRoles.includes(PUBLIC_ACCESS) &&
      !allowedRoles.includes(req.user.role)
    )
      return next(new ForbiddenError("user can not access"));
    return next();
  };
}

export function signToken(id: string) {
  return jwt.sign({ id }, store.env.AUTH_SECRET, {
    expiresIn: "30d",
  });
}
export function verifyToken(token: string) {
  return jwt.verify(token, store.env.AUTH_SECRET);
}

export function tokenSetToCookie(
  tokenName: string,
  cookieOpt: CookieOptions & { name: string }
): MiddleWare {
  return (req, res, next) => {
    const exp = new Date();
    exp.setDate(exp.getDate() + 30);
    res.cookie(cookieOpt.name, req[tokenName], {
      secure: !store.env.isLoc,
      httpOnly: !store.env.isLoc,
      sameSite: "none",
      expires: exp,
    });
    next();
  };
}
