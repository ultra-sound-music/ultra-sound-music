import { CustomError } from 'ts-custom-error';

import environmentConfigs from './environment';

export type ConfigKey = keyof typeof environmentConfigs;

export class ConfigError extends CustomError {
  public constructor(public configKey: ConfigKey, message?: string) {
    const msg = message ? `${message} ("${configKey}")` : configKey;
    super(msg);
  }
}

export class MissingConfigError extends ConfigError {
  public constructor(configKey: ConfigKey) {
    super(configKey, 'Missing required config');
  }
}

export class InvalidConfigError extends ConfigError {
  public constructor(configKey: ConfigKey) {
    super(configKey, 'Invalid config');
  }
}
