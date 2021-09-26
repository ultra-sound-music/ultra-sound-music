import React from 'react';

import copy from '../../../copy';

import { Button } from '../../components';
import styles from './SiteFooter.scss';

export const SiteFooter = (): JSX.Element => {
  return (
    <div className={styles.SiteFooter}>
      <div className={styles.Header}>{copy.join_the_community}</div>
      <div className={styles.text}>{copy.have_questions_join_discord}</div>
      <div className={styles.buttonRow}>
        <Button type='primary' isWide={true} to='TODO'>
          Discord
        </Button>
        <Button type='primary' isWide={true} to='TODO'>
          Twitter
        </Button>
        <Button type='primary' isWide={true} to='TODO'>
          OpenSea
        </Button>
      </div>
    </div>
  );
};

export default SiteFooter;
