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
  timeout?: number;
  type?: 'info' | 'success' | 'error' | 'warn' | 'processing';
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

export const notificationTimeoutState = atom<INotificationState['timeout']>({
  key: 'notificationTimeoutState',
  default: undefined
});

export const notification = selector<INotificationState>({
  key: 'notification',
  get: ({ get }) => ({
    isVisible: get(isNotificationVisibleState),
    message: get(notificationMessageState),
    type: get(notificationTypeState),
    timeout: get(notificationTimeoutState)
  }),
  set: ({ set, reset }, newState) => {
    if (newState instanceof DefaultValue) {
      reset(isNotificationVisibleState);
      reset(notificationMessageState);
      reset(notificationTypeState);
      reset(notificationTimeoutState);
      return;
    }

    set(isNotificationVisibleState, true);
    set(notificationMessageState, newState?.message);
    set(notificationTypeState, newState?.type);
    set(notificationTimeoutState, newState?.timeout);
  }
});

export function useNotification() {
  const isNotificationVisible = useRecoilState(isNotificationVisibleState);
  const showNotification = useSetRecoilState(notification);
  const hideNotification = useResetRecoilState(notification);

  return {
    showNotification,
    hideNotification,
    isNotificationVisible
  };
}
