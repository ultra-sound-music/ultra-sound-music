import { mkdirSync, writeFileSync } from 'node:fs';
import * as nconf from 'nconf';
import nconfYaml from 'nconf-yaml';
import { camelCase } from 'change-case';

import { GenConfigsExecutorSchema } from './schema';

const defaultApp = 'c8web';
const allowlistedEnvKeys = ['C8_CONFIGS'];

export type ExecutorContext = {};

export default async function runExecutor(options: GenConfigsExecutorSchema) {
  console.log('Executor ran for Echo', options);
  return {
    success: true
  };
}

export async function generateConfigsPlugin(
  { buildMode, app }: GenConfigsExecutorSchema,
  context: ExecutorContext
) {
  const sourceRoot = `apps/${app}/configs`;
  const destination = `libs/${app}/configs/src/configs.json`;
  console.info(`Reading configs from ${sourceRoot}`);

  nconf.env({
    transform({ key, value }: { key: string; value: string }) {
      if (allowlistedEnvKeys.includes(key)) {
        const isJsonString = value.trim().startsWith('{') && value.endsWith('}');
        if (isJsonString) {
          nconf.overrides(JSON.parse(value));
          return false;
        }

        const camelCaseKey = camelCase(key);
        return {
          key: camelCaseKey,
          value
        };
      }

      return false;
    }
  });

  const configs = [
    `${sourceRoot}/base/${buildMode}-user.yaml`,
    `${sourceRoot}/defaults-user.yaml`,
    `${sourceRoot}/base/${buildMode}.yaml`,
    `${sourceRoot}/defaults.yaml`
  ].reduce((current, configFile) => {
    const configName = configFile;
    if (!configFile) {
      return current;
    }

    return current.file(configName, {
      file: configFile,
      format: nconfYaml
    });
  }, nconf);

  const content = JSON.stringify(configs.get());
  const destinationDir = destination.split('/').slice(0, -1).join('/');

  console.info(`Writing ${buildMode} configs to ${destination}`);
  mkdirSync(destinationDir, { recursive: true });
  writeFileSync(destination, content);

  return { success: true };
}
