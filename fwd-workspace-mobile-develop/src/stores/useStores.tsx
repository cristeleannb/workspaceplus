import React, {createContext, useContext} from 'react';
import {observer, useLocalObservable} from 'mobx-react';

import {AuthStore} from './authStore';
import {WorkTypeStore} from './workTypeStore';
import {AppSettingStore} from './appSettingStore';
import {WorkstationStore} from './workstationStore';
import {ParkingStore} from './parkingStore';

export type TStore = {
  authStore: AuthStore;
  workTypeStore: WorkTypeStore;
  appSettingStore: AppSettingStore;
  workstationStore: WorkstationStore;
  parkingStore: ParkingStore;
};

export const StoreContext = createContext<TStore | null>(null);

export const StoreProvider: React.FC = observer(({children}) => {
  const authStore = useLocalObservable(() => new AuthStore());
  const workTypeStore = useLocalObservable(() => new WorkTypeStore());
  const appSettingStore = useLocalObservable(() => new AppSettingStore());
  const workstationStore = useLocalObservable(() => new WorkstationStore());
  const parkingStore = useLocalObservable(() => new ParkingStore());

  const stores = {
    authStore,
    workTypeStore,
    appSettingStore,
    workstationStore,
    parkingStore,
  };

  return (
    <StoreContext.Provider value={stores}>{children}</StoreContext.Provider>
  );
});

export const useStores = () => {
  const _store = useContext(StoreContext);

  if (!_store) {
    throw new Error('You have forgotten to use StoreProvider.');
  }

  return _store;
};
