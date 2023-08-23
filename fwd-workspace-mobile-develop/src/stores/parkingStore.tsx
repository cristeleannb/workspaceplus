import {action, observable, makeAutoObservable} from 'mobx';
import {ParkingDates} from '@/types';
import {ParkingPenaltyResponse} from '@/services/api/api.service';

import {StoreKeys} from './config';
import {persistStore} from './utils';

export class ParkingStore {
  parkingDates: ParkingDates[] = [];
  parkingPenaltyData: ParkingPenaltyResponse | null = null;

  constructor() {
    makeAutoObservable(this, {
      parkingDates: observable,
      setParkingDates: action,
    });

    persistStore(this, ['parkingPenaltyData'], StoreKeys.PARKING_PENALTY_DATA);
  }

  setParkingDates(newParkingDates: ParkingDates[]) {
    this.parkingDates = newParkingDates;
  }

  setParkingPenaltyData(penalty: ParkingPenaltyResponse | null) {
    this.parkingPenaltyData = penalty;
  }
}
