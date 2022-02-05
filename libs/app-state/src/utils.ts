import { AtomEffect, DefaultValue } from 'recoil';

import db from '@usm/util-web-storage';

export type ILocalStorageEffect = <T>(key: string) => AtomEffect<T>;

export const localStorageAsyncEffect: ILocalStorageEffect =
  (key: string) =>
  ({ setSelf, onSet, trigger }) => {
    // If there's a persisted value - set it on load
    const loadPersisted = async () => {
      const savedValue = await db.get(key);

      if (savedValue) {
        setSelf(JSON.parse(savedValue));
      }
    };

    // Asynchronously set the persisted data
    if (trigger === 'get') {
      loadPersisted();
    }

    // Subscribe to state changes and persist them to localForage
    onSet((newValue, _, isReset) => {
      isReset ? db.del(key) : db.set(key, JSON.stringify(newValue));
    });
  };

export const localStorageEffect: ILocalStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }) => {
    setSelf(
      db.get(key).then((val) => (val ? JSON.parse(val) : new DefaultValue()))
    );

    // Subscribe to state changes and persist them to localForage
    onSet((newValue, _, isReset) => {
      isReset ? db.del(key) : db.set(key, JSON.stringify(newValue));
    });
  };
