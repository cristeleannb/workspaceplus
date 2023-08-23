import {action, computed, observable, makeAutoObservable} from 'mobx';
import {EmployeeUserModel} from '@/services/api/api.service';

import {StoreKeys} from './config';
import {persistStore} from './utils';
import {AccountRole} from '@/types';

export class AuthStore {
  token: string | null = null;
  user: EmployeeUserModel | null = null;
  executiveID: string | null = null;

  constructor() {
    makeAutoObservable(this, {
      token: observable,
      user: observable,
      executiveID: observable,
      setToken: action,
      setUser: action,
      logout: action,
      authenticated: computed,
      userPersona: computed,
      fullName: computed,
      isExecutive: computed,
    });

    persistStore(this, ['token', 'executiveID'], StoreKeys.AUTH_STORE);
  }

  setToken(newToken: string | null) {
    this.token = newToken;
  }

  setUser(newUser: EmployeeUserModel | null) {
    this.user = newUser;
    const personaRoleId = newUser?.employeeRoles?.[0].personaRoleId;

    if (!!newUser && personaRoleId === AccountRole.ExecutiveAssistant) {
      this.executiveID = newUser?.employeeKeyId || null;
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    this.executiveID = null;
  }

  get authenticated() {
    return !!this.token;
  }

  get isExecutive() {
    return !!this.executiveID;
  }

  get userPersona() {
    if (this.user) {
      return this.user.employeeRoles;
    } else {
      return null;
    }
  }

  get fullName() {
    if (this.user) {
      return this.user.employeeFirstName + ' ' + this.user.employeeLastName;
    } else {
      return '';
    }
  }
}
