import React, { ReactNode, useMemo } from 'react';
import {
  atom,
  selector,
  useResetRecoilState,
  useSetRecoilState,
  useRecoilValue,
  DefaultValue
} from 'recoil';

// Resolve buildable not being able to import from buildable
// import { IModalProps, IBidModalProps } from '@usm/ui';

type IModalType = 'base' | 'bidModal' | 'connectModal' | 'disconnectModal';

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

interface IConnectModalProps {
  isOpen: boolean;
  onConnect(): void;
}

interface IDisconnectModalProps {
  isOpen: boolean;
  onDisconnect(): void;
}

type IModalProps = Omit<IModalCoreProps & IModalBaseProps, 'children' | 'onHide'> &
  IBidModalProps &
  IConnectModalProps &
  IDisconnectModalProps;
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
