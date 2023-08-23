import {useMutation, useQuery} from 'react-query';

import {
  AuthenticateEmployeeService,
  EmployeeProfileService,
  LogInUserModel,
  SwitchAccountService,
} from '../api/api.service';

import {QueryKeys} from './config';

interface SwitchAccountReqBody {
  employeeKeyId: string | '';
}

export const useLogin = () => {
  return useMutation(
    [QueryKeys.LOGIN],
    (body: LogInUserModel) =>
      AuthenticateEmployeeService.employeeLogIn({
        body: body,
      }),
    {
      retry: false,
    },
  );
};

export const useLogout = () => {
  return useMutation([QueryKeys.LOGOUT], () =>
    AuthenticateEmployeeService.employeeLogOut(),
  );
};

export const useGetProfile = () => {
  return useQuery(
    [QueryKeys.USER_PROFILE],
    () => EmployeeProfileService.getEmployeeProfile(),
    {
      enabled: false,
    },
  );
};

export const useGetExecutiveList = (reqBody: SwitchAccountReqBody) => {
  return useQuery(
    [QueryKeys.GET_EXECUTIVE_LIST],
    () => SwitchAccountService.getExecutiveList(reqBody),
    {
      enabled: !!reqBody && !!reqBody.employeeKeyId,
    },
  );
};

export const useSwitchAccount = () => {
  return useMutation(
    [QueryKeys.SWITCH_ACCOUNT],
    (body: SwitchAccountReqBody) => SwitchAccountService.switchAccount(body),
    {
      retry: false,
    },
  );
};
