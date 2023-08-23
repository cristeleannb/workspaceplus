import {action, observable, makeAutoObservable} from 'mobx';
import {WorkTypeModel} from '@/services/api/api.service';

import {StoreKeys} from './config';
import {persistStore} from './utils';

export class WorkTypeStore {
  workTypes: WorkTypeModel[] = [];

  constructor() {
    makeAutoObservable(this, {
      workTypes: observable,
      setWorkTypes: action,
    });

    persistStore(this, ['workTypes'], StoreKeys.WORK_TYPE_STORE);
  }

  setWorkTypes(newWorkTypes: WorkTypeModel[]) {
    this.workTypes = newWorkTypes;
  }
}
