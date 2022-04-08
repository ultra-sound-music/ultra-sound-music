import { useEffect } from 'react';
import logger from '@usm/util-logger';
import { initArweave } from './registry';

export interface ArweaveInitializerArgs {
  logo?: string;
}

export default function ({ logo }: ArweaveInitializerArgs) {
  useEffect(() => {
    try {
      initArweave(logo);
    } catch (error) {
      logger.error(error);
    }
  }, []);
}
