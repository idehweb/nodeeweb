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
import { DEFAULT_META_DESC, DEFAULT_SMS_ON_OTP } from '../constants/String';
import { validateSync } from 'class-validator';
import { registerConfig } from '../handlers/config.handler';
import logger from '../handlers/log.handler';
import { USE_ENV } from '../../types/global';
import { ConfigChangeOpt } from '../../types/config';
import { detectVE } from '../../utils/validation';
import {
  DEFAULT_COLOR_BACKGROUND,
  DEFAULT_COLOR_FOOTER_BACKGROUND,
  DEFAULT_COLOR_PRIMARY,
  DEFAULT_COLOR_SECONDARY,
  DEFAULT_COLOR_TEXT,
} from '../constants/color';

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
    _.mergeWith(
      mergedValue,
      this._config,
      JSON.parse(JSON.stringify(newConf)),
      (value, srcValue) => {
        if (Array.isArray(value) && Array.isArray(srcValue)) return srcValue;
      }
    );
    // console.log('new config', JSON.parse(JSON.stringify(newConf)).auth);
    // console.log('old config', this._config['auth']);
    // console.log('merge config', mergedValue['auth']);
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
    // rewrite favicon base on first dist in favicons
    if (Array.isArray(value.favicons)) value.favicon = value.favicons[0]?.dist;

    return plainToInstance(CoreConfigDto, value, {
      enableImplicitConversion: true,
    });
  }
  protected get _defaultSetting(): CoreConfigDto {
    const app_name = getEnv<string>('app-name', { format: 'string' });
    const nodeewebApiUrl = getEnv<string>('nodeewebhub_api_base_url', {
      format: 'string',
    });
    const host =
      getEnv<string>('server-host', { format: 'string' }) ||
      getEnv<string>('base-url', { format: 'string' });
    const supervisor_url = getEnv<string>('supervisor-url', {
      format: 'string',
    });
    const supervisor_token = getEnv<string>('supervisor-token', {
      format: 'string',
    });
    const supervisor_whitelist = getEnv<string[]>('supervisor-whitelist', {
      format: 'array',
    });

    return {
      app_name: app_name ?? 'Nodeeweb Core',
      meta_title: app_name ?? 'Nodeeweb Core',
      meta_description: DEFAULT_META_DESC,
      host,
      auth: {
        ...(nodeewebApiUrl
          ? {
              nodeeweb: {
                api_url: nodeewebApiUrl,
              },
            }
          : {}),
      },
      supervisor:
        supervisor_token && supervisor_url
          ? {
              url: supervisor_url,
              token: supervisor_token,
              whitelist: supervisor_whitelist ?? [],
            }
          : undefined,
      limit: {
        request_limit: DEFAULT_REQ_LIMIT,
        request_limit_window_s: DEFAULT_REQ_WINDOW_LIMIT,
      },
      sms_message_on: {
        otp: DEFAULT_SMS_ON_OTP,
      },

      color: {
        primary: DEFAULT_COLOR_PRIMARY,
        secondary: DEFAULT_COLOR_SECONDARY,
        background: DEFAULT_COLOR_BACKGROUND,
        footerBackground: DEFAULT_COLOR_FOOTER_BACKGROUND,
        text: DEFAULT_COLOR_TEXT,
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
      favicon: this._config.favicons[0]?.dist,
      color: this._config.color,
    };
  }
}

export function registerDefaultConfig() {
  registerConfig(new CoreConfig(), { from: 'CoreConfig', logger });
}
