import React from 'react';
import copy from '../../../copy';
import cn from 'classnames';

import { Avatar } from '../../components';

import styles from './EntityRow.scss';

export type TEntityRowSize = 'tiny' | 'small' | 'medium' | 'large';

export interface IEntityRowProps {
  imageSrc: string;
  line1: string;
  line2?: string;
  doShowActiveLabel?: boolean;
  size?: TEntityRowSize;
  onClick?: () => void;
}

export const EntityRow = ({
  imageSrc,
  line1,
  doShowActiveLabel = false,
  size = 'small',
  onClick
}: IEntityRowProps): JSX.Element => {
  const classNames = cn(styles.EntityRow, styles[size]);

  return (
    <div className={classNames} onClick={onClick}>
      {imageSrc && (
        <div>
          <Avatar src={imageSrc} size={size} />
        </div>
      )}
      <div className={styles.content}>
        {line1 && <div className={styles.label}>{line1}</div>}
        {doShowActiveLabel && <div className={styles.label}>{copy.active}</div>}
      </div>
    </div>
  );
};

export default EntityRow;
