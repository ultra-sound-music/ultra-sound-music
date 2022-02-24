import React from 'react';
import {
  atom,
  selector,
  DefaultValue,
  useResetRecoilState,
  useSetRecoilState,
  useRecoilState
} from 'recoil';

export interface IModalState {
  isVisible?: boolean;
  title?: React.ReactNode;
  body?: React.ReactNode;
  cta?: React.ReactNode;
}

export const isModalVisibleState = atom({
  key: 'isModalVisibleState',
  default: false
});

export const modalTitleState = atom<IModalState['title']>({
  key: 'modalTitleState',
  default: ''
});

export const modalBodyState = atom<IModalState['body']>({
  key: 'modalBodyState',
  default: ''
});

export const modalCtaState = atom<IModalState['cta']>({
  key: 'modalCtaState',
  default: ''
});

export const modal = selector<IModalState>({
  key: 'modal',
  get: ({ get }) => ({
    isVisible: get(isModalVisibleState),
    title: get(modalTitleState),
    body: get(modalBodyState),
    cta: get(modalCtaState)
  }),
  set: ({ set, reset }, newState) => {
    if (newState instanceof DefaultValue) {
      reset(isModalVisibleState);
      reset(modalTitleState);
      reset(modalBodyState);
      reset(modalCtaState);
      return;
    }

    set(isModalVisibleState, true);
    set(modalTitleState, newState?.title);
    set(modalBodyState, newState?.body);
    set(modalCtaState, newState?.cta);
  }
});

export function useHideModal() {
  return useResetRecoilState(modal);
}

export function useShowModal() {
  return useSetRecoilState(modal);
}

export function useModal() {
  const isModalVisible = useRecoilState(isModalVisibleState);
  const showModal = useSetRecoilState(modal);
  const hideModal = useResetRecoilState(modal);

  return {
    showModal,
    hideModal,
    isModalVisible
  };
}
