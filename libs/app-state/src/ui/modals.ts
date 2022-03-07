import React, { useMemo } from 'react';
import {
  atom,
  selector,
  useResetRecoilState,
  useSetRecoilState,
  useRecoilValue,
  DefaultValue
} from 'recoil';

interface IModalProps {
  subject?: React.ReactNode;
  title?: React.ReactNode;
  shouldCloseOnEscape?: boolean;
  withCloseX?: boolean;
  withCloseButton?: boolean;
  isOpen: boolean;
  ctaButton?: React.ReactNode;
  onHide?: () => void;
  children?: React.ReactNode;
}

export interface IModalState extends Omit<IModalProps, 'children' | 'isOpen'> {
  body?: React.ReactNode;
  isOpen?: boolean;
}

export const modalProps = atom<IModalState>({
  key: 'modalState',
  default: { isOpen: false }
});

export const isModalOpenState = selector({
  key: 'isModalOpenState',
  get: ({ get }) => get(modalProps)?.isOpen
});

// The Selector allows us to wrap the modalProps object with a setter function
export const modalState = selector<IModalState>({
  key: 'modal',
  get: ({ get }) => get(modalProps),
  set: ({ set, reset }, newState) => {
    if (newState instanceof DefaultValue) {
      reset(modalProps);
      return;
    }

    newState.isOpen = true;
    set(modalProps, newState);
  }
});

export function useHideModal() {
  return useResetRecoilState(modalState);
}

export function useShowModal() {
  return useSetRecoilState(modalState);
}

export function useModal() {
  const showModal = useSetRecoilState(modalState);
  const hideModal = useResetRecoilState(modalState);
  const isModalOpen = useRecoilValue(isModalOpenState);

  return useMemo(
    () => ({
      showModal,
      hideModal,
      isModalOpen
    }),
    [modalState, isModalOpenState]
  );
}
