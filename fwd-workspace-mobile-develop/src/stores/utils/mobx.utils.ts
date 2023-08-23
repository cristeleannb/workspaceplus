import AsyncStorage from '@react-native-async-storage/async-storage';
import {makePersistable, PersistStoreMap} from 'mobx-persist-store';

export const persistStore = async <
  T extends Record<string, any>,
  P extends keyof T,
>(
  target: T,
  properties: P[],
  persistName: string,
) => {
  if (
    !Array.from(PersistStoreMap.values())
      .map(item => item.storageName)
      .includes(persistName)
  ) {
    await makePersistable(target, {
      name: persistName,
      properties: properties as string[],
      storage: AsyncStorage,
    });
  }
};
