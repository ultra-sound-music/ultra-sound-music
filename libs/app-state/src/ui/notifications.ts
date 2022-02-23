import React from 'react';
import {
  atom,
  selector,
  DefaultValue,
  useResetRecoilState,
  useSetRecoilState,
  useRecoilState
} from 'recoil';

export interface INotificationState {
  isVisible?: boolean;
  message?: React.ReactNode;
  type?: 'info' | 'success' | 'error' | 'warn';
}

export const isNotificationVisibleState = atom({
  key: 'isNotificationVisibleState',
  default: false
});

export const notificationMessageState = atom<INotificationState['message']>({
  key: 'notificationMessageState',
  default: ''
});

export const notificationTypeState = atom<INotificationState['type']>({
  key: 'notificationTypeState',
  default: 'info'
});

export const notification = selector<INotificationState>({
  key: 'notification',
  get: ({ get }) => ({
    isVisible: get(isNotificationVisibleState),
    message: get(notificationMessageState),
    type: get(notificationTypeState)
  }),
  set: ({ set, reset }, newState) => {
    if (newState instanceof DefaultValue) {
      reset(isNotificationVisibleState);
      reset(notificationMessageState);
      reset(notificationTypeState);
      return;
    }

    set(isNotificationVisibleState, true);
    set(notificationMessageState, newState?.message);
    set(notificationTypeState, newState?.type);
  }
});

export function useNotification() {
  const isModalVisible = useRecoilState(isNotificationVisibleState);
  const showModal = useSetRecoilState(notification);
  const hideModal = useResetRecoilState(notification);

  return {
    showModal,
    hideModal,
    isModalVisible
  };
}
