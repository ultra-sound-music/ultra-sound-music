import React from 'react';
import {
  atom,
  selector,
  DefaultValue,
  useResetRecoilState,
  useSetRecoilState
} from 'recoil';

export interface IModalState {
  isVisible?: boolean;
  title?: React.ReactNode;
  body?: React.ReactNode;
  cta?: React.ReactNode;
}

export const isModalVisible = atom({
  key: 'isModalVisible',
  default: false
});

export const modalTitle = atom<IModalState['title']>({
  key: 'modalTitle',
  default: ''
});

export const modalBody = atom<IModalState['body']>({
  key: 'modalBody',
  default: ''
});

export const modalCta = atom<IModalState['cta']>({
  key: 'modalCta',
  default: ''
});

export const modal = selector<IModalState>({
  key: 'modal',
  get: ({ get }) => ({
    isVisible: get(isModalVisible),
    title: get(modalTitle),
    body: get(modalBody),
    cta: get(modalCta)
  }),
  set: ({ set, reset }, newState) => {
    if (newState instanceof DefaultValue) {
      reset(isModalVisible);
      reset(modalTitle);
      reset(modalBody);
      reset(modalCta);
      return;
    }

    set(isModalVisible, true);
    set(modalTitle, newState?.title);
    set(modalBody, newState?.body);
    set(modalCta, newState?.cta);
  }
});

export function useHideModal() {
  return useResetRecoilState(modal);
}

export function useShowModal() {
  return useSetRecoilState(modal);
}
