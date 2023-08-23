import {action, observable, makeAutoObservable, computed} from 'mobx';

import {ApplicationSettingModel} from '@/services/api/api.service';

import {StoreKeys} from './config';
import {persistStore} from './utils';

export class AppSettingStore {
  appSetting: ApplicationSettingModel = {};
  showWorkStationHelper = true;

  constructor() {
    makeAutoObservable(this, {
      appSetting: observable,
      showWorkStationHelper: observable,
      changeScheduleLimit: computed,
      transferParkingScheduleLimit: computed,
      setAppSetting: action,
      setShowWorkStationHelper: action,
    });

    persistStore(this, ['appSetting'], StoreKeys.APP_SETTING);
    persistStore(this, ['showWorkStationHelper'], StoreKeys.WORKSTATION_HELPER);
  }

  get changeScheduleLimit() {
    return (this.appSetting.changeApprovePlanSchedMinutes || 720) / 60;
  }

  get transferParkingScheduleLimit() {
    return (this.appSetting.changeParkingSlotMinutes || 720) / 60;
  }

  setAppSetting(newAppSetting: ApplicationSettingModel) {
    this.appSetting = newAppSetting;
  }

  setShowWorkStationHelper(show: boolean) {
    this.showWorkStationHelper = show;
  }
}
