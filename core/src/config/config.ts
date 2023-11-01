import fs from 'fs';
import { SingleJobProcess } from '../handlers/singleJob.handler';
import { getEnv, isExistsSync } from '../../utils/helpers';
import { getSharedPath } from '../../utils/path';
import { CoreConfigDto } from '../../dto/config';
import { plainToInstance } from 'class-transformer';
import _ from 'lodash';
import restart from '../../utils/restart';
import store from '../../store';
import {
  DEFAULT_REQ_LIMIT,
  DEFAULT_REQ_WINDOW_LIMIT,
} from '../constants/limit';
import { DEFAULT_SMS_ON_OTP } from '../constants/String';
import { validateSync } from 'class-validator';
import { registerConfig } from '../handlers/config.handler';
import logger from '../handlers/log.handler';
import { USE_ENV } from '../../types/global';
import { ConfigChangeOpt } from '../../types/config';
import { detectVE } from '../../utils/validation';

export abstract class Config<C extends CoreConfigDto> {
  private __config: C;
  constructor() {
    this._readAndCreate();
    Object.freeze(this.__config);
    return new Proxy(this, {
      get(target, p) {
        if (
          String(p).startsWith('_') ||
          ['change', 'toString', 'toJSON', 'toObject', 'getPublic'].includes(
            String(p)
          )
        )
          return target[p];
        return target._config[p];
      },
    });
  }

  protected abstract _transform(value: any): C;
  protected _validate(value: any): void {
    const errors = validateSync(value, {
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      whitelist: store.env.USE_ENV !== USE_ENV.NPM,
    });
    if (errors.length)
      throw new Error(
        `config validation failed:\n${Object.entries(detectVE(errors))
          .map(([k, v]) => `${k}: ${v}`)
          .join(' , ')}`
      );
    return;
  }
  protected abstract get _defaultSetting(): C;

  protected get _path() {
    return getSharedPath('config.json');
  }
  protected get _config(): C {
    return this.__config;
  }
  protected set _config(value: any) {
    const newConf = this._transform(value);
    this._validate(newConf);
    this.__config = newConf;
  }
  private _merge(newConf: any) {
    const mergedValue = {};
    _.merge(mergedValue, this._config, JSON.parse(JSON.stringify(newConf)));
    this._config = mergedValue;
  }
  private _readAndCreate() {
    this._config = this._defaultSetting;

    // read conf file
    const isConfFileExist = isExistsSync(this._path);

    // create if not exits
    if (!isConfFileExist) {
      SingleJobProcess.builderAsync('create-config', () => {
        this._write();
      })().then();
      return;
    }

    // _merge and write
    this._merge(JSON.parse(fs.readFileSync(this._path, 'utf-8')));
    SingleJobProcess.builderAsync('write-config', () => {
      this._write();
    })().then();
  }
  private _write(config = this._config) {
    fs.writeFileSync(this._path, JSON.stringify(config, null, '  '), 'utf-8');
  }
  public async change(
    newConfig: any,
    { merge, restart: rst, external_wait, internal_wait }: ConfigChangeOpt = {}
  ) {
    // set or merge
    if (!merge) this._config = newConfig;
    else this._merge(newConfig);

    // write
    this._write();

    // restart
    if (rst) await restart({ external_wait, internal_wait });
  }
  public toString() {
    return JSON.stringify(this._config);
  }
  public toJSON() {
    return this._config;
  }
  public toObject() {
    return this._config;
  }
  public abstract getPublic(): Partial<C>;
}

class CoreConfig extends Config<CoreConfigDto> {
  protected _transform(value: any): CoreConfigDto {
    return plainToInstance(CoreConfigDto, value, {
      enableImplicitConversion: true,
    });
  }
  protected get _defaultSetting(): CoreConfigDto {
    return {
      app_name: store.env.APP_NAME ?? 'Nodeeweb Core',
      host: getEnv('server-host', { format: 'string' }) as string,
      auth: {},
      supervisor:
        store.env.SUPERVISOR_URL && store.env.SUPERVISOR_TOKEN
          ? {
              url: store.env.SUPERVISOR_URL,
              token: store.env.SUPERVISOR_TOKEN,
              whitelist:
                (getEnv('supervisor-whitelist', { format: 'array' }) as any) ??
                [],
            }
          : undefined,
      limit: {
        request_limit: DEFAULT_REQ_LIMIT,
        request_limit_window_s: DEFAULT_REQ_WINDOW_LIMIT,
      },
      sms_message_on: {
        otp: DEFAULT_SMS_ON_OTP,
      },
    };
  }

  protected _filterAuth() {
    const auth = this._config.auth ?? {};
    const fAuth = {};

    // remove secret,pass,key
    Object.keys(auth).forEach((provider) => {
      fAuth[provider] = {};

      Object.keys(auth[provider]).forEach((k) => {
        if (k.includes('secret') || k.includes('pass') || k.includes('key'))
          return;
        fAuth[provider][k] = auth[provider][k];
      });
    });

    return fAuth;
  }

  public getPublic(): Partial<CoreConfigDto> {
    return {
      app_name: this._config.app_name,
      host: this._config.host,
      auth: this._filterAuth(),
    };
  }
}

export function registerDefaultConfig() {
  registerConfig(new CoreConfig(), { from: 'CoreConfig', logger });
}
