import {useQuery} from 'react-query';

import {WorkTypeService} from '../api/api.service';

import {QueryKeys} from './config';

export const useGetWorkTypes = () => {
  return useQuery([QueryKeys.WORK_TYPES], () => WorkTypeService.workType(), {
    refetchInterval: 300000,
    refetchIntervalInBackground: true,
  });
};
