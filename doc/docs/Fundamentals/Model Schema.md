---
sidebar_position: 3
---

# Model Schema
nodeeweb applications use [mongoose](https://mongoosejs.com/) as ODM so we create standard mongoose schema them core register them and create mongoose models.

# Create and Modify
go to `./schema` which create in root directory after first you start core application, then create your custom schema file base on this pattern: `<name>.schema.ts`
> files which start with `_` not follow by core

> you can use `<number>.<name>.schema.ts` pattern which change compilation order

# Access
for access specific model follow as below
```ts
const userModel = store.db.model<UserModel>('user')
```