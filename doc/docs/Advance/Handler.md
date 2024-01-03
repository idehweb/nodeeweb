---
sidebar_position: 6
---

# Handler
Nodeeweb provide some functions which communicate with store and it is a best practice that other modules not modify **store** object by itself

## Auth
- **AuthUserAccess**: built-in controller access that check authentication regardless model name 
- **OptUserAccess**: built-in controller access that optional authentication
- **AdminAccess**: built-in controller access that allow only admin role
- **signToken**: sign jwt token
- **verifyToken**: verify jwt token
- **tokenSetToCookie**: received signed token and set it auth key cookie in response
- **clearTokenCookie**: clear all auth token cookie
- **registerAuthStrategy**: register auth strategy into **store**
- **unregisterAuthStrategy**: unregister auth strategy from **store**
- **extractToken**: extract token first from header, then from cookie

## Config
- **registerConfig**: register config into **store**

## Controller
- **controllerRegister**: convert schema into express middleware, register into **store.app**
- **controllersBatchRegister**: register batch of schemas (use **controllerRegister** inside)

## Entity
- **getEntityEventName**: convert entity name into related crud events
- **EntityCreator**: concrete class of Entity cruds
- **normalizeCrudOpt**: merge options with default one
- **registerEntityCRUD**: get crud opt and controller opt then create controller schema base on and register it with controller register

## Error
- **errorHandlerRegister**: register global error handlers, by default register *not-found* and *un-catch* error handlers

## Event
- **registerEvent**: register observer into event emitter

## Log
- **Logger**: Nodeeweb concrete logger
- **createLogger**: factory method of Logger
- **expressLogger**: an instance of Logger which designed for express requests ( use morgan in underwood )

## Plugin
- **getPluginEventName**: convert plugin type into event name
- **handlePlugin**: read plugins from local storage
- **registerPlugin**: register plugin into **store**
- **unregisterPlugin**: unregister plugin from **store**

## Single Job
- **SingleJobProcess**: grantee that **single** Nodeeweb instance processor run this job
- **waitForLockFiles**: return a promise that resolve when all single job process done
- **clearAllLockFiles**: clear all locks that created by single job

## Supervisor
## System Notification
- **registerSystemNotif**: register received system notification into **store**
- **unregisterSystemNotif**: unregister received system notification into **store**


## Upload
- **uploadSingle**: return collection of middlewares which handle upload request (use multer underwood)

## Validate
## View
- **registerTemplate**: register *StoreTemplate* object into **store**
- **unregisterTemplate**: unregister *StoreTemplate* object form **store**
- **registerRoute**: register *StoreRoute* object into **store**
- **unregisterRoute**: unregister *StoreRoute* object from **store**
> templates and routes are served on */config/website* API gateway