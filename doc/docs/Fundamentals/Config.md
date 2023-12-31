---
sidebar_position: 2
---

# Config
all system configs manage by this object, each instance must be implement `Config` abstraction class  and define a Config DTO that extends `CoreConfigDto`. configs generally read `./shared/config.json` file and transform them into object which we need and rase an exception if validation failed, after that merge configs with some default one and present them in two access way, public configs and whole configs

## Register
by default system use `CoreConfig` but we can register our custom config with `registerConfig` api
> :warning: **Warning: all system configs execute, transform and validate `config.json` file, so you must use some compatible chain dto**

## Access
configs can access from `store.config` and you can directly access config attributes ( we use a proxy in constructor ), and public configs access by `/config/website` api