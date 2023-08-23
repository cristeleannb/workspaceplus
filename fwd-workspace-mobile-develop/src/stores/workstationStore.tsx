import {action, observable, makeAutoObservable} from 'mobx';
import {WorkDates} from '@/types';
import {WorkstationPenaltyResponse} from '@/services/api/api.service';

import {StoreKeys} from './config';
import {persistStore} from './utils';

export class WorkstationStore {
  workDates: WorkDates[] = [];
  defaultBranchCityId: number | undefined = undefined;
  penaltyData: WorkstationPenaltyResponse | null = null;

  constructor() {
    makeAutoObservable(this, {
      workDates: observable,
      defaultBranchCityId: observable,
      setWorkdates: action,
      setDefaultBranchCityId: action,
    });

    persistStore(
      this,
      ['defaultBranchCityId'],
      StoreKeys.WORKSTATION_DEFAULT_BRANCH_CITY_ID,
    );
    persistStore(this, ['penaltyData'], StoreKeys.PENALTY_DATA);
  }

  setWorkdates(newWorkDates: WorkDates[]) {
    this.workDates = newWorkDates;
  }

  setDefaultBranchCityId(branchCityId: number) {
    this.defaultBranchCityId = branchCityId;
  }

  setPenaltyData(penalty: WorkstationPenaltyResponse | null) {
    this.penaltyData = penalty;
  }
}
