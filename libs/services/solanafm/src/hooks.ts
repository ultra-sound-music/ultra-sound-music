import { useRef } from 'react';
import { useQuery } from '@apollo/client';
import { BLOCKS } from './queries';

export function useGetBlocks() {
  const todayString = new Date().toISOString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString();

  // By using a ref object we avoid an infinit loop that results from the date always changing
  const yesterdayRef = useRef(yesterdayString);
  const todayRef = useRef(todayString);

  return useQuery(BLOCKS, {
    variables: { from: yesterdayRef.current, to: todayRef.current }
  });
}
