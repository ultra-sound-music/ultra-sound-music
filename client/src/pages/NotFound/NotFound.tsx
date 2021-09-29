import React from 'react';
import { FullLayout } from '@layouts';
import { SiteFooter } from '@uiComponents';

import styles from './NotFound.scss';

export const NotFound = (): JSX.Element => {
  return (
    <>
      <FullLayout>
        <div className={styles.content}>
          404 - The resource you are looking for does not exist
        </div>
      </FullLayout>
      <SiteFooter />
    </>
  );
};
export default NotFound;
