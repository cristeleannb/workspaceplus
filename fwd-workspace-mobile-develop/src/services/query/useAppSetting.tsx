import {useQuery} from 'react-query';

import {ApplicationSettingService} from '../api/api.service';

import {QueryKeys} from './config';

export const useGetAppSetting = () => {
  return useQuery(
    [QueryKeys.APP_SETTING],
    () => ApplicationSettingService.getApplicationSetting(),
    {
      refetchInterval: 300000,
      refetchIntervalInBackground: true,
    },
  );
};

export const useGetBranchPrefix = () => {
  return useQuery([QueryKeys.GET_BRANCH_FREFIX], () =>
    ApplicationSettingService.getBranchNamePrefix(),
  );
};
