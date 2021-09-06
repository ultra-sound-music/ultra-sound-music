import React from 'react';
import TestA from './TestA';

const arrOfObj = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
];

export const Layout = () => {
  return (
    <div className='Layout'>
      <TestA arr={arrOfObj} />
    </div>
  );
};

export default Layout;
