---
sidebar_position: 3
---

# Controller
Controllers are responsible for handling incoming **requests** and returning **responses** to the client.

## Table of Contents

- [Basic RBAC implementation](#basic-rbac-implementation)
- [Structure](#structure)
- [Built-in Roles](#built-in-roles)


## Register
all controller registration use as below:

### Controller Register
```ts
controllerRegister(schema:ControllerSchema,opt:ControllerRegisterOptions);
```

schema define **what** this route is, **where** it must initiate and **which** middlewares use for it

```ts
type ControllerSchema = {
  url?: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  access?: ControllerAccess | ControllerAccess[];
  service: MiddleWare | MiddleWare[];
  validate?: ValidateArgs | ValidateArgs[] | null;
};
```
options define **who** register this route and **how** registration must work

```ts
type ControllerRegisterOptions = {
  base_url?: string | string[];
  strategy?: 'replace' | 'insertAfter' | 'insertFirst';
} & RegisterOptions
```

### Controller Register Batch
use array of **ControllerSchema** for register:
```ts
function controllersBatchRegister(
  schemas: ControllerSchema[],
  opt: ControllerRegisterOptions
);
```