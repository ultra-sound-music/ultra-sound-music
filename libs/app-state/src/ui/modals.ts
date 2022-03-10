import React, { ReactNode, useMemo } from 'react';
import {
  atom,
  selector,
  useResetRecoilState,
  useSetRecoilState,
  useRecoilValue,
  DefaultValue
} from 'recoil';

// The circular dependency from ui -> app-state needs to be removed before we can use this
// import { IModalProps, IBidModalProps } from '@usm/ui';

type IModalType = 'base' | 'bidModal';

interface IModalCoreProps {
  type: IModalType;
}

interface IModalBaseProps {
  subject?: React.ReactNode;
  title?: React.ReactNode;
  shouldCloseOnEscape?: boolean;
  withCloseX?: boolean;
  withCloseButton?: boolean;
  isOpen: boolean;
  ctaButton?: React.ReactNode;
  body?: React.ReactNode;
  onHide?: () => void;
  children?: React.ReactNode;
}

interface IBidModalProps {
  isOpen: boolean;
  title: React.ReactNode;
  body: ReactNode;
  fieldImage: string;
  fieldValue: ReactNode;
  fieldContext: ReactNode;
}

type IModalProps = Omit<
  IModalCoreProps & (IModalBaseProps | IBidModalProps),
  'children' | 'onHide'
>;
type IModalState = Partial<IModalProps>;

export const modalProps = atom<IModalState>({
  key: 'modalState',
  default: {
    type: 'base',
    isOpen: false
  }
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
