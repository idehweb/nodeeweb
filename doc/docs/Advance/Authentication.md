---
sidebar_position: 1
---    

# Authentication
Authentication is an **essential** part of most applications. There are many different approaches and strategies to handle authentication. The approach taken for any project depends on its particular application requirements. This chapter presents several approaches to authentication that can be adapted to a variety of different requirements.

Let's flesh out our requirements. For this use case, clients will start by authenticating with a **strategy**. Once authenticated, the server will issue a JWT that can be sent as a bearer token in an authorization header on subsequent requests to prove authentication. We'll also create a protected route that is accessible only to requests that contain a valid JWT.

## Table of Contents

- [Gateway](#gateway)
- [Strategy](#strategy)
- [Usage](#usage)


## Gateway
there is a **Auth Gateway Strategy** which listen on these APIs, then pass each request into strategy that we want

| Path | Method | Function |
| ---- | -----  | -------- |
| `/auth/:strategyId/(detect)?` | `POST` | `detect` |
| `/auth/:strategyId/login` | `POST` | `login` |
| `/auth/:strategyId/signup` | `POST` | `signup` |
| `/auth/:strategyId/logout` | `POST` | `logout` |


and there is DTO of body:
```ts
export class AuthStrategyBody {
  userType: AuthUserType;
  signup?: boolean;
  login?: boolean;
  user?: any;
}
```

## Strategy
each **Auth Strategy** must implement this abstract class
```ts
abstract class AuthStrategy {
    abstract strategyId: string;
  abstract detect(req: Req, res: Res, next: NextFunction): any;
  abstract login(req: Req, res: Res, next: NextFunction): any;
  abstract signup(req: Req, res: Res, next: NextFunction): any;
  logout(req: Req, res: Res, next: NextFunction): any {
    return res.status(200).json({ message: 'successfully logout' });
  }
}
```

then register itself into **store** as follow as bellow:

```ts
registerAuthStrategy(new JwtStrategy(), 'CoreAuth');
```

### Core
by default core register these strategies:
- **JwtStrategy:** verify bearer token on login, throw exception on signup
- **UserPassStrategy:** signup and login with username and password, use `UserPassUserLogin` and `UserPassUserSignup` DTO for body
- **GoogleStrategy:** use google oauth2, for activate this strategy you need config google secrets and client id into config auth
- **NodeewebStrategy:** use nodeeweb hub as auth provider, after authenticate from nodeeweb hub create local jwt token
- **OtpStrategy:** use `SMSPlugin` for send verification code, activate this strategy by install at least one `SMSPluginType`, use `OtpUserDetect`, `OtpUserLogin`, `OtpUserSignup` DTO.


## Usage
for protect API gateways on `controllerRegister` use access attribute.