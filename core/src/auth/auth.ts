import jwt from "jsonwebtoken";
import passport, { Strategy } from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { ControllerAccess } from "../../types/controller";
import store from "../../store";
import { ForbiddenError, UnauthorizedError } from "../common/errorHandler";
import AdminSchema from "../../schema/admin.schema";
import CustomerSchema from "../../schema/customer.schema";
import { MiddleWare } from "../../types/global";
const strategyMap = new Map<string, Strategy>();
const rolesMap = new Map<string, number>();

function jwtStrategyBuilder(modelName: string) {
  let strategy = strategyMap.get(`jwt-${modelName}`);
  if (strategy) return strategy;

  strategy = new JwtStrategy(
    {
      jwtFromRequest: (req) =>
        ExtractJwt.fromAuthHeaderAsBearerToken()(req) || req.cookies.auth,
      secretOrKey: store.env.AUTH_SECRET,
      passReqToCallback: true,
    },
    async ({ id }, done) => {
      const user = await store.db
        .model(modelName)
        .findOne({ _id: id, active: true });

      if (!user)
        return done(
          new UnauthorizedError("token is valid but access to user failed")
        );
      done(null, user);
    }
  );

  strategyMap.set(`jwt-${modelName}`, strategy);
  return strategy;
}
function localStrategyBuilder(modelName: string) {
  let strategy = strategyMap.get(`local-${modelName}`);
  if (strategy) return strategy;

  strategy = new LocalStrategy(
    { usernameField: "username", passwordField: "password", session: false },
    async (username, password, done) => {
      const user = await store.db
        .model<typeof AdminSchema | typeof CustomerSchema>(modelName)
        .findOne({ username, active: true });

      const msg = "username of password is wrong";
      if (!user) return done(new UnauthorizedError(msg));

      //   compare password
      if (!(await bcrypt.compare(password, user.password)))
        return done(new UnauthorizedError(msg));

      done(null, user);
    }
  );

  strategyMap.set(`local-${modelName}`, strategy);
  return strategy;
}

export function loginWithPass(modelName: string) {
  return passport.use(localStrategyBuilder(modelName));
}

export function loginWithToken(modelName: string) {
  return passport.use(jwtStrategyBuilder(modelName));
}

export function authWithGoogle() {}

export function authorize(modelName: string): any {}
export function authenticate(access: ControllerAccess): MiddleWare {
  return (req, res, next) => {
    if (
      rolesMap.get(req.user.role) === null ||
      rolesMap.get(req.user.role) > rolesMap.get(access.role)
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
export function registerRole(role: string, level: number) {
  rolesMap.set(role, level);
}
