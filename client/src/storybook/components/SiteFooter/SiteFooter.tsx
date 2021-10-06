import React from 'react';

import copy from '@copy';
import constants from '@constants';
import { Button } from '@uiComponents';

import styles from './SiteFooter.scss';

export const SiteFooter = (): JSX.Element => {
  return (
    <div className={styles.SiteFooter}>
      <div className={styles.content}>
        <div className={styles.Header}>{copy.join_the_community}</div>
        <div className={styles.text}>{copy.have_questions_join_discord}</div>
        <div className={styles.buttonRow}>
          {constants.socials.DISCORD_URL && (
            <Button
              type='primary'
              isWide={true}
              to={constants.socials.DISCORD_URL}
              isExternal={true}
            >
              Discord
            </Button>
          )}
          {constants.socials.TWITTER_URL && (
            <Button
              type='primary'
              isWide={true}
              to={constants.socials.TWITTER_URL}
              isExternal={true}
            >
              Twitter
            </Button>
          )}
          {constants.socials.OPEN_SEA_URL && (
            <Button
              type='primary'
              isWide={true}
              to={constants.socials.OPEN_SEA_URL}
              isExternal={true}
            >
              OpenSea
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteFooter;
