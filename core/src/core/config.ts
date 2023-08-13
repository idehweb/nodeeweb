import fs from 'fs';
import { SingleJobProcess } from '../handlers/singleJob.handler';
import { isExist, isExistsSync } from '../../utils/helpers';
import { getSharedPath } from '../../utils/path';
import { CoreConfigBody, CoreConfigDto } from '../../dto/config';
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
import { MiddleWare, Req } from '../../types/global';
import { GeneralError } from '../../types/error';
import { ConfigChangeOpt } from '../../types/config';

export class Config<C extends CoreConfigDto> {
  private __config: C;

  protected _transform(value: any): C {
    return plainToInstance(CoreConfigDto, value, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    }) as C;
  }
  protected _validate(value: any): void {
    const errors = validateSync(value);
    if (errors.length)
      throw new Error(
        `config validation failed:\n${errors
          .map((e) => e.toString())
          .join(' , ')}`
      );
    return;
  }
  protected get _defaultSetting(): C {
    return {
      app_name: store.env.APP_NAME ?? 'Nodeeweb Core',
      auth: {},
      limit: {
        request_limit: DEFAULT_REQ_LIMIT,
        request_limit_window_s: DEFAULT_REQ_WINDOW_LIMIT,
      },
      plugin: {},
      sms_message_on: {
        otp: DEFAULT_SMS_ON_OTP,
      },
    } as C;
  }
  private get _path() {
    return getSharedPath('config.json');
  }
  private get _config(): C {
    return this.__config;
  }
  private set _config(value: any) {
    const newConf = this._transform(value);
    this._validate(value);
    this.__config = newConf;
  }
  private _merge(newConf: any) {
    this._config = _.merge(this._config, newConf);
  }
  constructor() {
    this._readAndCreate();
    Object.freeze(this.__config);
    return new Proxy(this, {
      get(target, p) {
        if (
          String(p).startsWith('_') ||
          ['change', 'toString', 'toJSON'].includes(String(p))
        )
          return target[p];
        return target._config[p];
      },
    });
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

  public async toString() {
    return JSON.stringify(this._config);
  }
  public async toJSON() {
    return JSON.stringify(this._config);
  }
}

class ConfigService {
  get: MiddleWare = async (req, res) => {
    return res.json({ data: store.config });
  };

  update: MiddleWare = async (req, res) => {
    const body: CoreConfigBody = req.body;
    if (!store.config) throw new GeneralError('config not resister yet!', 500);

    await store.config.change(body.config, {
      merge: true,
      restart: body.restart ?? true,
      external_wait: true,
      internal_wait: false,
    });

    return res.status(200).json({ data: store.config });
  };
}

export const configService = new ConfigService();

export function registerDefaultConfig() {
  registerConfig(new Config(), { from: 'CoreConfig', logger });
}
