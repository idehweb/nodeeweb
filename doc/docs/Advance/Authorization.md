---
sidebar_position: 2
---    

# Authorization
**Authorization** refers to the process that determines what a user is able to do. For example, an administrative user is allowed to create, edit, and delete posts. A non-administrative user is only authorized to read the posts.

Authorization is orthogonal and independent from authentication. However, authorization requires an authentication mechanism.

There are many different approaches and strategies to handle authorization. The approach taken for any project depends on its particular application requirements. This chapter presents a few approaches to authorization that can be adapted to a variety of different requirements.


## Table of Contents

- [Basic RBAC implementation](#basic-rbac-implementation)
- [Structure](#structure)
- [Built-in Roles](#built-in-roles)


## Basic RBAC implementation
Role-based access control (**RBAC**) is a policy-neutral access-control mechanism defined around roles and privileges. In this section, we'll demonstrate how to use a very basic RBAC mechanism using Nodeeweb access.

## Structure
Nodeeweb **Role Object** structure is:

```ts
type Role = {
    modelName: string;
    role: string;
}
```

for example if you want to only admin access this route use like this:
```ts
const AdminAccess = {
    modelName: 'admin',
    role: PUBLIC_ACCESS,
}
```

## Built-in Roles
these are some build-in roles that defined in core:

| Role | Description |
| ---- | ----------- |
| **OPTIONAL_LOGIN** | it means use optional **authentication**, and save into `req.user` |
| **PUBLIC_ACCESS** | each user that **authenticate** into specify model name can access this route |
