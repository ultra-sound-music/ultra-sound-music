import React from 'react';
import {
  atom,
  selector,
  DefaultValue,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
  useRecoilState
} from 'recoil';

export interface INotificationState {
  isVisible?: boolean;
  title?: string;
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

export const notificationTitleState = atom<INotificationState['title']>({
  key: 'notificationTitleState',
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

export const notificationState = selector<INotificationState>({
  key: 'notificationState',
  get: ({ get }) => ({
    isVisible: get(isNotificationVisibleState),
    title: get(notificationTitleState),
    message: get(notificationMessageState),
    type: get(notificationTypeState),
    timeout: get(notificationTimeoutState)
  }),
  set: ({ set, reset }, newState) => {
    if (newState instanceof DefaultValue) {
      reset(isNotificationVisibleState);
      reset(notificationMessageState);
      reset(notificationTitleState);
      reset(notificationTypeState);
      reset(notificationTimeoutState);
      return;
    }

    set(isNotificationVisibleState, true);
    set(notificationTitleState, newState?.title);
    set(notificationMessageState, newState?.message);
    set(notificationTypeState, newState?.type);
    set(notificationTimeoutState, newState?.timeout);
  }
});

export function useGetNotificationState() {
  return useRecoilValue(notificationState);
}

export function useHideNotification() {
  return useResetRecoilState(notificationState);
}

export function useShowNotification() {
  return useSetRecoilState(notificationState);
}

export function useNotification() {
  const isNotificationVisible = useRecoilState(isNotificationVisibleState);
  const showNotification = useSetRecoilState(notificationState);
  const hideNotification = useResetRecoilState(notificationState);

  return {
    showNotification,
    hideNotification,
    isNotificationVisible
  };
}
