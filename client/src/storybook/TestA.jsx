/* eslint-disable */

import React from 'react';
import styles from './TestA.scss';

function TestA(props) {
  const cells = props.arr.map((obj, i) => {
    return (
      <div
        key={i}
        style={{
          backgroundColor: `${'#' + Math.random().toString(16).substr(-6)}`
        }}
        className={styles.item}
      >
        {obj}
      </div>
    );
  });

  return <div className={styles.TestA}>{cells}</div>;
}

export default TestA;
