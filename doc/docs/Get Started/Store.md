---
sidebar_position: 2
---

# Store
all of variable that need for application saved into `store.ts` in root path, here is a overview of store type:


| Name | Type | Description | Default|
| ---- | ---- | :----------- | ------ |
| [env](#Env) | `StoreEnv` | load all environment variables front env files, parse and combine some of them | {} |
| db | [mongoose]("https://mongoosejs.com/docs/api/connection.html") | instance of mongoose connection | `MongooseConnection` |
| [dirs](#Dirs) | `string[]` | list of all root dirs that usage core modules | [`root path`]|
| server | [Server](https://expressjs.com/en/api.html#express) | instance of express server | `Server` |
| app | [Application](https://expressjs.com/en/api.html#app) | instance of express application | `Application` |
| [seo](#Seo) | `Seo` | instance of Seo abstraction class | `CoreSeo`|
| [supervisor](#Supervisor) | `SupervisorEmitter` | instance of SupervisorEmitter which emit submit events into declared supervisor | `undefined`|
[globalMiddleware](#GlobalMiddleware) | `{error: ErrorPackageFn ; pipes : { [key: string]: Pipe<unknown> } }` | global middleware that apply into all requests | `{ pipes: {}, error: {} }`|
| [systemLogger](#SystemLogger) | `Logger` | logger interface which handle all application logs,errors,warns, etc. |  `CoreLogger`|
| [adminViews](#AdminViews) | `{ [key: AdminViewSchema['name']]: AdminViewSchema['content'] }` | store admin views configs and rules which parse in `Nodeeweb Admin` | `{}`|
| [templates](#Templates) | `{ [key: string]: StoreTemplate }` | application templates store here with key of template type | `{}`|
| [routes](#Routes) | `{ [k: string]: StoreRoute }` | application routes which parse in `Nodeeweb Front` | `{}`|
| [strategies](#Strategies) | `Map<string, AuthStrategy>` | store `AuthStrategy` of application with key of id | `new Map()` |
| [plugins](#Plugins) | `PluginCore` | application plugins | `new PluginCore()` |
| [config](#Config) | `ConfigType` | application config which save on `./shared/config.json` | `CoreConfig` |
| [event](#Event) | `EventEmitter` | application event emitter | `new EventEmitter()` |
| [fixedHandlers](#FixedHandlers) | `any[]` | express fixed handlers | `[]` |
| [systemNotif](#SystemNotif) | `SystemNotif[]` | application system notification which alert admin after trigger | `[]` |