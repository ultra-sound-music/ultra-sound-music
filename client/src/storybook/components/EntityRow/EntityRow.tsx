import React from 'react';
import copy from '../../../copy';

import { Avatar } from '../../components';

import styles from './EntityRow.scss';

export interface IEntityRowProps {
  imageSrc: string;
  line1: string;
  line2?: string;
  doShowActiveLabel?: boolean;
  onClick?: () => void;
}

export const EntityRow = ({
  imageSrc,
  line1,
  line2,
  doShowActiveLabel = false,
  onClick
}: IEntityRowProps): JSX.Element => {
  return (
    <div className={styles.EntityRow} onClick={onClick}>
      {imageSrc && (
        <div>
          <Avatar src={imageSrc} />
        </div>
      )}
      <div className={styles.content}>
        {line1 && <div>{line1}</div>}
        {line2 && <div>{line2}</div>}
        {doShowActiveLabel && <div className={styles.label}>{copy.active}</div>}
      </div>
    </div>
  );
};

export default EntityRow;
