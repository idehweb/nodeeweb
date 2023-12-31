---
sidebar_position: 4
---

# Plugin
nodeeweb allow plugins to access some resources and handle some functionality which you want, for achieve this purpose follow below steps

## Creation
each plugin contain these structure:
```bash
|   config.json
|   index.ts
|   type.ts
\---dto
        config.ts
        edit.ts
```

### Config.json
example:

```json
{
    "name": "Meli Payamak Service Line SMS",
    "version" : "1.0.0",
    "description": {
        "en": "for send sms with service line",
        "fa": "برای ارسال پیامک به وسیله خط خدماتی"
    },
    // plugin type
    "type" : "sms-gateway",

    "icon": "",
    "author": "Nodeeweb",
    
    // main module
    "main":"index",

    // must be unique
    "slug":"meli-payamak-service-line-sms",

    "config": {

        // inputs schema on config
        "inputs": [
            {
                "key": "username",
                "title": {
                    "en": "username",
                    "fa": "نام کاربری"
                },
                "type": "string",
                "description": {}
            },
            {
                "key": "password",
                "title": {
                    "en": "password",
                    "fa": "کلمه عبور"
                },
                "type": "string",
                "description": ""
            },
            {
                "key": "from",
                "title": {
                    "en": "service line",
                    "fa": "خط خدماتی"
                },
                "type": "string",
                "description": {}
            }
        ],
        // dto for validation and transform
        "dto":"dto/config",
        // execute config function in main module on config
        "run":"config"
    },
    "active":{  
        // dto for validation and transform
        "dto" :"dto/config",
        // execute config function in main module on activation
        "run":"active"
    },

    // input schema on edit
    "edit":{
        "inputs": [
            {
                "key": "username",
                "title": {
                    "en": "username",
                    "fa": "نام کاربری"
                },
                "type": "string",
                "description": {}
            },
            {
                "key": "password",
                "title": {
                    "en": "password",
                    "fa": "کلمه عبور"
                },
                "type": "string",
                "description": ""
            },
            {
                "key": "from",
                "title": {
                    "en": "service line",
                    "fa": "خط خدماتی"
                },
                "type": "string",
                "description": {}
            }
        ],
        // dto for validation and transform
        "dto":"dto/edit",
        // execute config function in main module on edition
        "run":"edit"
    }
}
```

## Install Plugin
admin can install plugin from plugin market APIs:
- system download plugin from hub ( or local ) and locate them into `./plugins`

after that if admin config plugin:
- save record to plugin collection with input args ( :warning:  even credentials )
- call `registerPlugin` that update `store.plugins`

## Plugin Types
system not allow to use multiple plugin types, every time you must active one plugin in same type, sms gateway plugins and bank gateway plugins automatically use in signup and transaction modules

## Plugin Context
```ts
 {
    logger:Logger,
    systemLogger: Logger,
    SimpleError:SimpleError,
    axiosError2String:(err:any) => string,
    getEnv: (key: string) => string ,
  }
```