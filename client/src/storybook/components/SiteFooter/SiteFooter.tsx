import React from 'react';

import copy from '@copy';
import constants from '@constants';
import { Button } from '@uiComponents';

import styles from './SiteFooter.scss';

export const SiteFooter = (): JSX.Element => {
  return (
    <div className={styles.SiteFooter}>
      <div className={styles.Header}>{copy.join_the_community}</div>
      <div className={styles.text}>{copy.have_questions_join_discord}</div>
      <div className={styles.buttonRow}>
        {constants.DISCORD_URL && (
          <Button type='primary' isWide={true} to={constants.DISCORD_URL}>
            Discord
          </Button>
        )}
        {constants.TWITTER_URL && (
          <Button type='primary' isWide={true} to={constants.TWITTER_URL}>
            Twitter
          </Button>
        )}
        {constants.OPEN_SEA_URL && (
          <Button type='primary' isWide={true} to={constants.OPEN_SEA_URL}>
            OpenSea
          </Button>
        )}
      </div>
    </div>
  );
};

export default SiteFooter;
